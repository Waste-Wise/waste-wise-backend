const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes/v1');
const errorMiddleware = require('./middleware/errors');

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api/v1', routes);
app.use('/', (req, res) => {
	res.send('Welcome to Waste Wise API');
});

app.use(errorMiddleware);

module.exports = app;
