// tests/unit/movieService.test.js
const { listMovies } = require('../services/listMovies');
const Reserve = require('../../../models/reserve');
const Movie = require('../../../models/movie');
const Schedule = require('../../../models/schedule');
const { threeHoursAgo } = require('../utils');
const mongoose = require('mongoose');

jest.mock('../../../models/reserve');
jest.mock('../../../models/movie');
jest.mock('../../../models/schedule');

describe('listMovies', () => {
  test('should list available movies', async () => {
    Reserve.distinct.mockResolvedValue(['booked-movie-id-1', 'booked-movie-id-2']);
    Schedule.distinct.mockResolvedValue(['rented-movie-id-1', 'rented-movie-id-2']);

    Movie.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { id: 'available-movie-id-1', name: 'Movie 1', synopsis: 'Synopsis 1', rating: '5' },
          { id: 'available-movie-id-2', name: 'Movie 2', synopsis: 'Synopsis 2', rating: '4' },
        ]),
      }),
    });

    const result = await listMovies();

    expect(Reserve.distinct).toHaveBeenCalledWith('movie', { isConfirmed: false, reserveDate: { $gte: threeHoursAgo } });
    expect(Schedule.distinct).toHaveBeenCalledWith('movie', { returnDate: null });

    expect(Movie.find).toHaveBeenCalledWith({
      id: { $nin: ['booked-movie-id-1', 'booked-movie-id-2', 'rented-movie-id-1', 'rented-movie-id-2'] },
    });

    expect(Movie.find().select).toHaveBeenCalledWith('id name synopsis rating');

    expect(result).toEqual([
      { id: 'available-movie-id-1', name: 'Movie 1', synopsis: 'Synopsis 1', rating: '5' },
      { id: 'available-movie-id-2', name: 'Movie 2', synopsis: 'Synopsis 2', rating: '4' },
    ]);
  });
});
