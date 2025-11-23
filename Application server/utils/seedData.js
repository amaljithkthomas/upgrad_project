const Warehouse = require('../models/Warehouse');
const Hotspot = require('../models/Hotspot');

// Sample Warehouse Data (Major Indian Cities)
const warehouses = [
  {
    warehouseId: 'WH001',
    name: 'Bangalore Central Warehouse',
    location: { latitude: 12.9716, longitude: 77.5946 },
    address: 'MG Road, Bangalore',
    city: 'Bangalore',
    operatingRadius: 15,
    capacity: 2000,
    isActive: true
  },
  {
    warehouseId: 'WH002',
    name: 'Mumbai Andheri Warehouse',
    location: { latitude: 19.1136, longitude: 72.8697 },
    address: 'Andheri East, Mumbai',
    city: 'Mumbai',
    operatingRadius: 20,
    capacity: 2500,
    isActive: true
  },
  {
    warehouseId: 'WH003',
    name: 'Delhi Connaught Place Warehouse',
    location: { latitude: 28.6289, longitude: 77.2065 },
    address: 'Connaught Place, New Delhi',
    city: 'Delhi',
    operatingRadius: 18,
    capacity: 3000,
    isActive: true
  },
  {
    warehouseId: 'WH004',
    name: 'Hyderabad Hi-Tech City Warehouse',
    location: { latitude: 17.4485, longitude: 78.3908 },
    address: 'Hi-Tech City, Hyderabad',
    city: 'Hyderabad',
    operatingRadius: 15,
    capacity: 1800,
    isActive: true
  },
  {
    warehouseId: 'WH005',
    name: 'Chennai T Nagar Warehouse',
    location: { latitude: 13.0418, longitude: 80.2341 },
    address: 'T Nagar, Chennai',
    city: 'Chennai',
    operatingRadius: 12,
    capacity: 1500,
    isActive: true
  },
  {
    warehouseId: 'WH006',
    name: 'Pune Kothrud Warehouse',
    location: { latitude: 18.5074, longitude: 73.8077 },
    address: 'Kothrud, Pune',
    city: 'Pune',
    operatingRadius: 10,
    capacity: 1200,
    isActive: true
  },
  {
    warehouseId: 'WH007',
    name: 'Kolkata Park Street Warehouse',
    location: { latitude: 22.5533, longitude: 88.3515 },
    address: 'Park Street, Kolkata',
    city: 'Kolkata',
    operatingRadius: 14,
    capacity: 1600,
    isActive: true
  },
  {
    warehouseId: 'WH008',
    name: 'Ahmedabad Satellite Warehouse',
    location: { latitude: 23.0314, longitude: 72.5050 },
    address: 'Satellite, Ahmedabad',
    city: 'Ahmedabad',
    operatingRadius: 12,
    capacity: 1400,
    isActive: true
  }
];

