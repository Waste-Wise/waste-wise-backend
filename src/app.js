const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/v1', routes);
app.use('/', (req, res) => {
  res.send('Welcome to Waste Wise API');
});

module.exports = app;
