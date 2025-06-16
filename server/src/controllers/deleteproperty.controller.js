import Product from '../models/property.model.js';

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserEmail = req.userDetails.email;

    // Validate ID format
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required for deletion.' });
    }

    if (typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found with the provided ID.' });
    }

    // Authorization check
    if (product.email !== currentUserEmail) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own property.' });
    }

    // Perform delete
    await product.deleteOne();  // slightly more efficient than findByIdAndDelete when already fetched

    res.json({ message: 'Product deleted successfully.' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product. Please try again later.' });
  }
};

export default deleteProduct;
