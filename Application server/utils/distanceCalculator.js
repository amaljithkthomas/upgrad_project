/**
 * Haversine Distance Calculator
 * Calculates the great-circle distance between two points on Earth
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return distance;
}

/**
 * Calculate Euclidean distance (simpler, less accurate for large distances)
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateEuclideanDistance(lat1, lon1, lat2, lon2) {
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;
  
  // Approximate conversion: 1 degree ≈ 111 km
  const latDistance = latDiff * 111;
  const lonDistance = lonDiff * 111 * Math.cos(toRadians((lat1 + lat2) / 2));
  
  return Math.sqrt(latDistance ** 2 + lonDistance ** 2);
}

/**
 * Find nearest location from a list
 * @param {Object} userLocation - { latitude, longitude }
 * @param {Array} locations - Array of locations with latitude and longitude
 * @returns {Object} Nearest location with distance
 */
function findNearest(userLocation, locations) {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    throw new Error('Invalid user location');
  }

  if (!locations || locations.length === 0) {
    throw new Error('No locations provided');
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const location of locations) {
    if (!location.location || !location.location.latitude || !location.location.longitude) {
      continue;
    }

    const distance = calculateHaversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.location.latitude,
      location.location.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = {
        ...location,
        distance: parseFloat(distance.toFixed(2))
      };
    }
  }

  if (!nearest) {
    throw new Error('No valid locations found');
  }

  return nearest;
}

/**
 * Calculate estimated delivery time based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {number} Estimated time in minutes
 */
function calculateEstimatedDeliveryTime(distance) {
  // Base time: 10 minutes for order processing
  const baseTime = 10;
  
  // Average speed: 30 km/h in city traffic
  const averageSpeed = 30;
  
  // Travel time in minutes
  const travelTime = (distance / averageSpeed) * 60;
  
  // Add buffer time (20% of travel time)
  const bufferTime = travelTime * 0.2;
  
  const totalTime = baseTime + travelTime + bufferTime;
  
  return Math.ceil(totalTime);
}

/**
 * Get all distances from user to multiple locations
 * @param {Object} userLocation - { latitude, longitude }
 * @param {Array} locations - Array of locations
 * @returns {Array} Locations sorted by distance
 */
function getAllDistances(userLocation, locations) {
  if (!userLocation || !locations || locations.length === 0) {
    return [];
  }

  const locationsWithDistance = locations.map(location => {
    const distance = calculateHaversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.location.latitude,
      location.location.longitude
    );

    return {
      ...location,
      distance: parseFloat(distance.toFixed(2))
    };
  });

  return locationsWithDistance.sort((a, b) => a.distance - b.distance);
}

module.exports = {
  calculateHaversineDistance,
  calculateEuclideanDistance,
  findNearest,
  calculateEstimatedDeliveryTime,
  getAllDistances
};