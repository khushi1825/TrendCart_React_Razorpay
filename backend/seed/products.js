const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Floral Summer Dress',
    description: 'Elegant floral summer dress',
    price: 4999,
    image: 'https://...',
    category: 'dress',
    stock: 20
  },

  {
    name: 'Elegant Blazer',
    description: 'Classic elegant blazer',
    price: 8999,
    image: 'https://...',
    category: 'jacket',
    stock: 15
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log('Products added successfully');

    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
}

seedProducts();