const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');


module.exports = async () => {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);

  mongoose.connection.on('error', (err) => {
    console.error(err);
  });

  mongoose.connection.once('open', () => {
    console.log('Connected to in-memory MongoDB');
  });
};