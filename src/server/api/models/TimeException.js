import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('TimeException', new Schema({
  profileId: {
    type: String,
    required: true,
  },
  employee: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    default: 0,
  },
}));
