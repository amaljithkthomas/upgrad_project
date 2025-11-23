const express = require('express');
const router = express.Router();
const Hotspot = require('../models/Hotspot');
const { findNearest, getAllDistances } = require('../utils/distanceCalculator');

// GET /api/hotspot - Get all hotspots
router.get('/', async (req, res) => {
  try {
    console.log('\n📍 GET /api/hotspot');
    
    const hotspots = await Hotspot.find({ isActive: true })
      .select('-__v')
      .lean();
    
    console.log(`✅ Found ${hotspots.length} active hotspots`);
    
    res.json(hotspots);
  } catch (err) {
    console.error('❌ Get hotspots error:', err);
    res.status(500).json({ msg: 'Failed to fetch hotspots', error: err.message });
  }
});

// POST /api/hotspot/nearest - Find nearest hotspot
router.post('/nearest', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    console.log('\n🔍 POST /api/hotspot/nearest');
    console.log('Request body:', req.body);
    console.log('User location:', { latitude, longitude });
    
    if (!latitude || !longitude) {
      console.log('❌ Missing latitude or longitude');
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }
    
    const userLocation = { 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude) 
    };
    
    console.log('Parsed location:', userLocation);
    
    // Get all active hotspots
    const hotspots = await Hotspot.find({ isActive: true }).lean();
    
    console.log(`Found ${hotspots.length} hotspots in database`);
    
    if (hotspots.length === 0) {
      console.log('❌ No active hotspots found - database may not be seeded');
      return res.status(404).json({ 
        msg: 'No active hotspots available. Please seed the database first.',
        hint: 'Run: npm run seed'
      });
    }
    
    // Find nearest hotspot
    const nearestHotspot = findNearest(userLocation, hotspots);
    
    console.log('✅ Nearest hotspot:', nearestHotspot.name);
    console.log('Distance:', nearestHotspot.distance, 'km');
    
    res.json({
      hotspot: nearestHotspot,
      userLocation
    });
    
  } catch (err) {
    console.error('❌ Find nearest hotspot error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      msg: 'Failed to find nearest hotspot', 
      error: err.message 
    });
  }
});

// POST /api/hotspot/all-distances
router.post('/all-distances', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    console.log('\n📊 POST /api/hotspot/all-distances');
    console.log('User location:', { latitude, longitude });
    
    if (!latitude || !longitude) {
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }
    
    const userLocation = { latitude, longitude };
    
    const hotspots = await Hotspot.find({ isActive: true }).lean();
    
    if (hotspots.length === 0) {
      return res.status(404).json({ msg: 'No active hotspots available' });
    }
    
    const hotspotsWithDistance = getAllDistances(userLocation, hotspots);
    
    console.log(`✅ Calculated distances for ${hotspotsWithDistance.length} hotspots`);
    
    res.json({
      hotspots: hotspotsWithDistance,
      userLocation
    });
    
  } catch (err) {
    console.error('❌ Get all distances error:', err);
    res.status(500).json({ msg: 'Failed to calculate distances', error: err.message });
  }
});

// GET /api/hotspot/:hotspotId
router.get('/:hotspotId', async (req, res) => {
  try {
    const { hotspotId } = req.params;
    
    console.log('\n📍 GET /api/hotspot/:hotspotId');
    console.log('Hotspot ID:', hotspotId);
    
    const hotspot = await Hotspot.findOne({ hotspotId }).lean();
    
    if (!hotspot) {
      console.log('❌ Hotspot not found');
      return res.status(404).json({ msg: 'Hotspot not found' });
    }
    
    console.log('✅ Hotspot found:', hotspot.name);
    
    res.json(hotspot);
    
  } catch (err) {
    console.error('❌ Get hotspot error:', err);
    res.status(500).json({ msg: 'Failed to fetch hotspot', error: err.message });
  }
});

module.exports = router;