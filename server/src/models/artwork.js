import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const artworkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year:{
    type: Number,
  },
  media: [{
    type: String,
  }],
  url:{
    type: String,
    required: true,
  },
  show: {
    type: Schema.Types.ObjectId,
    ref: 'Show'
  }
});

export default mongoose.model('Artwork', artworkSchema);
