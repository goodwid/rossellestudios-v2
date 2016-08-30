const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const artwork = new Schema({
  title: {
    type: String,
    required: true,
  },
  year:{
    type: Number,
  },
  media: {
    type: String,
  },
  url:{
    type: String,
    required: true,
  },
  showId: {
    type: Schema.Types.ObjectId,
    ref: 'Show'
  }
});

module.exports = mongoose.model('Artwork', artwork);
