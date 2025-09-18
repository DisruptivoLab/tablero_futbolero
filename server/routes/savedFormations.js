const express = require('express');
const { body, validationResult } = require('express-validator');
const SavedFormation = require('../models/SavedFormation');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Get user's saved formations
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const formations = await SavedFormation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Save formation
router.post('/', [
  ensureAuthenticated,
  body('name').isLength({ min: 1, max: 100 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, gameMode, formation, playersOnPitch, ballPosition, drawingData, isPublic } = req.body;
    
    const savedFormation = new SavedFormation({
      name,
      userId: req.user._id,
      gameMode,
      formation,
      playersOnPitch,
      ballPosition,
      drawingData,
      isPublic: isPublic || false
    });

    await savedFormation.save();
    res.status(201).json(savedFormation);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Update formation
router.put('/:id', [
  ensureAuthenticated,
  body('name').isLength({ min: 1, max: 100 }).trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const formation = await SavedFormation.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!formation) {
      return res.status(404).json({ message: 'Formación no encontrada' });
    }

    const { name, gameMode, formation: formationStr, playersOnPitch, ballPosition, drawingData, isPublic } = req.body;
    
    Object.assign(formation, {
      name,
      gameMode,
      formation: formationStr,
      playersOnPitch,
      ballPosition,
      drawingData,
      isPublic
    });

    await formation.save();
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Delete formation
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const formation = await SavedFormation.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!formation) {
      return res.status(404).json({ message: 'Formación no encontrada' });
    }

    res.json({ message: 'Formación eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Get public formations
router.get('/public', async (req, res) => {
  try {
    const formations = await SavedFormation.find({ isPublic: true })
      .populate('userId', 'username')
      .sort({ updatedAt: -1 })
      .limit(20);
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;