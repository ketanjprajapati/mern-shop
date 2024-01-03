const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const authenticateUser = require('../middleware/auth');
const uploads = require('../middleware/upload');

// Create Shop
router.post('/create', authenticateUser, uploads.any(), async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.files[0];
        // Validate name and image
        if (!name) {
            return res.status(400).json({ message: 'Shop name is required.' });
        }
        // Check if the shop name is unique for the logged-in user
        const existingShop = await Shop.findOne({ name, user: req.user._id });
        if (existingShop) {
            return res.status(400).json({ message: 'You already have a shop with this name.' });
        }
        // Create a new shop and associate it with the logged-in user
        const newShop = new Shop({
            name,
            image: file ? file.filename : 'default.jpg',
            user: req.user._id,
        });

        await newShop.save();

        res.json({ message: 'Shop created successfully.', shop: newShop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Update Shop
router.put('/update', authenticateUser, uploads.any(), async (req, res) => {
    try {
        const { name, shopId } = req.body;
        const file = req.files[0];
        // Validate name
        if (!name) {
            return res.status(400).json({ message: 'Shop name is required.' });
        }

        // Check if the shop name is unique for the logged-in user
        const existingShop = await Shop.findOne({ name, user: req.user._id, _id: { $ne: shopId } });

        if (existingShop) {
            return res.status(400).json({ message: 'You already have a shop with this name.' });
        }

        // Find and update the specified shop
        const updatedShop = await Shop.findByIdAndUpdate(
            shopId,
            { $set: { name, image: file ? file.filename : req.body.image ? req.body.image : 'default.jpg' } }, // Use file.filename if file is present, otherwise use req.body.image
            { new: true }
        );

        if (!updatedShop) {
            return res.status(404).json({ message: 'Shop not found.' });
        }

        res.json({ message: 'Shop updated successfully.', shop: updatedShop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// List Shops of the Logged-In User
router.get('/list', authenticateUser, async (req, res) => {
    try {
        // Fetch all shops of the logged-in user
        const shops = await Shop.find({ user: req.user._id }).populate('products');

        res.json({ shops });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;
