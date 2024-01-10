const assertEnvVarPresent = (
  value,
  envName
) => {
  if (value == null) {
    throw new Error(
      `Required environment variable missing on init: ${envName}`
    );
  }
  // toString is to guard against pure number environment variables
  return value.toString();
}

const PORT = process.env.PORT ?? 3000;
const HOST = assertEnvVarPresent(process.env.HOST, 'HOST').endsWith('/')
  ? process.env.HOST.slice(0, -1)
  : process.env.HOST;
const MONGO_URL = assertEnvVarPresent(
  process.env.MONGO_URL,
  'MONGO_URL'
);

module.exports = { PORT, HOST, MONGO_URL };
