

import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

const statusIcons = {
  Processing: <Clock className="w-5 h-5 text-yellow-600" />,
  Confirmed: <CheckCircle className="w-5 h-5 text-blue-600" />,
  Shipped: <Truck className="w-5 h-5 text-purple-600" />,
  Delivered: <CheckCircle className="w-5 h-5 text-green-600" />,
  Cancelled: <XCircle className="w-5 h-5 text-red-600" />
};

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  Shipped: 'bg-purple-100 text-purple-800 border-purple-300',
  Delivered: 'bg-green-100 text-green-800 border-green-300',
  Cancelled: 'bg-red-100 text-red-800 border-red-300'
};

export default function OrderHistory() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('OrderHistory mounted');
    console.log('User:', user);
    console.log('isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    fetchOrders();

    // Poll for order updates every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      console.log('📋 Fetching orders...');
      
      const response = await api.get('/orders');
      
      console.log('✅ Orders response:', response.data);
      setOrders(response.data);
      setError('');
      
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || 'Failed to load orders');
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
      <div className="max-w-6xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Retry
          </button>
          <Link
            to="/products"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Order History</h2>
          <p className="text-gray-600 mt-1">You have {orders.length} order(s)</p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono font-semibold text-sm">{order.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Placed On</p>
                  <p className="font-medium">
                    {new Date(order.orderPlacedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderPlacedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Items ({order.items?.length || 0})
                </h4>
                <div className="space-y-2">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.subtotal?.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                    {statusIcons[order.status] || <Package className="w-5 h-5" />}
                    <span className="font-medium">{order.status}</span>
                  </div>
                  
                  {order.deliveredAt && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Delivered:</span>{' '}
                      {new Date(order.deliveredAt).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">
                      ₹{order.totalAmount?.toFixed(2)}
                    </p>
                  </div>
                  
                  <Link
                    to={`/order-details/${order.orderId}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}