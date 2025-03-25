const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Product } = require('../models/product.model');

const MONGODB_URL = 'mongodb://localhost:27017/qkart';

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Read and parse products data
    const productsData = fs.readFileSync(path.join(__dirname, '../../data/export_qkart_products.json'), 'utf8')
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const data = JSON.parse(line);
        // Convert MongoDB extended JSON format to plain JSON
        return {
          _id: data._id.$oid,
          name: data.name,
          category: data.category,
          cost: data.cost,
          rating: data.rating,
          image: data.image
        };
      });

    // Insert products
    await Product.insertMany(productsData);
    console.log('Imported products successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData(); 