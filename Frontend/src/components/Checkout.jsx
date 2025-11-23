// import { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CartContext } from '../CartContext';
// import { AuthContext } from '../AuthContext';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true
// });

// export default function Checkout() {
//   const { cart, cartTotal, clearCart } = useContext(CartContext);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [placing, setPlacing] = useState(false);
//   const [error, setError] = useState('');

//   const handlePlaceOrder = async () => {
//     if (!user) {
//       alert('Please log in to place an order');
//       navigate('/login');
//       return;
//     }

//     if (!cart || cart.length === 0) {
//       alert('Your cart is empty');
//       navigate('/cart');
//       return;
//     }

//     setPlacing(true);
//     setError('');

//     try {
//       console.log('📦 Placing order...');
      
//       const response = await api.post('/orders');
      
//       console.log('✅ Order placed:', response.data);

//       // Clear local cart
//       await clearCart();

//       // Navigate to order confirmation
//       navigate(`/order-confirmation/${response.data.order.orderId}`, {
//         state: { order: response.data.order }
//       });

//     } catch (err) {
//       console.error('❌ Failed to place order:', err);
//       const errorMsg = err.response?.data?.msg || 'Failed to place order';
//       setError(errorMsg);
//       alert(errorMsg);
//     } finally {
//       setPlacing(false);
//     }
//   };

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="max-w-2xl mx-auto p-8 text-center">
//         <h2 className="text-2xl font-bold mb-4">Checkout</h2>
//         <p className="text-gray-600 mb-6">Your cart is empty</p>
//         <button
//           onClick={() => navigate('/products')}
//           className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//         >
//           Browse Products
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h2 className="text-3xl font-bold mb-6">Checkout</h2>

//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {/* Order Summary */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
//         <div className="space-y-4">
//           {cart.map((item) => (
//             <div key={item.product._id} className="flex justify-between items-center py-3 border-b">
//               <div className="flex-1">
//                 <h4 className="font-medium">{item.product.name}</h4>
//                 <p className="text-sm text-gray-600">
//                   Quantity: {item.quantity} × ₹{item.product.price}
//                 </p>
//               </div>
//               <div className="font-semibold">
//                 ₹{(item.product.price * item.quantity).toFixed(2)}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 pt-4 border-t">
//           <div className="flex justify-between items-center text-2xl font-bold">
//             <span>Total Amount:</span>
//             <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Information */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
//         <div className="space-y-2 text-gray-700">
//           <p><strong>Customer:</strong> {user?.email || 'User'}</p>
//           <p><strong>Estimated Delivery:</strong> 30 minutes</p>
//           <p><strong>Delivery Address:</strong> Default Address</p>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => navigate('/cart')}
//           disabled={placing}
//           className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
//         >
//           Back to Cart
//         </button>
//         <button
//           onClick={handlePlaceOrder}
//           disabled={placing}
//           className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {placing ? (
//             <span className="flex items-center justify-center">
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Placing Order...
//             </span>
//           ) : (
//             `Place Order - ₹${cartTotal.toFixed(2)}`
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { CartContext } from '../CartContext';
import LocationInput from './LocationInput';
import axios from 'axios';
import { ShoppingCart, Package, ArrowLeft } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default function Checkout() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { cart, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warehousePreview, setWarehousePreview] = useState(null);
  const [hotspotPreview, setHotspotPreview] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cart || cart.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate]);

  const handleLocationSelect = async (selectedLocation) => {
    console.log('📍 Location selected:', selectedLocation);
    setLocation(selectedLocation);
    setError('');

    // Preview nearest warehouse and hotspot
    try {
      const [warehouseRes, hotspotRes] = await Promise.all([
        api.post('/warehouse/nearest', {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
        }),
        api.post('/hotspot/nearest', {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
        })
      ]);

      console.log('✅ Nearest warehouse:', warehouseRes.data.warehouse);
      console.log('✅ Nearest hotspot:', hotspotRes.data.hotspot);

      setWarehousePreview(warehouseRes.data.warehouse);
      setHotspotPreview(hotspotRes.data.hotspot);
    } catch (err) {
      console.error('❌ Error fetching delivery info:', err);
      setError('Unable to find nearby warehouse or hotspot. Please try again.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!location) {
      setError('Please select your delivery location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📦 Placing order with location:', location);

      const response = await api.post('/orders', {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      });

      console.log('✅ Order placed successfully:', response.data);

      const orderId = response.data.order.orderId;
      navigate(`/order-confirmation/${orderId}`);

    } catch (err) {
      console.error('❌ Order placement failed:', err);
      setError(err.response?.data?.msg || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Back Button */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Cart
      </Link>

      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Location & Delivery Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location Input */}
          <LocationInput 
            onLocationSelect={handleLocationSelect}
            initialLocation={location}
          />

          {/* Delivery Preview */}
          {warehousePreview && hotspotPreview && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Delivery Route Preview</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded">
                  <Package className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Warehouse</p>
                    <p className="text-gray-700">{warehousePreview.name}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      {warehousePreview.distance.toFixed(2)} km away
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded">
                  <Package className="w-6 h-6 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Delivery Hotspot</p>
                    <p className="text-gray-700">{hotspotPreview.name}</p>
                    <p className="text-sm text-purple-600 font-medium">
                      {hotspotPreview.distance.toFixed(2)} km away
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded">
                  <ShoppingCart className="w-6 h-6 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Your Location</p>
                    <p className="text-gray-700">{location.address || 'Selected Location'}</p>
                    <p className="text-sm text-gray-600">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!location || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            {!location && (
              <p className="text-sm text-gray-600 mt-3 text-center">
                Please select your delivery location
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}