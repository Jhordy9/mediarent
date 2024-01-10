const { bookMovie } = require('../services/bookMovie');
const { isMovieAvailableForBooking } = require('../utils');
const Reserve = require('../../../models/reserve');
const Movie = require('../../../models/movie');
const mongoose = require('mongoose');

jest.mock('../utils', () => ({
  isMovieAvailableForBooking: jest.fn(),
}));

beforeAll(async () => {
  await mongoose.connection.dropDatabase();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('bookMovie', () => {
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  test('should reserve a movie successfully', async () => {
    isMovieAvailableForBooking.mockResolvedValue(true);

    const movie = new Movie({
      id: 'valid-movie-id',
      name: 'Movie 1',
      synopsis: 'Synopsis 1',
      rating: '5',
    });

    await movie.save();

    const movieId = 'valid-movie-id';
    const result = await bookMovie(movieId);

    expect(isMovieAvailableForBooking).toHaveBeenCalledWith(movieId);

    const booking = await Reserve.findOne({ movie: movieId });
    expect(booking).toBeDefined();
    expect(booking.movie).toEqual(movieId);
    expect(booking.reserveDate).toEqual(expect.any(Date));

    expect(result).toEqual({
      reserveId: booking.reserveId,
      status: 'WAITING',
    });
  });

  test('should throw not found error when the movie is not found', async () => {
    isMovieAvailableForBooking.mockResolvedValue(true);

    const movieId = 'non-existent-movie-id';

    await expect(bookMovie(movieId)).rejects.toThrowError('Movie not found.');
    expect(isMovieAvailableForBooking).toHaveBeenCalledWith(movieId);
  });

  test('should throw bad request error when the movie is not available for booking', async () => {
    isMovieAvailableForBooking.mockResolvedValue(false);

    const movie = new Movie({
      id: 'valid-movie-id',
      name: 'Movie 1',
      synopsis: 'Synopsis 1',
      rating: '5',
    });

    await movie.save();

    const movieId = 'valid-movie-id';

    await expect(bookMovie(movieId)).rejects.toThrowError('Movie is not available for booking.');
    expect(isMovieAvailableForBooking).toHaveBeenCalledWith(movieId);
  });
});
