import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';

// Import pages (will create these next)
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import NotFound from './pages/NotFound';
import BotProject from './pages/projects/BotProject';

// Protected Route component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50">
          <Header />
          
          <main className="pt-16 lg:pt-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/bot"
                element={
                  <ProtectedRoute>
                    <BotProject />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1e293b',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
