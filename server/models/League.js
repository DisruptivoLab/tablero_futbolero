const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
  leagueId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('League', LeagueSchema);