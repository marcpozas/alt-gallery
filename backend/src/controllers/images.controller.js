import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import Image from '../models/image.model.js';

dotenv.config()

export async function getImages (req, res) {
    if (!req.query.count || !req.query.searchTerms) {
      return res.status(400).send({status: "Error", message: "Some fields are incomplete."})
    }

    const { count, searchTerms } = req.query;
    const searchTermsArray = searchTerms.split(" ");
    const numImages = parseInt(count);
    console.log(numImages);
    console.log(searchTermsArray);

    if (isNaN(numImages) || numImages <= 0) {
        return res.status(400).json({ error: 'Invalid count parameter' });
    }

    const images = await Image.find().limit(numImages);
    console.log(typeof searchTerms);

    // const searchTermsArray = JSON.parse(searchTerms || '[]');

    // const selectedStrings = images.map((image) => {
    //     return {
    //         imageId: image._id,
    //         strings: image.tags.filter((str) => searchTermsArray.includes(str)),
    //     };
    // });
    
    // res.status(200).json(selectedStrings);
}

export async function addImage(req, res) {
  try {
    const { imageLink, title, tags } = req.body;

    if (!imageLink) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    const token = req.headers.authorization.replace('Bearer ', ''); // Assuming JWT token in headers
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

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


/*
const Image = require('../models/Image'); // Assuming you have an Image model

exports.getImages = async (req, res) => {
  try {
    const { count, strings } = req.query; // Get the count and strings from query parameters

    // Validate and parse count
    const numImages = parseInt(count);
    if (isNaN(numImages) || numImages <= 0) {
      return res.status(400).json({ error: 'Invalid count parameter' });
    }

    // Query the database to get the desired number of images
    const images = await Image.find().limit(numImages);

    // Extract the requested strings from the images
    const selectedStrings = images.map((image) => {
      return {
        imageId: image._id,
        strings: image.strings.filter((str) => strings.includes(str)),
      };
    });

    res.status(200).json(selectedStrings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
*/