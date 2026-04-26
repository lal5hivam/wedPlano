import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import VenueList from './pages/VenueList';
import VenueDetail from './pages/VenueDetail';
import UserDashboard from './pages/UserDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import ManageVenue from './pages/ManageVenue';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/venues" element={<VenueList />} />
    <Route path="/venues/:id" element={<VenueDetail />} />
    <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
    <Route path="/partner/dashboard" element={<ProtectedRoute role="partner"><PartnerDashboard /></ProtectedRoute>} />
    <Route path="/partner/venues/new" element={<ProtectedRoute role="partner"><ManageVenue /></ProtectedRoute>} />
    <Route path="/partner/venues/:id/edit" element={<ProtectedRoute role="partner"><ManageVenue /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className="page">
        <Navbar />
        <AppRoutes />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
