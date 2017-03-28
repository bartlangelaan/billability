import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('RefreshQueue', new Schema({
  profileId: {
    type: String,
    required: true,
    unique: true,
  },

}));
