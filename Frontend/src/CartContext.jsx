// import axios from 'axios';
// import { createContext, useEffect, useState, useContext, useCallback } from 'react';
// import { AuthContext } from './AuthContext';

// export const CartContext = createContext();

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   withCredentials: true
// });

// export function CartProvider({ children }) {
//   const { user } = useContext(AuthContext);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchCart = useCallback(async () => {
//     if (!user) {
//       setCart([]);
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get('/cart');
//       setCart(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch cart:', err);
//       setError(err.response?.data?.msg || 'Failed to load cart');
//       setCart([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   const addToCart = async (productId, quantity = 1) => {
//     if (!user) {
//       setError('Please log in to add items to cart');
//       return false;
//     }
//     setError(null);
//     try {
//       const res = await api.post('/cart', { productId, quantity });
//       setCart(res.data || []);
//       return true;
//     } catch (err) {
//       console.error('Failed to add to cart:', err);
//       setError(err.response?.data?.msg || 'Failed to add item to cart');
//       return false;
//     }
//   };

//   const updateCartItem = async (productId, quantity) => {
//     if (!user) {
//       setError('Please log in');
//       return false;
//     }
//     setError(null);
//     try {
//       const res = await api.put(`/cart/${productId}`, { quantity });
//       setCart(res.data || []);
//       return true;
//     } catch (err) {
//       console.error('Failed to update cart:', err);
//       setError(err.response?.data?.msg || 'Failed to update cart');
//       return false;
//     }
//   };

//   const removeFromCart = async (productId) => {
//     if (!user) {
//       setError('Please log in');
//       return false;
//     }
//     setError(null);
//     try {
//       const res = await api.delete(`/cart/${productId}`);
//       setCart(res.data || []);
//       return true;
//     } catch (err) {
//       console.error('Failed to remove from cart:', err);
//       setError(err.response?.data?.msg || 'Failed to remove item');
//       return false;
//     }
//   };

//   const clearCart = async () => {
//     if (!user) return false;
//     setError(null);
//     try {
//       await api.post('/cart/clear');
//       setCart([]);
//       return true;
//     } catch (err) {
//       console.error('Failed to clear cart:', err);
//       setError(err.response?.data?.msg || 'Failed to clear cart');
//       return false;
//     }
//   };

//   const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);
//   const cartTotal = cart.reduce((total, item) => {
//     const price = item.product?.price || 0;
//     const quantity = item.quantity || 0;
//     return total + (price * quantity);
//   }, 0);

//   return (
//     <CartContext.Provider 
//       value={{ 
//         cart, 
//         loading, 
//         error,
//         cartCount,
//         cartTotal,
//         addToCart, 
//         updateCartItem,
//         removeFromCart, 
//         clearCart,
//         refreshCart: fetchCart 
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

//**************************************** */

import axios from 'axios';
import { createContext, useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🛒 Cart Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('🛒 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('🛒 Cart Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🛒 Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user || !isAuthenticated) {
      console.log('ℹ️ No user, skipping cart fetch');
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📦 Fetching cart...');
      const res = await api.get('/cart');
      console.log('✅ Cart fetched:', res.data?.length, 'items');
      setCart(res.data || []);
    } catch (err) {
      console.error('❌ Fetch cart failed:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        console.log('Not authenticated, clearing cart');
        setCart([]);
      } else {
        setError(err.response?.data?.msg || 'Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user || !isAuthenticated) {
      const msg = 'Please log in to add items to cart';
      setError(msg);
      alert(msg);
      return false;
    }

    setError(null);
    
    try {
      console.log('➕ Adding to cart:', { productId, quantity });
      const res = await api.post('/cart', { productId, quantity });
      console.log('✅ Added to cart successfully');
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error('❌ Add to cart failed:', err);
      
      const errorMsg = err.response?.data?.msg || 
                      err.response?.data?.message || 
                      'Failed to add item to cart';
      
      setError(errorMsg);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        alert(errorMsg);
      }
      
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
      console.log('✏️ Updating cart item:', { productId, quantity });
      const res = await api.put(`/cart/${productId}`, { quantity });
      console.log('✅ Cart item updated');
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error('❌ Update failed:', err);
      setError(err.response?.data?.msg || 'Failed to update item');
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
      console.log('🗑️ Removing from cart:', productId);
      const res = await api.delete(`/cart/${productId}`);
      console.log('✅ Removed from cart');
      setCart(res.data || []);
      return true;
    } catch (err) {
      console.error('❌ Remove failed:', err);
      setError(err.response?.data?.msg || 'Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    setError(null);
    
    try {
      console.log('🧹 Clearing cart...');
      await api.post('/cart/clear');
      console.log('✅ Cart cleared');
      setCart([]);
      return true;
    } catch (err) {
      console.error('❌ Clear failed:', err);
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