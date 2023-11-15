import Image from '../models/image.model.js';

export async function getImages (req, res) {
    const { count, searchTerms } = req.query;

    const numImages = parseInt(count);
    if (isNaN(numImages) || numImages <= 0) {
        return res.status(400).json({ error: 'Invalid count parameter' });
    }

    const images = await Image.find().limit(numImages);

    const searchTermsArray = JSON.parse(searchTerms || '[]');

    const selectedStrings = images.map((image) => {
        return {
            imageId: image._id,
            strings: image.tags.filter((str) => searchTermsArray.includes(str)),
        };
    });
    
    res.status(200).json(selectedStrings);
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