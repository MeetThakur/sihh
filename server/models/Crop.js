const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  variety: {
    type: String,
    trim: true
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['cereal', 'pulse', 'oilseed', 'fiber', 'sugar', 'vegetable', 'fruit', 'spice', 'fodder'],
    required: [true, 'Crop category is required']
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid', 'perennial'],
    required: [true, 'Season is required']
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  actualHarvestDate: {
    type: Date
  },
  area: {
    planted: {
      type: Number,
      required: [true, 'Planted area is required'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    }
  },
  stage: {
    current: {
      type: String,
      enum: ['planning', 'planted', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvested'],
      default: 'planning'
    },
    startDate: Date,
    notes: String
  },
  yield: {
    expected: {
      quantity: Number,
      unit: {
        type: String,
        enum: ['kg', 'quintal', 'ton', 'bags'],
        default: 'quintal'
      }
    },
    actual: {
      quantity: Number,
      unit: {
        type: String,
        enum: ['kg', 'quintal', 'ton', 'bags'],
        default: 'quintal'
      }
    }
  },
  inputs: {
    seeds: {
      quantity: Number,
      unit: String,
      cost: Number,
      source: String
    },
    fertilizers: [{
      name: String,
      quantity: Number,
      unit: String,
      cost: Number,
      applicationDate: Date,
      notes: String
    }],
    pesticides: [{
      name: String,
      type: { type: String, enum: ['insecticide', 'fungicide', 'herbicide', 'bactericide'] },
      quantity: Number,
      unit: String,
      cost: Number,
      applicationDate: Date,
      notes: String
    }],
    irrigation: {
      method: { type: String, enum: ['drip', 'sprinkler', 'flood', 'furrow'] },
      frequency: String,
      waterSource: String,
      cost: Number
    }
  },
  expenses: {
    preparation: { type: Number, default: 0 },
    seeds: { type: Number, default: 0 },
    fertilizer: { type: Number, default: 0 },
    pesticide: { type: Number, default: 0 },
    irrigation: { type: Number, default: 0 },
    labor: { type: Number, default: 0 },
    machinery: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  revenue: {
    totalSale: { type: Number, default: 0 },
    pricePerUnit: Number,
    soldTo: String,
    saleDate: Date
  },
  healthStatus: {
    overall: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
      default: 'good'
    },
    diseases: [{
      name: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] },
      affectedArea: Number,
      detectedDate: Date,
      treatment: String,
      status: { type: String, enum: ['active', 'treated', 'resolved'] }
    }],
    pests: [{
      name: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] },
      affectedArea: Number,
      detectedDate: Date,
      treatment: String,
      status: { type: String, enum: ['active', 'treated', 'resolved'] }
    }]
  },
  images: [{
    url: String,
    description: String,
    stage: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: [{
    content: String,
    date: { type: Date, default: Date.now },
    category: { type: String, enum: ['general', 'observation', 'treatment', 'expense', 'reminder'] }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for performance
cropSchema.index({ farm: 1 });
cropSchema.index({ owner: 1 });
cropSchema.index({ plantingDate: 1 });
cropSchema.index({ season: 1, category: 1 });

// Calculate total expenses
cropSchema.virtual('totalExpenses').get(function() {
  const expenses = this.expenses;
  return expenses.preparation + expenses.seeds + expenses.fertilizer + 
         expenses.pesticide + expenses.irrigation + expenses.labor + 
         expenses.machinery + expenses.other;
});

// Calculate profit/loss
cropSchema.virtual('profit').get(function() {
  return this.revenue.totalSale - this.totalExpenses;
});

// Ensure virtuals are included in JSON
cropSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Crop', cropSchema);