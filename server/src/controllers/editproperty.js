// controllers/editProperty.controller.js
import Property from '../models/property.model.js';

const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, city, rent, type, description } = req.body;

    const currentUserEmail = req.userDetails.email;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: 'Property ID is required for editing.' });
    }

    if (typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid property ID format.' });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check email match
    if (property.email !== currentUserEmail) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own property.' });
    }

    // Ensure at least one field is being updated
    if (!title && !city && !rent && !type && !description) {
      return res.status(400).json({
        message: 'At least one field (title, city, rent, type, or description) is required for update.',
      });
    }

    const updateFields = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: 'Title must be a non-empty string if provided.' });
      }
      updateFields.title = title.trim();
    }

    if (city !== undefined) {
      if (typeof city !== 'string' || city.trim().length === 0) {
        return res.status(400).json({ message: 'City must be a non-empty string if provided.' });
      }
      updateFields.city = city.trim();
    }

    if (rent !== undefined) {
      const parsedRent = parseFloat(rent);
      if (isNaN(parsedRent) || parsedRent <= 0) {
        return res.status(400).json({ message: 'Rent must be a positive number if provided.' });
      }
      updateFields.rent = parsedRent;
    }

    if (type !== undefined) {
      if (typeof type !== 'string' || type.trim().length === 0) {
        return res.status(400).json({ message: 'Type must be a non-empty string if provided.' });
      }
      updateFields.type = type.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({ message: 'Description must be a non-empty string if provided.' });
      }
      updateFields.description = description.trim();
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found with the provided ID.' });
    }

    res.json(updatedProperty);
  } catch (error) {
    console.error('Edit property error:', error);
    res.status(500).json({ message: 'Server error updating property. Please try again later.' });
  }
};

export default editProperty;
