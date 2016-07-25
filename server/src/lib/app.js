import express from 'express';
import morgan from 'morgan';
import cors from './cors';
import auth from '../routes/auth';
import artworks from '../routes/artworks';


const app = express();

if (!process.env.TEST) app.use(morgan('dev'));
app.use(cors(process.env.CLIENT_URL));
app.use('/', auth);
app.use('/api/artwork', artworks);
app.use('/api/show', shows);

app.use((err, req, res, next) => { // eslint-disable-line
  if (!process.env.TEST) console.error(err); // eslint-disable-line
  res.status(err.code || 500).json({
    code: 500,
    error: err.error || 'Server error',
    msg: err.msg,
  });
});

export default app;
