require('express-async-errors');

const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { errorHandler } = require('./middlewares/errorHandler');
const router = require('./routes');

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(StatusCodes.OK).send('It works!');
});

app.use('/api', router);

app.use(errorHandler);

module.exports = app;
