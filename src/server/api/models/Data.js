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
  Items: Schema.Types.Mixed,
  weeks: Schema.Types.Mixed,
  state: Number,
  stats: new Schema({
    timeTransactionsLoaded: {
      type: Number,
      default: 0
    },
    activeEmploymentsLoaded: {
      type: Number,
      default: 0
    },
    employeesLoaded: {
      type: Number,
      default: 0
    },
    projectsLoaded: {
      type: Number,
      default: 0
    },
    error: Schema.Types.Mixed,
  }),
}));
