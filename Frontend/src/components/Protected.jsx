// Protected.js
import React, { useContext } from 'react';
import { AuthContext } from "../AuthContext";

export default function Protected() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <div>Please login.</div>;

  return (
    <div>
      <h2>Welcome, user {user}!</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}