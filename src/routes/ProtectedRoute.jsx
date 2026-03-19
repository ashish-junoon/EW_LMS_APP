import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
  const { adminUser } = useAuth();
  const isLoggedIn = adminUser?.status;
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes