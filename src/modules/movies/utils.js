const Reserve = require('../../models/reserve');
const Schedule = require('../../models/schedule');

const currentDate = new Date();
const threeHoursAgo = new Date(currentDate.getTime() - 3 * 60 * 60 * 1000);

const isMovieAvailableForBooking = async (movieId) => {
  const bookedMovieIds = await Reserve.distinct('movie', { isConfirmed: false, reserveDate: { $gte: threeHoursAgo } });
  const rentedMovieIds = await Schedule.distinct('movie', { returnDate: null });

  return !bookedMovieIds.includes(movieId) && !rentedMovieIds.includes(movieId);
}

module.exports = { threeHoursAgo, isMovieAvailableForBooking };