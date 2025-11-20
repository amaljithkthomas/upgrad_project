import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Protected from './components/Protected';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import HomePage from './components/HomePage';
import upGradLogo from '/upgrad_logo.png';
import './App.css';

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <div>
        <a href="" target="_blank">
          <img src={upGradLogo} className="logo" alt="upGrad logo" />
        </a>
      </div>
      <h1>upGrad</h1>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={
          <RequireAuth>
            <Cart />
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