// Sample Hotspot Data (Delivery Zones)
const hotspots = [
  // Bangalore Hotspots
  {
    hotspotId: 'HS001',
    name: 'Koramangala Delivery Hub',
    location: { latitude: 12.9352, longitude: 77.6245 },
    address: 'Koramangala, Bangalore',
    city: 'Bangalore',
    coverageRadius: 5,
    deliveryPartners: 15,
    isActive: true
  },
  {
    hotspotId: 'HS002',
    name: 'Indiranagar Delivery Hub',
    location: { latitude: 12.9719, longitude: 77.6412 },
    address: 'Indiranagar, Bangalore',
    city: 'Bangalore',
    coverageRadius: 5,
    deliveryPartners: 12,
    isActive: true
  },
  {
    hotspotId: 'HS003',
    name: 'Whitefield Delivery Hub',
    location: { latitude: 12.9698, longitude: 77.7499 },
    address: 'Whitefield, Bangalore',
    city: 'Bangalore',
    coverageRadius: 6,
    deliveryPartners: 10,
    isActive: true
  },
  // Mumbai Hotspots
  {
    hotspotId: 'HS004',
    name: 'Bandra Delivery Hub',
    location: { latitude: 19.0596, longitude: 72.8295 },
    address: 'Bandra West, Mumbai',
    city: 'Mumbai',
    coverageRadius: 5,
    deliveryPartners: 20,
    isActive: true
  },
  {
    hotspotId: 'HS005',
    name: 'Powai Delivery Hub',
    location: { latitude: 19.1197, longitude: 72.9059 },
    address: 'Powai, Mumbai',
    city: 'Mumbai',
    coverageRadius: 5,
    deliveryPartners: 15,
    isActive: true
  },
  {
    hotspotId: 'HS006',
    name: 'Juhu Delivery Hub',
    location: { latitude: 19.1075, longitude: 72.8263 },
    address: 'Juhu, Mumbai',
    city: 'Mumbai',
    coverageRadius: 4,
    deliveryPartners: 12,
    isActive: true
  },
  // Delhi Hotspots
  {
    hotspotId: 'HS007',
    name: 'Saket Delivery Hub',
    location: { latitude: 28.5244, longitude: 77.2066 },
    address: 'Saket, New Delhi',
    city: 'Delhi',
    coverageRadius: 5,
    deliveryPartners: 18,
    isActive: true
  },
  {
    hotspotId: 'HS008',
    name: 'Dwarka Delivery Hub',
    location: { latitude: 28.5921, longitude: 77.0460 },
    address: 'Dwarka, New Delhi',
    city: 'Delhi',
    coverageRadius: 6,
    deliveryPartners: 14,
    isActive: true
  },
  {
    hotspotId: 'HS009',
    name: 'Rohini Delivery Hub',
    location: { latitude: 28.7496, longitude: 77.0669 },
    address: 'Rohini, New Delhi',
    city: 'Delhi',
    coverageRadius: 5,
    deliveryPartners: 16,
    isActive: true
  },
  // Hyderabad Hotspots
  {
    hotspotId: 'HS010',
    name: 'Madhapur Delivery Hub',
    location: { latitude: 17.4485, longitude: 78.3908 },
    address: 'Madhapur, Hyderabad',
    city: 'Hyderabad',
    coverageRadius: 5,
    deliveryPartners: 12,
    isActive: true
  },
  {
    hotspotId: 'HS011',
    name: 'Banjara Hills Delivery Hub',
    location: { latitude: 17.4239, longitude: 78.4738 },
    address: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    coverageRadius: 4,
    deliveryPartners: 10,
    isActive: true
  },
  // Chennai Hotspots
  {
    hotspotId: 'HS012',
    name: 'Velachery Delivery Hub',
    location: { latitude: 12.9750, longitude: 80.2210 },
    address: 'Velachery, Chennai',
    city: 'Chennai',
    coverageRadius: 5,
    deliveryPartners: 14,
    isActive: true
  },
  {
    hotspotId: 'HS013',
    name: 'Anna Nagar Delivery Hub',
    location: { latitude: 13.0869, longitude: 80.2093 },
    address: 'Anna Nagar, Chennai',
    city: 'Chennai',
    coverageRadius: 4,
    deliveryPartners: 11,
    isActive: true
  },
  // Pune Hotspots
  {
    hotspotId: 'HS014',
    name: 'Hinjewadi Delivery Hub',
    location: { latitude: 18.5912, longitude: 73.7389 },
    address: 'Hinjewadi, Pune',
    city: 'Pune',
    coverageRadius: 5,
    deliveryPartners: 13,
    isActive: true
  },
  {
    hotspotId: 'HS015',
    name: 'Viman Nagar Delivery Hub',
    location: { latitude: 18.5679, longitude: 73.9143 },
    address: 'Viman Nagar, Pune',
    city: 'Pune',
    coverageRadius: 4,
    deliveryPartners: 10,
    isActive: true
  },
  // Kolkata Hotspots
  {
    hotspotId: 'HS016',
    name: 'Salt Lake Delivery Hub',
    location: { latitude: 22.5726, longitude: 88.4194 },
    address: 'Salt Lake, Kolkata',
    city: 'Kolkata',
    coverageRadius: 5,
    deliveryPartners: 12,
    isActive: true
  },
  {
    hotspotId: 'HS017',
    name: 'Ballygunge Delivery Hub',
    location: { latitude: 22.5322, longitude: 88.3656 },
    address: 'Ballygunge, Kolkata',
    city: 'Kolkata',
    coverageRadius: 4,
    deliveryPartners: 9,
    isActive: true
  },
  // Ahmedabad Hotspots
  {
    hotspotId: 'HS018',
    name: 'Vastrapur Delivery Hub',
    location: { latitude: 23.0395, longitude: 72.5242 },
    address: 'Vastrapur, Ahmedabad',
    city: 'Ahmedabad',
    coverageRadius: 5,
    deliveryPartners: 11,
    isActive: true
  },
  {
    hotspotId: 'HS019',
    name: 'Maninagar Delivery Hub',
    location: { latitude: 22.9975, longitude: 72.5986 },
    address: 'Maninagar, Ahmedabad',
    city: 'Ahmedabad',
    coverageRadius: 4,
    deliveryPartners: 10,
    isActive: true
  }
];

/**
 * Seed warehouses into database
 */
async function seedWarehouses() {
  try {
    console.log('🏭 Seeding warehouses...');
    
    // Clear existing warehouses
    await Warehouse.deleteMany({});
    
    // Insert new warehouses
    const result = await Warehouse.insertMany(warehouses);
    
    console.log(`✅ Successfully seeded ${result.length} warehouses`);
    return result;
  } catch (err) {
    console.error('❌ Error seeding warehouses:', err);
    throw err;
  }
}

/**
 * Seed hotspots into database
 */
async function seedHotspots() {
  try {
    console.log('📍 Seeding hotspots...');
    
    // Clear existing hotspots
    await Hotspot.deleteMany({});
    
    // Insert new hotspots
    const result = await Hotspot.insertMany(hotspots);
    
    console.log(`✅ Successfully seeded ${result.length} hotspots`);
    return result;
  } catch (err) {
    console.error('❌ Error seeding hotspots:', err);
    throw err;
  }
}

/**
 * Seed all data
 */
async function seedAll() {
  try {
    console.log('\n🌱 Starting data seeding...\n');
    
    await seedWarehouses();
    await seedHotspots();
    
    console.log('\n✅ All data seeded successfully!\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err);
    throw err;
  }
}

module.exports = {
  seedWarehouses,
  seedHotspots,
  seedAll,
  warehouses,
  hotspots
};