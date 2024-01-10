const { badRequest, notFound } = require('@hapi/boom');
const Reserve = require('../../../models/reserve');
const Schedule = require('../../../models/schedule');
const { threeHoursAgo } = require('../utils');

async function confirmReserve(reserveId) {
  const reserve = await Reserve.findOne({ reserveId });

  if (!reserve) {
    throw notFound('Reserve not found.');
  }

  if (reserve.isConfirmed) {
    throw badRequest('Reserve has already been confirmed.');
  }
  console.log(reserve.reserveDate < threeHoursAgo, { reserveDate: reserve.reserveDate, threeHoursAgo })

  if (reserve.reserveDate < threeHoursAgo) {
    throw badRequest('Reserve has expired.');
  }

  reserve.isConfirmed = true;
  await reserve.save();


  const rent = new Schedule({
    movie: reserve.movie,
    scheduleDate: new Date(),
  });

  await rent.save();

  return {
    scheduleId: rent.scheduleId,
    status: 'LEASED',
  };
}

module.exports = {
  confirmReserve,
};
