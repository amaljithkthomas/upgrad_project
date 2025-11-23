const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');
const { findNearest, getAllDistances } = require('../utils/distanceCalculator');

// GET /api/warehouse - Get all warehouses
router.get('/', async (req, res) => {
  try {
    console.log('\n🏭 GET /api/warehouse');
    
    const warehouses = await Warehouse.find({ isActive: true })
      .select('-__v')
      .lean();
    
    console.log(`✅ Found ${warehouses.length} active warehouses`);
    
    res.json(warehouses);
  } catch (err) {
    console.error('❌ Get warehouses error:', err);
    res.status(500).json({ msg: 'Failed to fetch warehouses', error: err.message });
  }
});

// POST /api/warehouse/nearest - Find nearest warehouse
router.post('/nearest', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    console.log('\n🔍 POST /api/warehouse/nearest');
    console.log('User location:', { latitude, longitude });
    
    if (!latitude || !longitude) {
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }
    
    const userLocation = { 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude) 
    };
    
    console.log('Parsed location:', userLocation);
    
    // Get all active warehouses
    const warehouses = await Warehouse.find({ isActive: true }).lean();
    
    console.log(`Found ${warehouses.length} warehouses in database`);
    
    if (warehouses.length === 0) {
      console.log('❌ No active warehouses found - database may not be seeded');
      return res.status(404).json({ 
        msg: 'No active warehouses available. Please seed the database first.',
        hint: 'Run: npm run seed'
      });
    }
    
    // Find nearest warehouse
    const nearestWarehouse = findNearest(userLocation, warehouses);
    
    console.log('✅ Nearest warehouse:', nearestWarehouse.name);
    console.log('Distance:', nearestWarehouse.distance, 'km');
    
    res.json({
      warehouse: nearestWarehouse,
      userLocation
    });
    
  } catch (err) {
    console.error('❌ Find nearest warehouse error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      msg: 'Failed to find nearest warehouse', 
      error: err.message 
    });
  }
});

// POST /api/warehouse/all-distances
router.post('/all-distances', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    console.log('\n📊 POST /api/warehouse/all-distances');
    console.log('User location:', { latitude, longitude });
    
    if (!latitude || !longitude) {
      return res.status(400).json({ msg: 'Latitude and longitude are required' });
    }
    
    const userLocation = { latitude, longitude };
    
    const warehouses = await Warehouse.find({ isActive: true }).lean();
    
    if (warehouses.length === 0) {
      return res.status(404).json({ msg: 'No active warehouses available' });
    }
    
    const warehousesWithDistance = getAllDistances(userLocation, warehouses);
    
    console.log(`✅ Calculated distances for ${warehousesWithDistance.length} warehouses`);
    
    res.json({
      warehouses: warehousesWithDistance,
      userLocation
    });
    
  } catch (err) {
    console.error('❌ Get all distances error:', err);
    res.status(500).json({ msg: 'Failed to calculate distances', error: err.message });
  }
});

// GET /api/warehouse/:warehouseId
router.get('/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    
    console.log('\n🏭 GET /api/warehouse/:warehouseId');
    console.log('Warehouse ID:', warehouseId);
    
    const warehouse = await Warehouse.findOne({ warehouseId }).lean();
    
    if (!warehouse) {
      console.log('❌ Warehouse not found');
      return res.status(404).json({ msg: 'Warehouse not found' });
    }
    
    console.log('✅ Warehouse found:', warehouse.name);
    
    res.json(warehouse);
    
  } catch (err) {
    console.error('❌ Get warehouse error:', err);
    res.status(500).json({ msg: 'Failed to fetch warehouse', error: err.message });
  }
});

module.exports = router;