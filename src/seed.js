const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Movie = require('./models/movie');

mongoose.connect('mongodb://localhost:27017/mediarent');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const seedData = Array.from({ length: 10 }, (_, index) => ({
    id: uuidv4(),
    name: `Movie ${index + 1}`,
    synopsis: `Synopsis for Movie ${index + 1}`,
    rating: `${Math.floor(Math.random() * 10)}/10`,
  }));

  try {
    await Movie.insertMany(seedData);
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error inserting seed data:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
});
