const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const app = require('./app');

dotenv.config({ path: 'config/config.env' });

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});