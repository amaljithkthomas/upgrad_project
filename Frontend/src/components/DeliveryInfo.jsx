import { Warehouse, MapPin, Clock, Navigation } from 'lucide-react';

export default function DeliveryInfo({ deliveryInfo }) {
  if (!deliveryInfo) {
    return null;
  }

  const { warehouse, hotspot, totalDistance, estimatedDeliveryMinutes } = deliveryInfo;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Navigation className="w-6 h-6 text-blue-600" />
        Delivery Route Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Warehouse Info */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-3">
            <Warehouse className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Warehouse</h4>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">{warehouse?.name}</p>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>Lat: {warehouse?.location?.latitude?.toFixed(4)}</p>
                <p>Long: {warehouse?.location?.longitude?.toFixed(4)}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-blue-600">
              Distance: {warehouse?.distance?.toFixed(2)} km
            </p>
          </div>
        </div>

        {/* Hotspot Info */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-700">Delivery Hotspot</h4>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">{hotspot?.name}</p>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>Lat: {hotspot?.location?.latitude?.toFixed(4)}</p>
                <p>Long: {hotspot?.location?.longitude?.toFixed(4)}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-purple-600">
              Distance: {hotspot?.distance?.toFixed(2)} km
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-xl font-bold text-gray-900">
                {totalDistance?.toFixed(2)} km
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="text-xl font-bold text-gray-900">
                {estimatedDeliveryMinutes} minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-600">
        <p className="text-sm text-gray-700">
          <strong>Route:</strong> Your order will be dispatched from <strong>{warehouse?.name}</strong> and 
          delivered via <strong>{hotspot?.name}</strong> delivery hub.
        </p>
      </div>
    </div>
  );
}