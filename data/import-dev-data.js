const fs = require('fs');
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE_LOCAL;

(async () => {
  try {
    await mongoose.connect(db);
    console.log('Database connection successful...');
  } catch (err) {
    console.error(`Connection error: ${err}`);
  }
})();

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

const insertData = async () => {
  try {
    await Product.create(products);
    console.log('products created successfully');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('data deleted successfully');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  insertData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
