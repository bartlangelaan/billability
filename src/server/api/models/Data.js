import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('Data', new Schema({
  profileId: {
    type: String,
    unique: true,
    required: true,
  },
  projects: Schema.Types.Mixed,
  employees: Schema.Types.Mixed,
  TimeTransactions: Schema.Types.Mixed,
  Employees: Schema.Types.Mixed,
  Projects: Schema.Types.Mixed,
  Items: Schema.Types.Mixed
}));
