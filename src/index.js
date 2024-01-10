const app = require('./app');
const { PORT, HOST } = require('./config');
const connectMongodb = require('./services/db');

async function start() {
  try {
    await connectMongodb();

    app.listen(PORT, () => {
      console.info(`HTTP server is listening at ${PORT}`);
      console.info(`REST API is available at ${HOST}/api/`);
    });
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

void start();
