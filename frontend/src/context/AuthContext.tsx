import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Verify token is still valid
        try {
          const response: any = await apiService.getProfile();
          if (response.success) {
            setUser(response.user);
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          // Token is invalid, clear auth data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 AuthContext login called with:', { email, password });
      
      // Check for hardcoded demo credentials first
      if ((email === 'demo@alphatechx.com' && password === 'demo123') ||
          (email === 'admin@alphatechx.com' && password === 'admin123')) {
        
        console.log('✅ Demo credentials matched');
        const isAdmin = email === 'admin@alphatechx.com';
        const demoToken = 'demo-jwt-token-' + Date.now();
        const demoUser = {
          id: isAdmin ? 'admin-123' : 'user-123',
          firstName: isAdmin ? 'Admin' : 'Demo',
          lastName: 'User',
          email: email,
          role: isAdmin ? 'admin' as const : 'user' as const,
          isVerified: true,
          createdAt: new Date().toISOString(),
          phone: '',
          company: 'AlphaTechX'
        };
        
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('authToken', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        console.log('✅ Demo user logged in successfully');
        return;
      }
      
      // Check for registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      console.log('📋 Registered users in localStorage:', registeredUsers);
      
      const foundUser = registeredUsers.find((user: any) => 
        user.email === email && user.password === password
      );
      
      console.log('🔍 Looking for user with email:', email, 'password:', password);
      console.log('🎯 Found user:', foundUser);
      
      if (foundUser) {
        console.log('✅ Registered user found, logging in...');
        const userToken = 'user-jwt-token-' + Date.now();
        const userData = {
          id: foundUser.id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          role: 'user' as const,
          isVerified: true,
          createdAt: foundUser.createdAt,
          phone: foundUser.phone || '',
          company: foundUser.company || ''
        };
        
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('authToken', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Registered user logged in successfully:', userData);
        return;
      }
      
      // If no match found, throw error
      console.log('❌ No matching user found');
      throw new Error('Invalid email or password');
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const message = error.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      console.log('📝 Registration started for:', userData);
      
      // Check if user already exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      console.log('👥 Current registered users:', registeredUsers);
      
      const existingUser = registeredUsers.find((user: any) => user.email === userData.email);
      
      if (existingUser) {
        console.log('❌ User already exists:', existingUser);
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        phone: userData.phone || '',
        company: userData.company || '',
        role: 'user' as const,
        isVerified: true,
        createdAt: new Date().toISOString()
      };
      
      console.log('👤 New user created:', newUser);
      
      // Add to registered users list
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      console.log('💾 User saved to localStorage. Total users:', registeredUsers.length);
      
      // Create user session
      const userToken = 'user-jwt-token-' + Date.now();
      const sessionUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
        phone: newUser.phone,
        company: newUser.company
      };
      
      setToken(userToken);
      setUser(sessionUser);
      localStorage.setItem('authToken', userToken);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      
      console.log('✅ Registration successful, user logged in:', sessionUser);
      toast.success(`Welcome to AlphaTechX, ${newUser.firstName}!`);
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const message = error.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const response: any = await apiService.updateProfile(userData);
      
      if (response.success) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 