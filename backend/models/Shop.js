const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: String,
    quantity: { type: Number, default: 0 },
});

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [productSchema],
});

// Method to add a new product to the shop
shopSchema.methods.addProduct = async function (productName, productImage, productQuantity) {
    const newProduct = {
        name: productName,
        image: productImage || 'default.jpg',
        quantity: productQuantity || 0,
    };

    this.products.push(newProduct);
    await this.save();
    return newProduct;
};

// Method to update an existing product in the shop
shopSchema.methods.updateProduct = async function (productId, productName, productImage, productQuantity) {
    const productToUpdate = this.products.id(productId);

    if (!productToUpdate) {
        throw new Error('Product not found.');
    }

    productToUpdate.name = productName;
    productToUpdate.image = productImage || (productImage === '' ? '' : 'default.jpg');
    productToUpdate.quantity = productQuantity || 0;

    await this.save();
    return productToUpdate;
};

module.exports = mongoose.model('Shop', shopSchema);
