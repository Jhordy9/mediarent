const { returnMovie } = require('../services/returnMovie');
const Schedule = require("../../../models/schedule");

jest.mock('../../../models/schedule');

describe('returnMovie', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('should return a movie successfully', async () => {
    const mockRent = {
      scheduleId: 'valid-schedule-id',
      returnDate: null,
      save: jest.fn(),
    };

    Schedule.findOne = jest.fn().mockResolvedValue(mockRent);

    const scheduleId = 'valid-schedule-id';
    const result = await returnMovie(scheduleId);

    expect(Schedule.findOne).toHaveBeenCalledWith({ scheduleId });
    expect(mockRent.save).toHaveBeenCalled();

    expect(result).toEqual({
      scheduleId: 'valid-schedule-id',
      status: 'RETURNED',
    });
  });

  test('should throw not found error when schedule entry is not found', async () => {
    Schedule.findOne = jest.fn().mockResolvedValue(null);

    const scheduleId = 'non-existent-schedule-id';

    await expect(returnMovie(scheduleId)).rejects.toThrowError('Schedule entry not found.');
    expect(Schedule.findOne).toHaveBeenCalledWith({ scheduleId });
  });

  test('should throw bad request error when movie has already been returned', async () => {
    const mockRent = {
      scheduleId: 'valid-schedule-id',
      returnDate: new Date(),
    };

    Schedule.findOne = jest.fn().mockResolvedValue(mockRent);

    const scheduleId = 'valid-schedule-id';

    await expect(returnMovie(scheduleId)).rejects.toThrowError('Movie has already been returned.');
    expect(Schedule.findOne).toHaveBeenCalledWith({ scheduleId });
  });
});
