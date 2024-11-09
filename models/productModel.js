const mongoose = require('mongoose');

// Define Product schema for inventory
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number, // Available stock
  price: Number,
  description: String,
  category: String,
}, { timestamps: true }); // Automatically add createdAt and updatedAt

// Specify the collection name explicitly
const Product = mongoose.model('Product', productSchema, 'inventories');

module.exports = Product;
