import mongoose from 'mongoose';

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

export default mongoose.model('Show', showSchema);
