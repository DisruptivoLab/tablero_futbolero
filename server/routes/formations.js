const express = require('express');
const router = express.Router();
const Formation = require('../models/Formation');

// GET all formations, optional filter by teamId
router.get('/', async (req, res) => {
  try {
    const { teamId } = req.query;
    let query = {};
    if (teamId) {
      query.team = teamId;
    }
    const formations = await Formation.find(query).populate('team', 'name logo');
    res.json(formations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET formation by id
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id).populate('team', 'name logo');
    if (!formation) return res.status(404).json({ message: 'Formation not found' });
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new formation
router.post('/', async (req, res) => {
  const formation = new Formation(req.body);
  try {
    const newFormation = await formation.save();
    // Add to team's formationsHistory if teamId provided
    if (req.body.team) {
      await Team.findByIdAndUpdate(req.body.team, { $push: { formationsHistory: newFormation._id } });
    }
    res.status(201).json(newFormation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update formation
router.put('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Formation not found' });
    Object.assign(formation, req.body);
    const updatedFormation = await formation.save();
    res.json(updatedFormation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE formation
router.delete('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Formation not found' });
    await formation.remove();
    res.json({ message: 'Formation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;