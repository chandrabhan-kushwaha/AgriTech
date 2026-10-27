import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FarmManagement from './pages/FarmManagement';
import CropMonitoring from './pages/CropMonitoring';
import SoilAnalysis from './pages/SoilAnalysis';
import WeatherForecast from './pages/WeatherForecast';
import PestAlerts from './pages/PestAlerts';
import ResourceStore from './pages/ResourceStore';
import OrderTracking from './pages/OrderTracking';
import ExpertConsultation from './pages/ExpertConsultation';
import CommunityForum from './pages/CommunityForum';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar onOpenCart={() => setIsCartOpen(true)} />

              <main className="flex-grow-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/weather" element={<WeatherForecast />} />
                  <Route path="/pests" element={<PestAlerts />} />
                  <Route path="/resources" element={<ResourceStore />} />
                  <Route path="/forum" element={<CommunityForum />} />

                  {/* Farmer / Authenticated Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/farms"
                    element={
                      <ProtectedRoute>
                        <FarmManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/crops"
                    element={
                      <ProtectedRoute>
                        <CropMonitoring />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/soil"
                    element={
                      <ProtectedRoute>
                        <SoilAnalysis />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/consultation"
                    element={
                      <ProtectedRoute>
                        <ExpertConsultation />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Only Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
