const { Router } = require('express');
const { listMovies } = require('./services/listMovies');
const { bookMovie } = require('./services/bookMovie');
const { StatusCodes } = require('http-status-codes');
const { confirmReserve } = require('./services/confirmReserve');
const { returnMovie } = require('./services/returnMovie');

const MovieController = Router();

MovieController.get('/all', async (_req, res) => {
  const movies = await listMovies();

  return res.status(StatusCodes.OK).json(movies);

});

MovieController.post('/book', async (req, res) => {
  const booking = await bookMovie(req.body.movieId);

  return res.status(StatusCodes.CREATED).json(booking);

});

MovieController.post('/confirm', async (req, res) => {
  const rent = await confirmReserve(req.body.reserveId);

  return res.status(StatusCodes.OK).json(rent);

});

MovieController.post('/return', async (req, res) => {
  const rentReturn = await returnMovie(req.body.scheduleId);

  return res.status(StatusCodes.OK).json(rentReturn);

});


module.exports = { MovieController };