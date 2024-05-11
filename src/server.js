const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const app = require('./app');
const runJobs = require('./jobs');

// handle uncaught exception errors
process.on('uncaughtException', (err) => {
	console.log(`ERROR: ${err.stack}`);
	console.log('Shutting down the server due to uncaught exception');
	process.exit(1);
});

// config env for localhost
dotenv.config({ path: 'config/config.env' });

(async () => {
	// connect database
	await connectDatabase();

	// run cron jobs
	// runJobs();
})();

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
