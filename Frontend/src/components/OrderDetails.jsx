// import { useEffect, useState, useContext } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../AuthContext';
// import axios from 'axios';
// import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft } from 'lucide-react';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true
// });

// const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

// const statusIcons = {
//   Processing: <Clock className="w-6 h-6" />,
//   Confirmed: <CheckCircle className="w-6 h-6" />,
//   Shipped: <Truck className="w-6 h-6" />,
//   Delivered: <CheckCircle className="w-6 h-6" />,
//   Cancelled: <XCircle className="w-6 h-6" />
// };

// export default function OrderDetails() {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useContext(AuthContext);
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!user || !isAuthenticated) {
//       navigate('/login');
//       return;
//     }

//     fetchOrderDetails();

//     // Poll for updates every 5 seconds
//     const interval = setInterval(fetchOrderDetails, 5000);
//     return () => clearInterval(interval);
//   }, [orderId, user, isAuthenticated]);

//   const fetchOrderDetails = async () => {
//     try {
//       console.log('🔍 Fetching order details:', orderId);
//       const response = await api.get(`/orders/${orderId}`);
//       setOrder(response.data);
//       console.log('✅ Order details loaded:', response.data);
//     } catch (err) {
//       console.error('❌ Failed to fetch order details:', err);
//       if (err.response?.status === 401) {
//         navigate('/login');
//       } else {
//         setError(err.response?.data?.msg || 'Failed to load order details');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto p-8 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading order details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-8 text-center">
//         <div className="text-red-600 mb-4">{error}</div>
//         <Link
//           to="/orders"
//           className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//         >
//           Back to Orders
//         </Link>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="max-w-4xl mx-auto p-8 text-center">
//         <p className="text-gray-600 mb-4">Order not found</p>
//         <Link
//           to="/orders"
//           className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//         >
//           Back to Orders
//         </Link>
//       </div>
//     );
//   }

//   const currentStepIndex = statusSteps.indexOf(order.status);
//   const isCompleted = order.status === 'Delivered';
//   const isCancelled = order.status === 'Cancelled';

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       {/* Back Button */}
//       <Link
//         to="/orders"
//         className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
//       >
//         <ArrowLeft className="w-5 h-5" />
//         Back to Orders
//       </Link>

//       {/* Order Header */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h2 className="text-2xl font-bold mb-2">Order Details</h2>
//             <p className="text-gray-600">Order ID: <span className="font-mono font-semibold">{order.orderId}</span></p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-600">Placed On</p>
//             <p className="font-semibold">{new Date(order.orderPlacedAt).toLocaleDateString()}</p>
//             <p className="text-sm text-gray-500">{new Date(order.orderPlacedAt).toLocaleTimeString()}</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-600 mb-1">Status</p>
//             <p className="font-semibold text-blue-600 text-lg">{order.status}</p>
//           </div>
          
//           <div className="bg-green-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-600 mb-1">Total Amount</p>
//             <p className="font-semibold text-green-600 text-lg">₹{order.totalAmount.toFixed(2)}</p>
//           </div>
          
//           <div className="bg-yellow-50 p-4 rounded-lg">
//             <p className="text-sm text-gray-600 mb-1">
//               {isCompleted ? 'Delivered At' : 'Est. Delivery'}
//             </p>
//             <p className="font-semibold text-yellow-700 text-sm">
//               {isCompleted && order.deliveredAt
//                 ? new Date(order.deliveredAt).toLocaleString()
//                 : order.estimatedDeliveryTime
//                 ? new Date(order.estimatedDeliveryTime).toLocaleString()
//                 : 'TBD'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Order Tracking */}
//       {!isCancelled && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-6">Order Tracking</h3>
          
//           <div className="relative">
//             {/* Progress Line */}
//             <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200">
//               <div
//                 className="h-full bg-blue-600 transition-all duration-500"
//                 style={{
//                   width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
//                 }}
//               />
//             </div>

//             {/* Status Steps */}
//             <div className="relative flex justify-between">
//               {statusSteps.map((step, index) => {
//                 const isActive = index <= currentStepIndex;
//                 const isCurrent = index === currentStepIndex;

//                 return (
//                   <div key={step} className="flex flex-col items-center">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
//                         isActive
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-200 text-gray-500'
//                       } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
//                     >
//                       {statusIcons[step]}
//                     </div>
//                     <p className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
//                       {step}
//                     </p>
//                     {order.statusHistory && order.statusHistory.find(h => h.status === step) && (
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(
//                           order.statusHistory.find(h => h.status === step).timestamp
//                         ).toLocaleTimeString()}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Status History */}
//       {order.statusHistory && order.statusHistory.length > 0 && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-4">Status History</h3>
//           <div className="space-y-3">
//             {order.statusHistory.slice().reverse().map((history, index) => (
//               <div key={index} className="flex items-start gap-4 pb-3 border-b last:border-0">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                   {statusIcons[history.status]}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-semibold">{history.status}</p>
//                       <p className="text-sm text-gray-600">{history.message}</p>
//                     </div>
//                     <p className="text-sm text-gray-500">
//                       {new Date(history.timestamp).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Order Items */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-xl font-semibold mb-4">Order Items</h3>
//         <div className="space-y-3">
//           {order.items.map((item, index) => (
//             <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
//               <div className="flex-1">
//                 <p className="font-medium text-lg">{item.name}</p>
//                 <p className="text-sm text-gray-600">
//                   Quantity: {item.quantity} × ₹{item.price}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="font-semibold text-lg">₹{item.subtotal.toFixed(2)}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 pt-6 border-t">
//           <div className="flex justify-between items-center">
//             <span className="text-xl font-bold">Total Amount:</span>
//             <span className="text-2xl font-bold text-green-600">
//               ₹{order.totalAmount.toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

const statusIcons = {
  Processing: <Clock className="w-6 h-6" />,
  Confirmed: <CheckCircle className="w-6 h-6" />,
  Shipped: <Truck className="w-6 h-6" />,
  Delivered: <CheckCircle className="w-6 h-6" />,
  Cancelled: <XCircle className="w-6 h-6" />
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('OrderDetails mounted');
    console.log('Order ID:', orderId);
    console.log('User:', user);
    console.log('isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    fetchOrderDetails();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOrderDetails, 5000);
    return () => clearInterval(interval);
  }, [orderId, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      console.log('🔍 Fetching order details:', orderId);
      
      const response = await api.get(`/orders/${orderId}`);
      
      console.log('✅ Order details loaded:', response.data);
      setOrder(response.data);
      setError('');
      
    } catch (err) {
      console.error('❌ Failed to fetch order details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || 'Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
          to="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link
          to="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCompleted = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back Button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Order Details</h2>
            <p className="text-gray-600">Order ID: <span className="font-mono font-semibold">{order.orderId}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Placed On</p>
            <p className="font-semibold">{new Date(order.orderPlacedAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">{new Date(order.orderPlacedAt).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-blue-600 text-lg">{order.status}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="font-semibold text-green-600 text-lg">₹{order.totalAmount?.toFixed(2)}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              {isCompleted ? 'Delivered At' : 'Est. Delivery'}
            </p>
            <p className="font-semibold text-yellow-700 text-sm">
              {isCompleted && order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleString()
                : order.estimatedDeliveryTime
                ? new Date(order.estimatedDeliveryTime).toLocaleString()
                : 'TBD'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Tracking */}
      {!isCancelled && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6">Order Tracking</h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
                }}
              />
            </div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                    >
                      {statusIcons[step]}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step}
                    </p>
                    {order.statusHistory && order.statusHistory.find(h => h.status === step) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(
                          order.statusHistory.find(h => h.status === step).timestamp
                        ).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Status History</h3>
          <div className="space-y-3">
            {order.statusHistory.slice().reverse().map((history, index) => (
              <div key={index} className="flex items-start gap-4 pb-3 border-b last:border-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {statusIcons[history.status]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{history.status}</p>
                      <p className="text-sm text-gray-600">{history.message}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(history.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
              <div className="flex-1">
                <p className="font-medium text-lg">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">₹{item.subtotal?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}