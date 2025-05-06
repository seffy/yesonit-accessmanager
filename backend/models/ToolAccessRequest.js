const mongoose = require('mongoose');
const Counter = require('./Counter');

const toolAccessRequestSchema = new mongoose.Schema({
  requestId: { type: Number, unique: true },
  requestType: { type: String, enum: ['self', 'someone_else'], required: true },
  requesterName: { type: String, required: true },
  toolName: { type: String, required: true },
  employeeId: { type: String },
  employeeEmail: { type: String },
  approverEmail: { type: String, required: true },
  justification: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

// Auto increment requestId before saving
toolAccessRequestSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'requestId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.requestId = counter.seq;
  }
  next();
});

module.exports = mongoose.model('ToolAccessRequest', toolAccessRequestSchema);