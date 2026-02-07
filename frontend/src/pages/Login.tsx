import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Form data interface
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('🚀 Login form submitted with data:', { email: data.email, password: '***' });
      
      // Use AuthContext login function for all authentication
      await login(data.email, data.password);
      
      console.log('✅ Login successful, checking user role...');
      // Get user data from AuthContext after successful login
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = userData.role || 'user';
      
      console.log('👤 User role:', userRole, 'User data:', userData);
      
      if (userRole === 'admin') {
        toast.success('Admin access granted! Welcome back.', {
          duration: 4000,
          icon: '👑'
        });
        console.log('🔄 Navigating to /admin');
        navigate('/admin');
      } else {
        toast.success('Welcome back! Signed in successfully.', {
          duration: 4000,
          icon: '🎉'
        });
        console.log('🔄 Navigating to /profile');
        navigate('/profile');
      }
      
      reset();
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.message || 'Invalid email or password. Please try again.', {
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'demo@alphatechx.com', password: 'demo123', role: 'User' },
    { email: 'admin@alphatechx.com', password: 'admin123', role: 'Admin' }
  ];

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Dashboard',
      description: 'Access your personalized AI-driven insights and analytics'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with end-to-end encryption'
    },
    {
      icon: CheckCircleIcon,
      title: 'Smart Automation',
      description: 'Automate workflows with intelligent AI recommendations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
      <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your AlphaTechx account
              </p>
            </motion.div>
          </div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-blue-50 rounded-lg p-4 border border-blue-200"
          >
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="text-xs bg-white rounded p-2 border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{cred.role}:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {cred.role}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">
                    <div>Email: {cred.email}</div>
                    <div>Password: {cred.password}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </span>
              )}
            </button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
              >
                Sign up now
              </Link>
            </p>
          </motion.div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500">
                Or continue with
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => toast.success('Google Sign-In coming soon!', { duration: 3000 })}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              onClick={() => toast.success('Microsoft Sign-In coming soon!', { duration: 3000 })}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              <span className="ml-2">Microsoft</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md text-white"
        >
          <h2 className="text-3xl font-bold mb-6">
            Welcome to AlphaTechx
          </h2>
          <p className="text-blue-100 mb-8">
            Experience the future of AI-powered business solutions. Join thousands of companies already transforming their operations with our intelligent platform.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-white/10 p-2 rounded-lg">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="p-4 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <p className="text-sm text-blue-100">
                "Leading AlphaTechx with a vision to democratize AI technology for businesses across India. Our intelligent solutions are transforming how companies operate and grow."
              </p>
              <div className="flex items-center mt-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold">CS</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">Chitralekha Swami</p>
                  <p className="text-xs text-blue-200">CEO & Founder, AlphaTechx</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="p-4 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <p className="text-sm text-blue-100">
                "Building cutting-edge AI infrastructure that scales seamlessly. Our technical excellence and innovation drive the next generation of intelligent business solutions."
              </p>
              <div className="flex items-center mt-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold">SK</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">Sandeep Kumar</p>
                  <p className="text-xs text-blue-200">CTO & Co-Founder, AlphaTechx</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 