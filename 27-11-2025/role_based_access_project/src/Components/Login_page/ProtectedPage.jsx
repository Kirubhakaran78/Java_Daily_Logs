import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedPage({ children }) {
  const raw = sessionStorage.getItem("currentUser");
  const isLoggedIn = !!raw;
  if (!isLoggedIn) return <Navigate to="/" />;
  return children;
}
export default ProtectedPage;
