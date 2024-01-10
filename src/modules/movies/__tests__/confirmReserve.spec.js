const { confirmReserve } = require('../services/confirmReserve');
const Reserve = require('../../../models/reserve');
const Schedule = require('../../../models/schedule');

jest.mock('../utils', () => ({
  threeHoursAgo: new Date(Date.now() - 3 * 60 * 60 * 1000),
}));

describe('confirmReserve', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('should confirm a booking and create a schedule entry', async () => {
    const mockBooking = {
      reserveId: 'valid-reserve-id',
      movie: 'valid-movie-id',
      isConfirmed: false,
      reserveDate: new Date(),
      save: jest.fn(),
    };

    Reserve.findOne = jest.fn().mockResolvedValue(mockBooking);
    Schedule.save = jest.fn().mockResolvedValue({
      scheduleId: 'valid-schedule-id',
    });

    const reserveId = 'valid-reserve-id';
    const result = await confirmReserve(reserveId);

    expect(Reserve.findOne).toHaveBeenCalledWith({ reserveId });
    expect(mockBooking.save).toHaveBeenCalled();

    expect(result.status).toEqual('LEASED');
    expect(result.scheduleId).toBeDefined();
  });

  test('should throw not found error when reserve is not found', async () => {
    Reserve.findOne = jest.fn().mockResolvedValue(null);
    const reserveId = 'non-existent-reserve-id';

    await expect(confirmReserve(reserveId)).rejects.toThrowError('Reserve not found.');
    expect(Reserve.findOne).toHaveBeenCalledWith({ reserveId });
  });

  test('should throw bad request error when reserve has already been confirmed', async () => {
    const mockBooking = {
      reserveId: 'valid-reserve-id',
      isConfirmed: true,
    };

    Reserve.findOne = jest.fn().mockResolvedValue(mockBooking);
    const reserveId = 'valid-reserve-id';

    await expect(confirmReserve(reserveId)).rejects.toThrowError('Reserve has already been confirmed.');
    expect(Reserve.findOne).toHaveBeenCalledWith({ reserveId });
  });

  test('should throw bad request error when reserve has expired', async () => {
    const mockReserve = {
      reserveId: 'valid-reserve-id',
      isConfirmed: false,
      reserveDate: new Date(Date.now() - 3 * 60 * 60 * 1500),
      save: jest.fn(),
      movie: 'valid-movie-id',
    };

    Reserve.findOne = jest.fn().mockResolvedValue(mockReserve);

    const reserveId = 'valid-reserve-id';

    await expect(confirmReserve(reserveId)).rejects.toThrowError('Reserve has expired.');
    expect(Reserve.findOne).toHaveBeenCalledWith({ reserveId });
    expect(mockReserve.save).not.toHaveBeenCalled();
  });
});
