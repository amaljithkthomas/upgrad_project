import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Protected from './components/Protected';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import OrderDetails from './components/OrderDetails';
import HomePage from './components/HomePage';
import upGradLogo from '/upgrad_logo.png';
import './App.css';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5173/api', // or your API base URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <div>
        <a href="/" target="_blank">
          <img src={upGradLogo} className="logo" alt="upGrad logo" />
        </a>
      </div>
      <h1>upGrad Quick Commerce</h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<ProductList />} />
        
        {/* Protected Routes */}
        <Route path="/cart" element={
          <RequireAuth>
            <Cart />
          </RequireAuth>
        } />
        
        <Route path="/checkout" element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        } />
        
        <Route path="/order-confirmation/:orderId" element={
          <RequireAuth>
            <OrderConfirmation />
          </RequireAuth>
        } />
        
        <Route path="/orders" element={
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        } />
        
        <Route path="/order-details/:orderId" element={
          <RequireAuth>
            <OrderDetails />
          </RequireAuth>
        } />
        
        <Route path="/protected" element={
          <RequireAuth>
            <Protected />
          </RequireAuth>
        } />
      </Routes>
    </>
  );
}

export default App;
