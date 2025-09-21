#!/usr/bin/env node

/**
 * Add Sample Data Script for KhetSetu
 *
 * This script adds sample users and data to the MongoDB database
 * to help visualize the data structure in MongoDB Compass.
 *
 * Usage: node scripts/add-sample-data.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Configuration
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'khetsetu';

// Sample data
const sampleUsers = [
  {
    email: 'farmer1@khetsetu.com',
    password: 'FarmerPass123',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    role: 'farmer',
    profile: {
      farmSize: 5.5,
      location: {
        state: 'Punjab',
        district: 'Ludhiana',
        village: 'Khanna',
        coordinates: {
          latitude: 30.7046,
          longitude: 76.2187
        }
      },
      soilType: 'loamy',
      farmingExperience: 15,
      primaryCrops: ['Rice', 'Wheat', 'Sugarcane'],
      preferredLanguage: 'hi',
      avatar: null
    },
    subscription: {
      plan: 'basic',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      features: ['weather_alerts', 'crop_advisory', 'market_prices']
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        weatherAlerts: true,
        pestAlerts: true,
        marketUpdates: true
      },
      units: {
        area: 'acres',
        temperature: 'celsius',
        currency: 'INR'
      }
    },
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLogin: new Date(),
    refreshTokens: [],
    isActive: true
  },
  {
    email: 'farmer2@khetsetu.com',
    password: 'FarmerPass123',
    name: 'Priya Sharma',
    phone: '+91-9123456789',
    role: 'farmer',
    profile: {
      farmSize: 3.2,
      location: {
        state: 'Maharashtra',
        district: 'Pune',
        village: 'Shirur',
        coordinates: {
          latitude: 18.8286,
          longitude: 74.3740
        }
      },
      soilType: 'clay',
      farmingExperience: 8,
      primaryCrops: ['Cotton', 'Soybean', 'Onion'],
      preferredLanguage: 'en',
      avatar: null
    },
    subscription: {
      plan: 'free',
      features: ['basic_weather', 'basic_advisory']
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        weatherAlerts: true,
        pestAlerts: false,
        marketUpdates: false
      },
      units: {
        area: 'hectares',
        temperature: 'celsius',
        currency: 'INR'
      }
    },
    isEmailVerified: true,
    isPhoneVerified: false,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    refreshTokens: [],
    isActive: true
  },
  {
    email: 'advisor@khetsetu.com',
    password: 'AdvisorPass123',
    name: 'Dr. Suresh Patel',
    phone: '+91-9988776655',
    role: 'advisor',
    profile: {
      location: {
        state: 'Gujarat',
        district: 'Ahmedabad',
        village: 'Sanand'
      },
      farmingExperience: 25,
      primaryCrops: ['Cotton', 'Groundnut', 'Bajra'],
      preferredLanguage: 'en',
      avatar: null
    },
    subscription: {
      plan: 'premium',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      features: ['all_features', 'expert_consultation', 'advanced_analytics']
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        weatherAlerts: true,
        pestAlerts: true,
        marketUpdates: true
      },
      units: {
        area: 'acres',
        temperature: 'celsius',
        currency: 'INR'
      }
    },
    isEmailVerified: true,
    isPhoneVerified: true,
    lastLogin: new Date(),
    refreshTokens: [],
    isActive: true
  }
];

const sampleCropAdvisories = [
  {
    userId: null, // Will be set after user creation
    cropName: 'Rice',
    season: 'Kharif 2024',
    recommendations: [
      {
        category: 'planting',
        title: 'Optimal Planting Time',
        description: 'Plant rice seedlings during monsoon season (June-July) for best yield.',
        priority: 'high',
        actionRequired: true,
        dueDate: new Date('2024-07-15')
      },
      {
        category: 'fertilizer',
        title: 'Nitrogen Application',
        description: 'Apply 120 kg/ha of nitrogen in split doses: 50% at planting, 25% at tillering, 25% at panicle initiation.',
        priority: 'medium',
        actionRequired: false
      }
    ],
    weatherConditions: {
      temperature: 28.5,
      humidity: 75,
      rainfall: 150,
      soilMoisture: 'optimal'
    },
    marketInsights: {
      currentPrice: 2500,
      priceUnit: 'INR/quintal',
      demandTrend: 'increasing',
      bestSellingTime: 'November-December'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    userId: null, // Will be set after user creation
    cropName: 'Wheat',
    season: 'Rabi 2024-25',
    recommendations: [
      {
        category: 'preparation',
        title: 'Field Preparation',
        description: 'Prepare fields with proper plowing and leveling. Ensure good drainage.',
        priority: 'high',
        actionRequired: true,
        dueDate: new Date('2024-11-30')
      },
      {
        category: 'seeds',
        title: 'Seed Selection',
        description: 'Use certified seeds of high-yielding varieties like HD-3086 or PBW-725.',
        priority: 'high',
        actionRequired: true
      }
    ],
    weatherConditions: {
      temperature: 22.0,
      humidity: 65,
      rainfall: 20,
      soilMoisture: 'moderate'
    },
    marketInsights: {
      currentPrice: 2200,
      priceUnit: 'INR/quintal',
      demandTrend: 'stable',
      bestSellingTime: 'April-May'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    userId: null, // Will be set after user creation
    cropName: 'Cotton',
    season: 'Kharif 2024',
    recommendations: [
      {
        category: 'pest_control',
        title: 'Bollworm Management',
        description: 'Monitor for bollworm infestation. Use IPM practices including pheromone traps.',
        priority: 'high',
        actionRequired: true,
        dueDate: new Date('2024-08-15')
      },
      {
        category: 'irrigation',
        title: 'Water Management',
        description: 'Maintain adequate soil moisture. Avoid water logging during flowering stage.',
        priority: 'medium',
        actionRequired: false
      }
    ],
    weatherConditions: {
      temperature: 30.5,
      humidity: 70,
      rainfall: 100,
      soilMoisture: 'high'
    },
    marketInsights: {
      currentPrice: 5800,
      priceUnit: 'INR/quintal',
      demandTrend: 'increasing',
      bestSellingTime: 'December-January'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
];

const sampleFarms = [
  {
    userId: null, // Will be set after user creation
    name: 'Green Valley Farm',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Khanna',
      address: 'Village Khanna, Tehsil Samrala, Ludhiana',
      coordinates: {
        latitude: 30.7046,
        longitude: 76.2187
      }
    },
    totalArea: 5.5,
    soilType: 'loamy',
    irrigationType: 'tube_well',
    crops: [
      {
        name: 'Rice',
        area: 2.5,
        variety: 'Basmati 1509',
        plantingDate: new Date('2024-06-15'),
        expectedHarvest: new Date('2024-10-15'),
        status: 'growing'
      },
      {
        name: 'Wheat',
        area: 3.0,
        variety: 'PBW-725',
        plantingDate: new Date('2023-11-15'),
        expectedHarvest: new Date('2024-04-15'),
        status: 'harvested'
      }
    ],
    equipment: [
      {
        type: 'tractor',
        brand: 'Mahindra',
        model: '575 DI',
        purchaseDate: new Date('2020-03-15')
      },
      {
        type: 'harvester',
        brand: 'New Holland',
        model: 'TC5.90',
        purchaseDate: new Date('2021-10-20')
      }
    ],
    certifications: ['organic', 'good_agricultural_practices'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    userId: null, // Will be set after user creation
    name: 'Sunset Cotton Farm',
    location: {
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Shirur',
      address: 'Near Shirur Railway Station, Pune',
      coordinates: {
        latitude: 18.8286,
        longitude: 74.3740
      }
    },
    totalArea: 3.2,
    soilType: 'clay',
    irrigationType: 'drip',
    crops: [
      {
        name: 'Cotton',
        area: 2.0,
        variety: 'Bt Cotton',
        plantingDate: new Date('2024-06-01'),
        expectedHarvest: new Date('2024-12-01'),
        status: 'flowering'
      },
      {
        name: 'Soybean',
        area: 1.2,
        variety: 'JS 335',
        plantingDate: new Date('2024-06-20'),
        expectedHarvest: new Date('2024-10-20'),
        status: 'pod_formation'
      }
    ],
    equipment: [
      {
        type: 'tractor',
        brand: 'Swaraj',
        model: '744 FE',
        purchaseDate: new Date('2019-05-10')
      }
    ],
    certifications: ['sustainable_agriculture'],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
];

// Helper function to hash passwords
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Main function to add sample data
async function addSampleData() {
  let client;

  try {
    console.log('🌾 Adding sample data to KhetSetu database...\n');

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DATABASE_NAME);

    // Get collections
    const usersCollection = db.collection('users');
    const advisoriesCollection = db.collection('cropadvisories');
    const farmsCollection = db.collection('farms');

    // Clear existing sample data (optional)
    console.log('\n🗑️  Clearing existing sample data...');
    await usersCollection.deleteMany({
      email: { $in: sampleUsers.map(u => u.email) }
    });
    await advisoriesCollection.deleteMany({});
    await farmsCollection.deleteMany({});
    console.log('✅ Cleared existing sample data');

    // Add users
    console.log('\n👥 Adding sample users...');
    const usersToInsert = [];

    for (const user of sampleUsers) {
      const hashedPassword = await hashPassword(user.password);
      usersToInsert.push({
        ...user,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const userResult = await usersCollection.insertMany(usersToInsert);
    console.log(`✅ Added ${userResult.insertedCount} users`);

    // Get inserted user IDs
    const insertedUsers = await usersCollection.find({
      email: { $in: sampleUsers.map(u => u.email) }
    }).toArray();

    // Add crop advisories
    console.log('\n🌱 Adding crop advisories...');
    const advisoriesToInsert = sampleCropAdvisories.map((advisory, index) => ({
      ...advisory,
      userId: insertedUsers[index % insertedUsers.length]._id
    }));

    const advisoryResult = await advisoriesCollection.insertMany(advisoriesToInsert);
    console.log(`✅ Added ${advisoryResult.insertedCount} crop advisories`);

    // Add farms
    console.log('\n🚜 Adding farm data...');
    const farmsToInsert = sampleFarms.map((farm, index) => ({
      ...farm,
      userId: insertedUsers[index]._id
    }));

    const farmResult = await farmsCollection.insertMany(farmsToInsert);
    console.log(`✅ Added ${farmResult.insertedCount} farms`);

    // Display summary
    console.log('\n📊 Database Summary:');
    console.log('==================');

    const userCount = await usersCollection.countDocuments();
    const advisoryCount = await advisoriesCollection.countDocuments();
    const farmCount = await farmsCollection.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Crop Advisories: ${advisoryCount}`);
    console.log(`Farms: ${farmCount}`);

    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('============================');
    console.log('Farmer 1: farmer1@khetsetu.com / FarmerPass123');
    console.log('Farmer 2: farmer2@khetsetu.com / FarmerPass123');
    console.log('Advisor:  advisor@khetsetu.com / AdvisorPass123');

    console.log('\n🧭 MongoDB Compass Connection:');
    console.log('==============================');
    console.log('Connection String: mongodb://127.0.0.1:27017/khetsetu');
    console.log('Database: khetsetu');
    console.log('Collections: users, cropadvisories, farms');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n✅ Disconnected from MongoDB');
    }
  }
}

// Check if required dependencies are available
function checkDependencies() {
  try {
    require('mongodb');
    require('bcryptjs');
    return true;
  } catch (error) {
    console.error('❌ Missing dependencies. Please install them:');
    console.error('npm install mongodb bcryptjs');
    return false;
  }
}

// Run the script
if (require.main === module) {
  if (checkDependencies()) {
    addSampleData().catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

module.exports = { addSampleData };
