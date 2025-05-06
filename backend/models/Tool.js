const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  toolName: { type: String, required: true, unique: true },
  pointOfContact: { type: String }
});

module.exports = mongoose.model('Tool', toolSchema);