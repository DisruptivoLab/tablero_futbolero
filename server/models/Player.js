const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  playerId: {
    type: Number,
    required: true,
    unique: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true,
    enum: ['GK', 'DF', 'MF', 'FW']
  },
  stats: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);