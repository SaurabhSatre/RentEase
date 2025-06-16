import Product from '../models/property.model.js';

const getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.find({}); // Fetch all products
    res.status(200).json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error fetching products. Please try again later.' });
  }
};

export default getAllProducts;

