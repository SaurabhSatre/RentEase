import Property from '../models/property.model.js';

const addProperty = async (req, res) => {
  try {
    // console.log(req.body);
    const { title, city, rent, type, description } = req.body;
    const email = req.userDetails.email;

    if (!title || !city || !rent || !type || !description) {
      return res.status(400).json({
        message: 'All property fields (title, city, rent, type, description) are required.'
      });
    }

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title must be a non-empty string.' });
    }

    if (typeof city !== 'string' || city.trim().length === 0) {
      return res.status(400).json({ message: 'City must be a non-empty string.' });
    }

    if (typeof type !== 'string' || !['1BHK', '2BHK', '3BHK', 'Studio'].includes(type)) {
      return res.status(400).json({ message: 'Type must be one of 1BHK, 2BHK, 3BHK, or Studio.' });
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ message: 'Description must be a non-empty string.' });
    }

    const parsedRent = parseFloat(rent);
    if (isNaN(parsedRent) || parsedRent <= 0) {
      return res.status(400).json({ message: 'Rent must be a positive number.' });
    }

    const newProperty = new Property({
      title: title.trim(),
      city: city.trim(),
      rent: parsedRent,
      type: type.trim(),
      description: description.trim(),
      email
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);

  } catch (error) {
    console.error('Add property error:', error);
    res.status(500).json({ message: 'Server error adding property. Please try again later.' });
  }
};

export default addProperty;