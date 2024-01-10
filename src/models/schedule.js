const mongoose = require('mongoose');
const uuidv4 = require('uuid');

const scheduleSchema = new mongoose.Schema({
  scheduleId: { type: String, default: () => uuidv4.v4(), required: true, unique: true },
  movie: { type: String, ref: 'Movie', required: true },
  scheduleDate: { type: Date, default: Date.now, required: true },
  returnDate: { type: Date },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;