import express from 'express';
import bodyParser from 'body-parser';
import Artwork from '../models/artwork';
import isAuth from '../lib/isAuth';

const router = express.Router(); // eslint-disable-line
const jsonParser = bodyParser.json();

router
  .get('/', (req, res, next) => {
    Artwork
      .find()
      .then(artworks => {
        if (artworks) res.json(artworks);
        else next({code: 404, msg: 'No artwork found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  })
  .get('/:id', (req, res, next) => {
    Artwork
      .findById(req.params.id)
      .then(artwork => {
        if (artwork) res.json(artwork);
        else next({code: 404, msg: 'No artwork found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  })
  .get('/byShow/:showId', (req, res, next) => {
    Artwork
      .find({show: req.params.showId})
      .then(artworks => {
        if (artworks) res.json(artworks);
        else next({code: 404, msg: 'No artwork found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  })
  .post('/', isAuth, jsonParser, (req, res, next) => {
    new Artwork(req.body)
    .save()
    .then(posted => {
      if (posted) res.json(posted);
      else next({code: 404, msg: 'No artwork found'});
    })
    .catch(err => {
      next({code: 500, error: err, msg: 'Server error.'});

    });
  })
  .put('/:id', isAuth, jsonParser, (req, res, next) => {
    Artwork
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      .then(artwork => {
        if (artwork) res.json(artwork);
        else next({code: 404, msg: 'No artwork found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });

  })
  .delete('/:id', isAuth, jsonParser, (req, res, next) => {
    artwork.findByIdAndRemove(req.params.id)
      .then(artwork => {
        if (artwork) res.json(artwork);
        else next({code: 404, msg: 'No artwork found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  });
