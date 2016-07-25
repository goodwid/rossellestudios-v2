const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const showSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year:{
    type: Number,
  },
  location: {
    type: String,
  }
});

module.exports = mongoose.model('Show', showSchema);
