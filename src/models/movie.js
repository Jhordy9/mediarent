const mongoose = require('mongoose');
const uuidv4 = require('uuid');

const movieSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4.v4(), required: true, unique: true },
  name: { type: String, required: true },
  synopsis: { type: String, required: true },
  rating: { type: String, required: true },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;