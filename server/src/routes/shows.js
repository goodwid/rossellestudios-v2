const express = require('express');
const bodyParser = require('body-parser');
const isAuth = require('../lib/isAuth');
const Show = require('../models/show');

const router = express.Router(); // eslint-disable-line
const jsonParser = bodyParser.json();

module.exports = router
  .get('/', (req, res, next) => {
    Show
      .find()
      .then(shows => {
        if (shows) res.json(shows);
        else next({code: 404, msg: 'No show found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  })
  .get('/:id', (req, res, next) => {
    Show
      .findById(req.params.id)
      .then(show => {
        if (show) res.json(show);
        else next({code: 404, msg: 'No show found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  })
  .get('/byShow/:showId', (req, res, next) => {
    Show
      .find({show: req.params.showId})
      .then(shows => {
        if (shows) res.json(shows);
        else next({code: 404, msg: 'No show found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  })
  .post('/', isAuth, jsonParser, (req, res, next) => {
    new Show(req.body)
    .save()
    .then(posted => {
      if (posted) res.json(posted);
      else next({code: 404, msg: 'No show found'});
    })
    .catch(err => {
      next({code: 500, error: err, msg: 'Server error.'});

    });
  })
  .put('/:id', isAuth, jsonParser, (req, res, next) => {
    Show
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      .then(show => {
        if (show) res.json(show);
        else next({code: 404, msg: 'No show found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });

  })
  .delete('/:id', isAuth, jsonParser, (req, res, next) => {
    Show
      .findByIdAndRemove(req.params.id)
      .then(show => {
        if (show) res.json(show);
        else next({code: 404, msg: 'No show found'});
      })
      .catch(err => {
        next({code: 500, error: err, msg: 'Server error.'});
      });
  });
