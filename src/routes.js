const { Router } = require('express');
const { MovieController } = require('./modules/movies/controller');

const router = Router();

router.use('/', MovieController);

module.exports = router;