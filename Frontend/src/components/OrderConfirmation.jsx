import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Package, Clock } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order && orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      console.log('📦 Fetching order:', orderId);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
      console.log('✅ Order loaded:', response.data);
    } catch (err) {
      console.error('❌ Failed to fetch order:', err);
      setError(err.response?.data?.msg || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/orders')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          View All Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-gray-600 mb-4">Order not found</p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const estimatedDelivery = order.estimatedDeliveryTime 
    ? new Date(order.estimatedDeliveryTime).toLocaleString()
    : 'To be confirmed';

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We'll send you a notification when it's on the way.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-semibold text-sm">{order.orderId}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Placed At</p>
            <p className="font-semibold text-sm">
              {new Date(order.orderPlacedAt).toLocaleString()}
            </p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Est. Delivery</p>
            <p className="font-semibold text-sm">{estimatedDelivery}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <div className="font-semibold">
                  ₹{item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">
          Order Status: <span className="text-blue-600">{order.status}</span>
        </h3>
        <p className="text-gray-700">
          Your order is being processed. You can track your order status from the Order History page.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          to="/orders"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
        >
          View Order History
        </Link>
        <Link
          to="/products"
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}