import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserProfile, isAdmin } from '../services/storage';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const user = getUserProfile();
  const userIsAdmin = isAdmin();

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a user is logged in but is not an admin, redirect to home page
  if (user && !userIsAdmin) {
    // Optionally, you could show a "Access Denied" page here instead of redirecting to home
    console.warn(`Access denied for user: ${user.email} (not an admin)`);
    return <Navigate to="/" replace />;
  }

  // If user is logged in AND is an admin, render the children (AdminAnalytics)
  return <>{children}</>;
};

export default AdminProtectedRoute;