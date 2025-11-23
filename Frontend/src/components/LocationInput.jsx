import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationInput({ onLocationSelect, initialLocation }) {
  const [location, setLocation] = useState({
    latitude: initialLocation?.latitude || '',
    longitude: initialLocation?.longitude || '',
    address: initialLocation?.address || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleGetCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: 'Current Location'
        };
        setLocation(newLocation);
        setLoading(false);
        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please enter manually.');
        setLoading(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const lat = parseFloat(location.latitude);
    const lon = parseFloat(location.longitude);

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid latitude and longitude');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    if (onLocationSelect) {
      onLocationSelect({
        latitude: lat,
        longitude: lon,
        address: location.address || 'Custom Location'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold">Delivery Location</h3>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude *
            </label>
            <input
              type="number"
              name="latitude"
              step="any"
              value={location.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 12.9716"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude *
            </label>
            <input
              type="number"
              name="longitude"
              step="any"
              value={location.longitude}
              onChange={handleInputChange}
              placeholder="e.g., 77.5946"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address (Optional)
          </label>
          <input
            type="text"
            name="address"
            value={location.address}
            onChange={handleInputChange}
            placeholder="e.g., MG Road, Bangalore"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            <Navigation className="w-5 h-5" />
            {loading ? 'Getting Location...' : 'Use Current Location'}
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Confirm Location
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> We'll use this location to find the nearest warehouse and delivery hotspot for your order.
        </p>
      </div>
    </div>
  );
}