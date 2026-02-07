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
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Form data interface
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  marketingEmails: boolean;
}

// Password strength interface
interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      marketingEmails: false
    }
  });

  const watchPassword = watch('password', '');
  const watchConfirmPassword = watch('confirmPassword', '');

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, label: '', color: '', suggestions: [] };

    let score = 0;
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 8) score += 2;
    else suggestions.push('Use at least 8 characters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('Add uppercase letters');

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('Add lowercase letters');

    // Number check
    if (/\d/.test(password)) score += 1;
    else suggestions.push('Add numbers');

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else suggestions.push('Add special characters');

    // Determine strength
    if (score < 2) return { score, label: 'Weak', color: 'text-red-600', suggestions };
    if (score < 4) return { score, label: 'Fair', color: 'text-yellow-600', suggestions };
    if (score < 6) return { score, label: 'Good', color: 'text-blue-600', suggestions };
    return { score, label: 'Strong', color: 'text-green-600', suggestions };
  };

  const passwordStrength = calculatePasswordStrength(watchPassword);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      console.log('🚀 Register form submitted with data:', data);
      
      // Use real AuthContext registration
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        company: data.company
      });
      
      console.log('✅ Registration successful, navigating to profile');
      // After successful registration, user is auto-logged in, so go to profile
      navigate('/profile');
      reset();
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.', {
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Analytics',
      description: 'Get intelligent insights and automated recommendations for your business'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Enterprise Security',
      description: 'Bank-level security with 256-bit encryption and compliance certifications'
    },
    {
      icon: UserGroupIcon,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools with real-time sync and smart workflows'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-blue-700 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md text-white"
        >
          <h2 className="text-3xl font-bold mb-6">
            Join AlphaTechx Today
          </h2>
          <p className="text-purple-100 mb-8">
            Transform your business with cutting-edge AI solutions. Join over 10,000+ companies already leveraging our intelligent platform for growth.
          </p>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-white/10 p-2 rounded-lg">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-purple-100 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm text-purple-100">
              "The AI recommendations have increased our efficiency by 40%. AlphaTechx is truly revolutionary!"
            </p>
            <div className="flex items-center mt-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold">SK</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">Sandeep Kumar</p>
                <p className="text-xs text-purple-200">CTO & Co-Founder, AlphaTechx</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
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
                Create Account
              </h2>
              <p className="text-gray-600">
                Join AlphaTechx and transform your business with AI
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'First name must be at least 2 characters' }
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                    })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone and Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('phone', {
                      pattern: {
                        value: /^[+]?[0-9\s\-()]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('company')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your Company"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
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

              {/* Password Strength Indicator */}
              {watchPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${passwordStrength.color}`}>
                      {passwordStrength.label} Password
                    </span>
                    <span className="text-gray-500">
                      {passwordStrength.score}/6
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score < 2 ? 'bg-red-500' :
                        passwordStrength.score < 4 ? 'bg-yellow-500' :
                        passwordStrength.score < 6 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.suggestions.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Suggestions:</p>
                      <ul className="list-disc list-inside mt-1">
                        {passwordStrength.suggestions.slice(0, 3).map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === watchPassword || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {watchConfirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {watchPassword === watchConfirmPassword ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms and Marketing */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  {...register('acceptTerms', { required: 'You must accept the terms and conditions' })}
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-600 hover:text-purple-500 font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-purple-600 hover:text-purple-500 font-medium">
                    Privacy Policy
                  </Link>
                  *
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.acceptTerms.message}
                </p>
              )}

              <div className="flex items-start">
                <input
                  {...register('marketingEmails')}
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  I'd like to receive product updates, AI insights, and marketing emails from AlphaTechx
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Account
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </span>
              )}
            </button>
          </motion.form>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-500 font-semibold transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>

          {/* Social Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-500">
                Or sign up with
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => toast.success('Google Sign-Up coming soon!', { duration: 3000 })}
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
              onClick={() => toast.success('Microsoft Sign-Up coming soon!', { duration: 3000 })}
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
    </div>
  );
};

export default Register; 