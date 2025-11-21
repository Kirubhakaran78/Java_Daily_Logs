import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicPage({ children }) {
  const raw = sessionStorage.getItem("currentUser");
  const isLoggedIn = !!raw;
  if (isLoggedIn) return <Navigate to="/HomePage/dashboard" />;
  return children;
}
export default PublicPage;
