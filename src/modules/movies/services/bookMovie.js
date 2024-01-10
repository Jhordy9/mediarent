const { badRequest, notFound } = require('@hapi/boom');
const Reserve = require('../../../models/reserve');
const { isMovieAvailableForBooking } = require('../utils');
const Movie = require('../../../models/movie');

const bookMovie = async (movieId) => {
  const isAvailable = await isMovieAvailableForBooking(movieId);
  const movie = await Movie.findOne({ id: movieId });

  if (!movie) {
    throw notFound('Movie not found.');
  }

  if (!isAvailable) {
    throw badRequest('Movie is not available for booking.');
  }

  const reserve = new Reserve({
    movie: movieId,
    reserveDate: new Date(),
  });

  await reserve.save();

  return {
    reserveId: reserve.reserveId,
    status: 'WAITING'
  };
}

module.exports = {
  bookMovie,
};
