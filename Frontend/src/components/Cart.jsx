import { useContext, useEffect } from 'react';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, loading, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;
  if (loading) return <div className="p-8 text-center">Loading cart…</div>;
  if (!cart.length) return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <p className="text-gray-600 mb-6">Cart is empty</p>
      <button
        onClick={() => navigate('/products')}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Browse Products
      </button>
    </div>
  );

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {cart.map(item => (
          <div key={item.product._id} className="flex justify-between items-center py-4 border-b last:border-0">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.product.name}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-900 font-medium">₹{item.product.price} each</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg mb-2">₹{(item.product.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/products')}
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}