// import { useEffect, useState } from 'react';
// import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { CheckCircle, Package, Clock } from 'lucide-react';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true
// });

// export default function OrderConfirmation() {
//   const { orderId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(location.state?.order || null);
//   const [loading, setLoading] = useState(!location.state?.order);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!order && orderId) {
//       fetchOrder();
//     }
//   }, [orderId]);

//   const fetchOrder = async () => {
//     try {
//       console.log('📦 Fetching order:', orderId);
//       const response = await api.get(`/orders/${orderId}`);
//       setOrder(response.data);
//       console.log('✅ Order loaded:', response.data);
//     } catch (err) {
//       console.error('❌ Failed to fetch order:', err);
//       setError(err.response?.data?.msg || 'Failed to load order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-2xl mx-auto p-8 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading order details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-2xl mx-auto p-8 text-center">
//         <div className="text-red-600 mb-4">{error}</div>
//         <button
//           onClick={() => navigate('/orders')}
//           className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//         >
//           View All Orders
//         </button>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="max-w-2xl mx-auto p-8 text-center">
//         <p className="text-gray-600 mb-4">Order not found</p>
//         <button
//           onClick={() => navigate('/orders')}
//           className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//         >
//           View All Orders
//         </button>
//       </div>
//     );
//   }

//   const estimatedDelivery = order.estimatedDeliveryTime 
//     ? new Date(order.estimatedDeliveryTime).toLocaleString()
//     : 'To be confirmed';

//   return (
//     <div className="max-w-3xl mx-auto p-8">
//       {/* Success Header */}
//       <div className="text-center mb-8">
//         <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Order Placed Successfully!
//         </h1>
//         <p className="text-gray-600">
//           Thank you for your order. We'll send you a notification when it's on the way.
//         </p>
//       </div>

//       {/* Order Details Card */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="text-center p-4 bg-blue-50 rounded-lg">
//             <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
//             <p className="text-sm text-gray-600">Order ID</p>
//             <p className="font-mono font-semibold text-sm">{order.orderId}</p>
//           </div>
          
//           <div className="text-center p-4 bg-green-50 rounded-lg">
//             <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
//             <p className="text-sm text-gray-600">Placed At</p>
//             <p className="font-semibold text-sm">
//               {new Date(order.orderPlacedAt).toLocaleString()}
//             </p>
//           </div>
          
//           <div className="text-center p-4 bg-yellow-50 rounded-lg">
//             <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
//             <p className="text-sm text-gray-600">Est. Delivery</p>
//             <p className="font-semibold text-sm">{estimatedDelivery}</p>
//           </div>
//         </div>

//         <div className="border-t pt-4">
//           <h3 className="text-lg font-semibold mb-3">Order Items</h3>
//           <div className="space-y-3">
//             {order.items.map((item, index) => (
//               <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
//                 <div className="flex-1">
//                   <p className="font-medium">{item.name}</p>
//                   <p className="text-sm text-gray-600">
//                     Quantity: {item.quantity} × ₹{item.price}
//                   </p>
//                 </div>
//                 <div className="font-semibold">
//                   ₹{item.subtotal.toFixed(2)}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between items-center text-xl font-bold">
//               <span>Total Amount:</span>
//               <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Status Information */}
//       <div className="bg-blue-50 rounded-lg p-6 mb-6">
//         <h3 className="text-lg font-semibold mb-3 text-blue-900">
//           Order Status: <span className="text-blue-600">{order.status}</span>
//         </h3>
//         <p className="text-gray-700">
//           Your order is being processed. You can track your order status from the Order History page.
//         </p>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-4">
//         <Link
//           to="/orders"
//           className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
//         >
//           View Order History
//         </Link>
//         <Link
//           to="/products"
//           className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import DeliveryInfo from './DeliveryInfo';
import axios from 'axios';
import { CheckCircle, Package, Eye } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrderDetails();
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      console.log('📦 Fetching order confirmation:', orderId);
      
      const response = await api.get(`/orders/${orderId}`);
      
      console.log('✅ Order details loaded:', response.data);
      setOrder(response.data);
      setError('');
      
    } catch (err) {
      console.error('❌ Failed to fetch order:', err);
      setError(err.response?.data?.msg || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Success Header */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-800 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-700">
          Your order has been received and is being processed
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono font-semibold text-lg">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Order Placed</p>
            <p className="font-medium">
              {new Date(order.orderPlacedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-blue-600 text-lg">{order.status}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="font-semibold text-green-600 text-lg">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-1">Est. Delivery</p>
            <p className="font-semibold text-yellow-700 text-sm">
              {new Date(order.estimatedDeliveryTime).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* NEW: Delivery Info Component */}
      {order.deliveryInfo && (
        <div className="mb-6">
          <DeliveryInfo deliveryInfo={order.deliveryInfo} />
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-semibold">Order Items</h3>
        </div>
        
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
              <div className="flex-1">
                <p className="font-medium text-lg">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">₹{item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          to={`/order-details/${order.orderId}`}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-5 h-5" />
          Track Order
        </Link>
        
        <Link
          to="/products"
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}