const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const app = require('./app');

// handle uncaught exception errors
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

dotenv.config({ path: 'config/config.env' });

// connect database
connectDatabase();

// setup server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
});

// handle unhandled promise rejection errors
process.on('unhandledRejection', (err) => {
  console.log(`Error ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection');

  server.close(() => {
    process.exit(1);
  });
});
