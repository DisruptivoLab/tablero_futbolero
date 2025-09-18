const mongoose = require('mongoose');

const savedFormationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameMode: {
    type: String,
    enum: ['single', 'dual'],
    required: true
  },
  formation: {
    type: String,
    default: '-'
  },
  playersOnPitch: [{
    playerId: Number,
    teamKey: String,
    x: Number,
    y: Number,
    role: String
  }],
  ballPosition: {
    x: Number,
    y: Number
  },
  drawingData: {
    type: String, // Base64 encoded canvas data
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedFormation', savedFormationSchema);