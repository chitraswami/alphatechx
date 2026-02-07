import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

// Form data interface
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  company?: string;
}

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('query');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: '',
      company: ''
    }
  });

  const watchedInquiryType = watch('inquiryType');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Send query email to admin and confirmation email to user
      await sendQueryEmail(data);
      await sendConfirmationEmail(data);
      
      toast.success(`Thank you ${data.name}! Your query has been submitted successfully. You'll receive a confirmation email shortly and we'll respond within 24 hours.`, {
        duration: 6000,
        icon: '✅'
      });
      reset();
    } catch (error) {
      toast.error('Something went wrong. Please try again or contact us directly at info@alphatechx.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to simulate sending query email to admin
  const sendQueryEmail = async (data: ContactFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const emailData = {
      to: 'info@alphatechx.com',
      subject: `New Query: ${data.subject} - ${data.inquiryType}`,
      template: 'admin-query-notification',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || 'Not provided',
        company: data.company || 'Not provided',
        subject: data.subject,
        message: data.message,
        inquiryType: data.inquiryType,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        userAgent: navigator.userAgent
      }
    };
    
    console.log('Query email sent to admin:', emailData);
    return emailData;
  };

  // Function to simulate sending confirmation email to user
  const sendConfirmationEmail = async (data: ContactFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ticketNumber = `ATX-${Date.now().toString().slice(-6)}`;
    const confirmationData = {
      to: data.email,
      subject: `Query Received - AlphaTechx [Ticket: ${ticketNumber}]`,
      template: 'user-confirmation',
      data: {
        name: data.name,
        subject: data.subject,
        inquiryType: data.inquiryType,
        submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        ticketNumber,
        supportEmail: 'info@alphatechx.com',
                 supportPhone: '+91 77424 88278'
      }
    };
    
    console.log('Confirmation email sent to user:', confirmationData);
    
    // Show the ticket number in the UI
    toast.success(`Ticket #${ticketNumber} created! Check your email for confirmation.`, {
      duration: 8000,
      icon: '🎫'
    });
    
    return confirmationData;
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Our Address',
      content: [
        'AlphaTechx Headquarters',
        'Sector 44, Gurgaon',
        'Haryana 122003, India'
      ],
      color: 'text-blue-600'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Number',
      content: ['+91 77424 88278'],
      color: 'text-green-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Address',
      content: ['info@alphatechx.com', 'support@alphatechx.com'],
      color: 'text-purple-600'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      content: [
        'Monday - Friday: 9:00 AM - 7:00 PM',
        'Saturday: 10:00 AM - 5:00 PM',
        'Sunday: Closed'
      ],
      color: 'text-orange-600'
    }
  ];

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Solutions',
      description: 'Experience next-generation AI technology tailored for your business needs.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Serving India',
      description: 'Currently providing services across all major cities in India with plans for global expansion.'
    },
    {
      icon: UserGroupIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer support with AI-assisted quick response system.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee for all our services.'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Quick deployment and delivery of solutions across all Indian metros and cities.'
    },
    {
      icon: ChatBubbleBottomCenterTextIcon,
      title: 'AI Chat Support',
      description: 'Intelligent chatbot assistance for instant query resolution and guidance.'
    }
  ];

  const inquiryTypes = [
    'General Inquiry',
    'Product Demo & Consultation',
    'Technical Support',
    'Business Partnership',
    'Pricing & Quotation',
    'AI Solutions Consulting',
    'Custom Development',
    'Enterprise Solutions',
    'Training & Workshops',
    'Bug Report',
    'Feature Request',
    'Other'
  ];

  const getSubjectSuggestions = (inquiryType: string) => {
    const suggestions: { [key: string]: string[] } = {
      'General Inquiry': ['Information Request', 'Service Overview', 'Company Information'],
      'Product Demo & Consultation': ['Schedule Demo', 'Product Consultation', 'Live Demonstration'],
      'Technical Support': ['Technical Issue', 'Integration Help', 'Configuration Support'],
      'Business Partnership': ['Partnership Opportunity', 'Collaboration Proposal', 'Joint Venture'],
      'Pricing & Quotation': ['Pricing Information', 'Custom Quote Request', 'Volume Pricing'],
      'AI Solutions Consulting': ['AI Strategy Consultation', 'AI Implementation', 'AI Optimization'],
      'Custom Development': ['Custom Solution Request', 'Development Proposal', 'Bespoke Development'],
      'Enterprise Solutions': ['Enterprise Package', 'Scalable Solutions', 'Enterprise Integration'],
      'Training & Workshops': ['Training Request', 'Workshop Inquiry', 'Team Training'],
      'Bug Report': ['Bug Report', 'System Issue', 'Error Report'],
      'Feature Request': ['Feature Request', 'Enhancement Suggestion', 'New Feature Proposal']
    };
    return suggestions[inquiryType] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ready to transform your business with AI? Submit your query and get expert assistance within 24 hours. 
              Currently serving clients across India with cutting-edge technology solutions.
            </p>
            
            {/* Service Coverage Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full font-semibold"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              🇮🇳 Proudly Serving All of India
            </motion.div>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              {['query', 'contact', 'location', 'features'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                    selectedTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedTab === 'query' && (
              <div className="max-w-4xl mx-auto">
                {/* Query Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl mr-4">
                      <PaperAirplaneIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Submit Your Query</h2>
                      <p className="text-gray-600 mt-2">Get expert assistance within 24 hours • Receive email confirmation instantly</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          {...register('name', { 
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          {...register('phone', {
                            pattern: {
                              value: /^[+]?[0-9\s\-()]+$/,
                              message: 'Please enter a valid phone number'
                            }
                          })}
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company/Organization
                        </label>
                        <input
                          {...register('company')}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your company name (optional)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        {...register('inquiryType', { required: 'Please select an inquiry type' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.inquiryType && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.inquiryType.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        {...register('subject', { 
                          required: 'Subject is required',
                          minLength: { value: 5, message: 'Subject must be at least 5 characters' }
                        })}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Brief subject of your inquiry"
                        list="subject-suggestions"
                      />
                      <datalist id="subject-suggestions">
                        {getSubjectSuggestions(watchedInquiryType).map((suggestion, index) => (
                          <option key={index} value={suggestion} />
                        ))}
                      </datalist>
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.subject.message}
                        </p>
                      )}
                      {watchedInquiryType && getSubjectSuggestions(watchedInquiryType).length > 0 && (
                        <p className="text-blue-600 text-sm mt-1">
                          💡 Suggested subjects available in dropdown
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register('message', { 
                          required: 'Message is required',
                          minLength: { value: 10, message: 'Message must be at least 10 characters' }
                        })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Please describe your query in detail. Include any specific requirements, timeline, or questions you have..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">What happens next?</p>
                          <ul className="space-y-1">
                            <li>• You'll receive an email confirmation with your ticket number</li>
                            <li>• Our team will review your query within 4 hours</li>
                            <li>• We'll respond with a detailed solution within 24 hours</li>
                                                         <li>• For urgent matters, call us at +91 77424 88278</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Submitting Query...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                          Submit Query
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {selectedTab === 'contact' && (
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 ${info.color}`}>
                          <info.icon className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h4>
                          {info.content.map((item, i) => (
                            <p key={i} className="text-gray-600 mb-1">{item}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Contact */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                  <div className="space-y-4">
                                         <a
                       href="tel:+917742488278"
                       className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                     >
                       <PhoneIcon className="h-6 w-6 text-green-600 mr-4" />
                       <div>
                         <p className="font-semibold text-green-800">Call Now</p>
                         <p className="text-green-600">+91 77424 88278</p>
                       </div>
                     </a>
                    
                    <a
                      href="mailto:info@alphatechx.com"
                      className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-4" />
                      <div>
                        <p className="font-semibold text-blue-800">Email Us</p>
                        <p className="text-blue-600">info@alphatechx.com</p>
                      </div>
                    </a>

                                         <a
                       href="https://wa.me/917742488278"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                     >
                       <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-green-600 mr-4" />
                       <div>
                         <p className="font-semibold text-green-800">WhatsApp</p>
                         <p className="text-green-600">+91 77424 88278</p>
                       </div>
                     </a>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'location' && (
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="h-96 bg-gray-200 relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14036.64885471662!2d77.05906!3d28.4601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf7fe8e5c64b1e!2sSector%2044%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1703856000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="AlphaTechx Office Location"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Visit Our Office</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">AlphaTechx Headquarters, Sector 44, Gurgaon, Haryana 122003, India</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TruckIcon className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Easy access via Delhi Metro - Huda City Centre</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ClockIcon className="h-5 w-5 text-orange-600" />
                        <span className="text-gray-700">15 mins from IGI Airport, 20 mins from Delhi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why Gurgaon?</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Strategic location in India's technology hub</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Close proximity to major multinational companies</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Excellent connectivity to Delhi NCR region</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <p className="text-gray-700">Access to top-tier talent and infrastructure</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">Service Coverage</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Major Cities</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Delhi NCR</li>
                          <li>• Mumbai</li>
                          <li>• Bangalore</li>
                          <li>• Chennai</li>
                          <li>• Hyderabad</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expanding To</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Pune</li>
                          <li>• Kolkata</li>
                          <li>• Ahmedabad</li>
                          <li>• Jaipur</li>
                          <li>• Kochi</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'features' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-lg">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 ml-3">{feature.title}</h4>
                    </div>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <ChatBubbleBottomCenterTextIcon className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Need Instant Help? Try Our AI Assistant
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get immediate answers to your questions with our intelligent AI chatbot. 
              Available 24/7 to assist you with product information, technical support, and more.
            </p>
            <button 
              onClick={() => toast.success('AI Chat will be available soon! For now, please use the query form above.', { duration: 5000 })}
              className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              Start AI Chat
            </button>
          </motion.div>
      </div>
      </section>
    </div>
  );
};

export default Contact; 