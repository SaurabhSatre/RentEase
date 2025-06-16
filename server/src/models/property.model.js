// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  rent: { type: Number, required: true, min: 0 },
  type: { type: String, required: true, enum: ['1BHK', '2BHK', '3BHK', 'Studio'] },
  description: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address',
    ],
  },
}, {
  timestamps: true
});

export default mongoose.model('Property', propertySchema);
