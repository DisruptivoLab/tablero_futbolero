const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const League = require('../models/League');

// GET all teams, optional filter by leagueId
router.get('/', async (req, res) => {
  try {
    const { leagueId } = req.query;
    let query = {};
    if (leagueId) {
      query.league = leagueId;
    }
    const teams = await Team.find(query).populate('league', 'name').populate('players', 'name position').populate('formationsHistory', 'name formationString');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET team by id
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('league', 'name').populate('players', 'name position').populate('formationsHistory', 'name formationString');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new team
router.post('/', async (req, res) => {
  const team = new Team(req.body);
  try {
    const newTeam = await team.save();
    // Add to league's teams array if leagueId provided
    if (req.body.league) {
      await League.findByIdAndUpdate(req.body.league, { $push: { teams: newTeam._id } });
    }
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update team
router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    Object.assign(team, req.body);
    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    await team.remove();
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;