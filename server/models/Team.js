const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true
  },
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  textColor: {
    type: String,
    required: true
  },
  type: {
    type: String, // 'local' or 'visitor'
    enum: ['local', 'visitor'],
    default: 'local'
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  formationsHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formation'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);