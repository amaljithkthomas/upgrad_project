import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in to place an order');
      navigate('/login');
      return;
    }

    if (!cart || cart.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    setPlacing(true);
    setError('');

    try {
      console.log('📦 Placing order...');
      
      const response = await api.post('/orders');
      
      console.log('✅ Order placed:', response.data);

      // Clear local cart
      await clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${response.data.order.orderId}`, {
        state: { order: response.data.order }
      });

    } catch (err) {
      console.error('❌ Failed to place order:', err);
      const errorMsg = err.response?.data?.msg || 'Failed to place order';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setPlacing(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center py-3 border-b">
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × ₹{item.product.price}
                </p>
              </div>
              <div className="font-semibold">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span>Total Amount:</span>
            <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
        <div className="space-y-2 text-gray-700">
          <p><strong>Customer:</strong> {user?.email || 'User'}</p>
          <p><strong>Estimated Delivery:</strong> 30 minutes</p>
          <p><strong>Delivery Address:</strong> Default Address</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/cart')}
          disabled={placing}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Back to Cart
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {placing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Placing Order...
            </span>
          ) : (
            `Place Order - ₹${cartTotal.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
}