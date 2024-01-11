const { notFound, badRequest } = require("@hapi/boom");
const Schedule = require("../../../models/schedule");

const returnMovie = async (scheduleId) => {
  const rent = await Schedule.findOne({ scheduleId });

  if (!rent) {
    throw notFound('Schedule entry not found.');
  }

  if (rent.returnDate) {
    throw badRequest('Movie has already been returned.');
  }

  rent.returnDate = new Date();
  await rent.save();

  return {
    scheduleId: rent.scheduleId,
    status: 'RETURNED',
  };
}

module.exports = {
  returnMovie,
};