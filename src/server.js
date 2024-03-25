const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const app = require('./app');

dotenv.config({ path: 'config/config.env' });

// Connect database
connectDatabase();

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
});