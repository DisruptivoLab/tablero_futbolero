const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Team = require('../models/Team');

// GET all players, optional filter by teamId
router.get('/', async (req, res) => {
  try {
    const { teamId } = req.query;
    let query = {};
    if (teamId) {
      query.team = teamId;
    }
    const players = await Player.find(query).populate('team', 'name');
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET player by id
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team', 'name');
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new player
router.post('/', async (req, res) => {
  const player = new Player(req.body);
  try {
    const newPlayer = await player.save();
    // Add to team's players array if teamId provided
    if (req.body.team) {
      await Team.findByIdAndUpdate(req.body.team, { $push: { players: newPlayer._id } });
    }
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update player
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    Object.assign(player, req.body);
    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE player
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    await player.remove();
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;