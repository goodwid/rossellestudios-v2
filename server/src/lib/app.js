const express = require('express');
const morgan = require('morgan');
const cors = require('./cors');
const errorHandler = require('./errorHandler');
const auth = require('../routes/auth');
const artworks = require('../routes/artworks');
const shows = require('../routes/shows');

const app = express();

if (!process.env.TEST) app.use(morgan('dev'));
app.use(cors(process.env.CLIENT_URL));
app.use('/api', auth);
app.use('/api/artwork', artworks);
app.use('/api/show', shows);

app.use(errorHandler);

module.exports = app;
