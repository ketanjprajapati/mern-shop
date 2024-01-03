const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');  // Import Shop model
const authenticateUser = require('../middleware/auth');
const uploads = require('../middleware/upload');

// Add Product to Shop
router.post('/add', authenticateUser, uploads.any(), async (req, res) => {
    try {
        const { name, quantity, shopId } = req.body;
        const file = req.files[0];
        // Validate name, image, and quantity
        if (!name || !quantity || !shopId) {
            return res.status(400).json({ message: 'Name, image, and quantity are required.' });
        }

        // Find the shop
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found.' });
        }

        // Add a new product to the shop
        const newProduct = await shop.addProduct(name, file ? file.filename : 'default.jpg', quantity);
        const shops = await Shop.find({ _id: shopId }).populate('products');
        res.json({ message: 'Product added successfully.', products: shops[0]?.products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Update Product
router.put('/update', authenticateUser, uploads.any(), async (req, res) => {
    try {
        const { name, shopId, productId, quantity, image } = req.body;
        const file = req.files[0];
        // Validate name, image, and quantity
        if (!name || !quantity) {
            return res.status(400).json({ message: 'Name and quantity are required.' });
        }

        // Find the shop containing the product
        const shop = await Shop.findOne({ '_id': shopId });

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found.' });
        }

        // Update the product within the shop
        const updatedProduct = await shop.updateProduct(productId, name, file ? file.filename : req.body.image ? req.body.image : 'default.jpg', quantity);
        const shops = await Shop.find({ _id: shopId }).populate('products');
        return res.json({ message: 'Product updated successfully.', products: shops[0]?.products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;
