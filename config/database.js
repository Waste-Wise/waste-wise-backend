const mongoose = require('mongoose');

const connectDatabase = async () => {
	await mongoose.connect(process.env.DB_CLOUD_URI).then(async (con) => {
		console.log(`MongoDB connected with HOST: ${con.connection.host}`);
	});
};

module.exports = connectDatabase;
