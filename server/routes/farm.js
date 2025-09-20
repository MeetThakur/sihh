const express = require('express');
const { body, validationResult } = require('express-validator');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all farms for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const farms = await Farm.find({ owner: req.user.userId })
      .populate('crops')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { farms },
      count: farms.length
    });
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching farms',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get a specific farm by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    }).populate('crops');

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    res.json({
      success: true,
      data: { farm }
    });
  } catch (error) {
    console.error('Get farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching farm',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Create a new farm
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Farm name must be at least 2 characters'),
  body('area.total').isNumeric().isFloat({ min: 0 }).withMessage('Total area must be a positive number'),
  body('soilType').isIn(['clayey', 'sandy', 'loamy', 'silt', 'peaty', 'chalky']).withMessage('Invalid soil type')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const farmData = {
      ...req.body,
      owner: req.user.userId
    };

    const farm = new Farm(farmData);
    await farm.save();

    // Add farm to user's farms array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { farms: farm._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: { farm }
    });
  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating farm',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Update a farm
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Farm name must be at least 2 characters'),
  body('area.total').optional().isNumeric().isFloat({ min: 0 }).withMessage('Total area must be a positive number'),
  body('soilType').optional().isIn(['clayey', 'sandy', 'loamy', 'silt', 'peaty', 'chalky']).withMessage('Invalid soil type')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    res.json({
      success: true,
      message: 'Farm updated successfully',
      data: { farm }
    });
  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating farm',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Delete a farm
router.delete('/:id', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Delete all crops associated with this farm
    await Crop.deleteMany({ farm: farm._id });

    // Remove farm from user's farms array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { farms: farm._id } }
    );

    // Delete the farm
    await Farm.findByIdAndDelete(farm._id);

    res.json({
      success: true,
      message: 'Farm and associated crops deleted successfully'
    });
  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting farm',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get crops for a specific farm
router.get('/:id/crops', auth, async (req, res) => {
  try {
    // Verify farm ownership
    const farm = await Farm.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    const crops = await Crop.find({ farm: req.params.id })
      .sort({ plantingDate: -1 });

    res.json({
      success: true,
      data: { crops },
      count: crops.length
    });
  } catch (error) {
    console.error('Get farm crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching farm crops',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Add a crop to a farm
router.post('/:id/crops', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Crop name must be at least 2 characters'),
  body('category').isIn(['cereal', 'pulse', 'oilseed', 'fiber', 'sugar', 'vegetable', 'fruit', 'spice', 'fodder']).withMessage('Invalid crop category'),
  body('season').isIn(['kharif', 'rabi', 'zaid', 'perennial']).withMessage('Invalid season'),
  body('plantingDate').isISO8601().withMessage('Invalid planting date'),
  body('expectedHarvestDate').isISO8601().withMessage('Invalid expected harvest date'),
  body('area.planted').isNumeric().isFloat({ min: 0 }).withMessage('Planted area must be a positive number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify farm ownership
    const farm = await Farm.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    const cropData = {
      ...req.body,
      farm: req.params.id,
      owner: req.user.userId
    };

    const crop = new Crop(cropData);
    await crop.save();

    // Add crop to farm's crops array
    await Farm.findByIdAndUpdate(
      req.params.id,
      { $push: { crops: crop._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      data: { crop }
    });
  } catch (error) {
    console.error('Add crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding crop',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;