const express = require('express');
const morgan = require('morgan');
const cors = require('./cors');
const auth = require('../routes/auth');
const artworks = require('../routes/artworks');
const shows = require('../routes/shows');


const app = express();

if (!process.env.TEST) app.use(morgan('dev'));
app.use(cors(process.env.CLIENT_URL));
app.use('/', auth);
app.use('/api/artwork', artworks);
app.use('/api/show', shows);

app.use((err, req, res, next) => { // eslint-disable-line
  let code = err.code || 500;
  if (!process.env.TEST) console.error(err);
  res.status(code).json({
    code,
    error: err.error || 'Server error',
    msg: err.msg,
  });
});

module.exports = app;
