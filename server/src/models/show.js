const mongoose = require('mongoose');
const Artwork = require('./artwork');
const Schema = mongoose.Schema;

const show = new Schema({
  title: {
    type: String,
    required: true,
  },
  year:{
    type: Number,
  },
  location: {
    type: String,
  },
  artworks: [{
    type: Schema.Types.ObjectId,
    ref: 'Artwork'
  }]
});

// show.statics.getFullDetail = function (id) {
//   Promise.all([
//     this.findById(id).lean(),
//     Show.find({showId: id}).lean()
//   ])
//   .then(results => {
//     const artworks = results[0];
//     const show = results[1];
//
//   })
// }

module.exports = mongoose.model('Show', show);
