const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true,
    maxlength: [100, 'Farm name cannot be more than 100 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: String,
    village: String,
    district: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  area: {
    total: {
      type: Number,
      required: [true, 'Total area is required'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    }
  },
  soilType: {
    type: String,
    enum: ['clayey', 'sandy', 'loamy', 'silt', 'peaty', 'chalky'],
    required: [true, 'Soil type is required']
  },
  irrigationType: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'furrow', 'none'],
    default: 'none'
  },
  waterSource: {
    type: [String],
    enum: ['borewell', 'canal', 'river', 'pond', 'rainwater'],
    default: []
  },
  crops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  }],
  farmingType: {
    type: String,
    enum: ['organic', 'conventional', 'mixed'],
    default: 'conventional'
  },
  facilities: {
    storage: { type: Boolean, default: false },
    processing: { type: Boolean, default: false },
    packingHouse: { type: Boolean, default: false },
    coldStorage: { type: Boolean, default: false }
  },
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date,
    certificateNumber: String
  }],
  images: [{
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for performance
farmSchema.index({ owner: 1 });
farmSchema.index({ 'location.coordinates': '2dsphere' });
farmSchema.index({ soilType: 1, irrigationType: 1 });

module.exports = mongoose.model('Farm', farmSchema);