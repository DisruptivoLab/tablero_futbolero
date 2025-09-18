const mongoose = require('mongoose');

const FormationSchema = new mongoose.Schema({
  formationId: {
    type: String,
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
  formationString: {
    type: String,
    required: true // e.g., "4-3-3"
  },
  playersPositions: [{
    playerId: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    line: {
      type: String,
      required: true // 'defense', 'midfield', 'attack'
    }
  }],
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Formation', FormationSchema);