const express = require('express');
const router = express.Router();
const League = require('../models/League');

// GET all leagues
router.get('/', async (req, res) => {
  try {
    const leagues = await League.find().populate('teams', 'name logo color');
    res.json(leagues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET league by id
router.get('/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id).populate('teams', 'name logo color');
    if (!league) return res.status(404).json({ message: 'League not found' });
    res.json(league);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new league
router.post('/', async (req, res) => {
  const league = new League(req.body);
  try {
    const newLeague = await league.save();
    res.status(201).json(newLeague);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update league
router.put('/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });
    Object.assign(league, req.body);
    const updatedLeague = await league.save();
    res.json(updatedLeague);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE league
router.delete('/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });
    await league.remove();
    res.json({ message: 'League deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;