const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user with farms
    const user = await User.findById(userId).populate('farms');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get farms count
    const farmsCount = await Farm.countDocuments({ owner: userId });
    
    // Get crops count
    const cropsCount = await Crop.countDocuments({ owner: userId });
    
    // Get active crops (not harvested)
    const activeCropsCount = await Crop.countDocuments({ 
      owner: userId, 
      'stage.current': { $nin: ['harvested'] }
    });

    // Get recent crops
    const recentCrops = await Crop.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('farm', 'name');

    // Get crops by season
    const cropsBySeasonPipeline = [
      { $match: { owner: userId } },
      { $group: { _id: '$season', count: { $sum: 1 } } }
    ];
    const cropsBySeason = await Crop.aggregate(cropsBySeasonPipeline);

    // Get crops by category
    const cropsByCategoryPipeline = [
      { $match: { owner: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ];
    const cropsByCategory = await Crop.aggregate(cropsByCategoryPipeline);

    // Calculate total expenses and revenue
    const financialData = await Crop.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: {
              $add: [
                '$expenses.preparation',
                '$expenses.seeds',
                '$expenses.fertilizer',
                '$expenses.pesticide',
                '$expenses.irrigation',
                '$expenses.labor',
                '$expenses.machinery',
                '$expenses.other'
              ]
            }
          },
          totalRevenue: { $sum: '$revenue.totalSale' }
        }
      }
    ]);

    const financial = financialData.length > 0 ? financialData[0] : { totalExpenses: 0, totalRevenue: 0 };

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location
        },
        statistics: {
          farmsCount,
          cropsCount,
          activeCropsCount,
          totalExpenses: financial.totalExpenses,
          totalRevenue: financial.totalRevenue,
          profit: financial.totalRevenue - financial.totalExpenses
        },
        recentCrops,
        analytics: {
          cropsBySeason,
          cropsByCategory
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get all crops for the user
router.get('/crops', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, season, category, stage, search } = req.query;
    
    // Build filter query
    const filter = { owner: req.user.userId };
    
    if (season) filter.season = season;
    if (category) filter.category = category;
    if (stage) filter['stage.current'] = stage;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { variety: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get crops with pagination
    const crops = await Crop.find(filter)
      .populate('farm', 'name location')
      .sort({ plantingDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCrops = await Crop.countDocuments(filter);
    
    res.json({
      success: true,
      data: { 
        crops,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCrops / parseInt(limit)),
          totalCrops,
          hasNextPage: skip + crops.length < totalCrops,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching crops',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get a specific crop
router.get('/crops/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    }).populate('farm', 'name location area soilType');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: { crop }
    });
  } catch (error) {
    console.error('Get crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching crop',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Update a crop
router.put('/crops/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('farm', 'name');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      message: 'Crop updated successfully',
      data: { crop }
    });
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating crop',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Delete a crop
router.delete('/crops/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Remove crop from farm's crops array
    await Farm.findByIdAndUpdate(
      crop.farm,
      { $pull: { crops: crop._id } }
    );

    // Delete the crop
    await Crop.findByIdAndDelete(crop._id);

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting crop',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Add expense to a crop
router.post('/crops/:id/expenses', auth, [
  body('category').isIn(['preparation', 'seeds', 'fertilizer', 'pesticide', 'irrigation', 'labor', 'machinery', 'other']).withMessage('Invalid expense category'),
  body('amount').isNumeric().isFloat({ min: 0 }).withMessage('Amount must be a positive number')
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

    const { category, amount } = req.body;

    const crop = await Crop.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    // Add to the specific expense category
    crop.expenses[category] += parseFloat(amount);
    await crop.save();

    res.json({
      success: true,
      message: 'Expense added successfully',
      data: { 
        crop: {
          _id: crop._id,
          expenses: crop.expenses,
          totalExpenses: crop.totalExpenses
        }
      }
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding expense',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Update crop stage
router.put('/crops/:id/stage', auth, [
  body('stage').isIn(['planning', 'planted', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvested']).withMessage('Invalid stage'),
  body('notes').optional().isString()
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

    const { stage, notes } = req.body;

    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { 
        'stage.current': stage,
        'stage.startDate': new Date(),
        'stage.notes': notes || ''
      },
      { new: true }
    ).populate('farm', 'name');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }

    res.json({
      success: true,
      message: 'Crop stage updated successfully',
      data: { crop }
    });
  } catch (error) {
    console.error('Update crop stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating crop stage',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

module.exports = router;