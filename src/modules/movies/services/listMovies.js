const Reserve = require('../../../models/reserve');
const Movie = require('../../../models/movie');
const Schedule = require('../../../models/schedule');
const { threeHoursAgo } = require('../utils');

const listMovies = async () => {
  const bookedMovieIds = await Reserve.distinct('movie', { isConfirmed: false, reserveDate: { $gte: threeHoursAgo } });
  const rentedMovieIds = await Schedule.distinct('movie', { returnDate: null });

  const availableMovies = await Movie.find({
    id: { $nin: [...bookedMovieIds, ...rentedMovieIds] },
  })
    .select('id name synopsis rating')
    .exec();


  return availableMovies.map((movie) => ({
    id: movie.id,
    name: movie.name,
    synopsis: movie.synopsis,
    rating: movie.rating,
  }));
}

module.exports = { listMovies };