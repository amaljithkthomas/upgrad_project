import axios from 'axios';
import { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/cart');
      setCart(res.data || []);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.response?.data?.msg || 'Failed to load cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      setError('Please log in to add items to cart');
      return false;
    }
    setError(null);
    try {
      const res = await api.post('/cart', { productId, quantity });
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setError(err.response?.data?.msg || 'Failed to add item to cart');
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!user) {
      setError('Please log in');
      return false;
    }
    setError(null);
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error('Failed to update cart:', err);
      setError(err.response?.data?.msg || 'Failed to update cart');
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      setError('Please log in');
      return false;
    }
    setError(null);
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError(err.response?.data?.msg || 'Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;
    setError(null);
    try {
      await api.post('/cart/clear');
      setCart([]);
      return true;
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError(err.response?.data?.msg || 'Failed to clear cart');
      return false;
    }
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        error,
        cartCount,
        cartTotal,
        addToCart, 
        updateCartItem,
        removeFromCart, 
        clearCart,
        refreshCart: fetchCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}