const supertest = require('supertest');
const app = require('../../../../app');
const mongoose = require('mongoose');
const Movie = require('../../../../models/movie');
const Reserve = require('../../../../models/reserve');
const Schedule = require('../../../../models/schedule');

const request = supertest(app);

beforeAll(async () => {
  await mongoose.connection.dropDatabase();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('MovieController - Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /all should return a list of movies', async () => {
    const movie = new Movie({
      id: 'valid-movie-id',
      name: 'Movie 1',
      synopsis: 'Synopsis 1',
      rating: '5',
    });

    await movie.save();

    const response = await request.get('/api/all');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body[0].id).toBe(movie.id);
  });

  test('POST /book should create a reserve and return the result', async () => {
    const movie = new Movie({
      id: 'valid-movie-id',
      name: 'Movie 1',
      synopsis: 'Synopsis 1',
      rating: '5',
    });

    await movie.save();

    const response = await request.post('/api/book').send({ movieId: movie.id });

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.reserveId).toBeDefined();
    expect(response.body.status).toBe('WAITING');
  });

  test('POST /confirm should confirm a reserve and return the result', async () => {
    const reserve = new Reserve({
      reserveId: 'valid-reserve-id',
      movie: 'valid-movie-id',
      isConfirmed: false,
      reserveDate: new Date(),
    });

    await reserve.save();

    const response = await request.post('/api/confirm').send({ reserveId: reserve.reserveId });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.scheduleId).toBeDefined();
    expect(response.body.status).toBe('LEASED');
  });

  test('POST /return should return a movie and return the result', async () => {
    const schedule = new Schedule({
      scheduleId: 'valid-schedule-id',
      movie: 'valid-movie-id',
      isReturned: false,
      rentDate: new Date(),
    });

    await schedule.save();

    const response = await request.post('/api/return').send({ scheduleId: schedule.scheduleId });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.scheduleId).toBeDefined();
    expect(response.body.status).toBe('RETURNED');
  });
});
