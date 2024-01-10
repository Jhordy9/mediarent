const mongoose = require('mongoose');
const uuidv4 = require('uuid');

const reserveSchema = new mongoose.Schema({
  reserveId: { type: String, default: () => uuidv4.v4(), required: true, unique: true },
  movie: { type: String, ref: 'Movie', required: true },
  reserveDate: { type: Date, default: Date.now, required: true },
  isConfirmed: { type: Boolean, default: false },
});

const Reserve = mongoose.model('Reserve', reserveSchema);

module.exports = Reserve;