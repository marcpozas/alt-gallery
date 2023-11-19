import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import Image from '../models/image.model.js';
import User from '../models/user.model.js';

dotenv.config()

export async function getImages (req, res) {
  try {
    const { page, count, searchTerms } = req.query;
    const searchTermsArray = searchTerms.split(" ");

    if (!count || !searchTermsArray || !Array.isArray(searchTermsArray) || searchTermsArray.length === 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const numImages = parseInt(count);
    const numPage = parseInt(page);

    if (!numImages || isNaN(numImages) || numImages <= 0) {
      return res.status(400).json({ error: 'Invalid count parameter' });
    }

    if (!numPage || isNaN(numPage) || numPage < 1) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    const skip = (numPage - 1) * numImages;
    
    const query = { tags: { $in: searchTermsArray } };

    const images = await Image.find(query)
      .skip(skip)
      .limit(numImages)
      .select('title imageLink')
      .populate('user', 'username');

    // const imageLinks = images.map((image) => image.imageLink);

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function addImage(req, res) {
  try {
    const { imageLink, title, tags } = req.body;

    if (!imageLink) {
      return res.status(400).json({ error: 'No image URL provided' });
    }
    console.log(req.headers.authorization);

    const token = req.headers.authorization.replace('Bearer ', ''); // Assuming JWT token in headers
    const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    console.log(decodedToken);
    console.log(userId);

    // Create a new Image document in the database
    const newImage = new Image({
      user: userId,
      imageLink: imageLink,
      title: title,
      tags: tags
      // Other image properties you want to store
    });

    // Save the new image document to the database
    await newImage.save();

    res.status(201).json({ message: 'Image URL added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getUserImages (req, res) {
  try {
    const { page, count, username } = req.query;

    const numImages = parseInt(count);
    const numPage = parseInt(page);

    if (!numImages || isNaN(numImages) || numImages <= 0) {
      return res.status(400).json({ error: 'Invalid count parameter' });
    }

    if (!numPage || isNaN(numPage) || numPage < 1) {
      return res.status(400).json({ error: 'Invalid page parameter' });
    }

    const skip = (numPage - 1) * numImages;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const query = { user: user._id };

    const images = await Image.find(query)
      .skip(skip)
      .limit(numImages);

    const imageLinks = images.map((image) => image.imageLink);

    res.status(200).json(imageLinks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}