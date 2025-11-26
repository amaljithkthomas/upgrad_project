import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { CartContext } from '../CartContext';
import Recommendations from './Recommendations';

export default function HomePage() {
  const { user, signOut, authLoading } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Quick Commerce</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Quick Commerce</h1>
      <p className="text-gray-600 mb-8">Your one-stop shop for fast delivery</p>
      
      {user ? (
        <div>
          <p className="text-gray-700 mb-6">
            Hello! You're logged in as <span className="font-semibold">{user.email || 'User'}</span>
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
            
            <button
              onClick={() => navigate('/cart')}
              className="bg-yellow-600 text-white px-6 py-3 rounded hover:bg-yellow-700 relative transition-colors"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => navigate('/orders')}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition-colors"
            >
              My Orders
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded inline-block hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="bg-green-600 text-white px-6 py-3 rounded inline-block hover:bg-green-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
      <Recommendations />
    </div>
  );
}