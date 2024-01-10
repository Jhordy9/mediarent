const mongoose = require('mongoose');
const { MONGO_URL } = require('../config');

async function connectMongodb() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected!');
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
    throw new Error('Unable to connect to MongoDB');
  }
};


module.exports = connectMongodb;