import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['Innovation', 'Intelligence', 'Automation', 'Solutions'];

  useEffect(() => {
    const typeWriter = () => {
      const currentWord = words[currentWordIndex];
      let currentLength = typedText.length;

      if (currentLength < currentWord.length) {
        setTypedText(currentWord.substring(0, currentLength + 1));
      } else {
        setTimeout(() => {
          setTypedText('');
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 2000);
      }
    };

    const timer = setTimeout(typeWriter, 150);
    return () => clearTimeout(timer);
  }, [typedText, currentWordIndex, words]);

  const features = [
    {
      title: "AI Slack Bot Solutions",
      description: "Intelligent virtual assistant that automates and enhances business processes with human-like interactions for your organization.",
      backgroundImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Natural Language Processing",
        "Machine Learning",
        "Process Automation"
      ]
    },
    {
      title: "Digital Platform Solution",
      description: "Custom marketplace solutions that connect your organization with seamless information access and user experiences.",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Multi-vendor Management",
        "Secure Data Access",
        "Real-time Analytics"
      ]
    },
    {
      title: "AI Knowledge Hub",
      description: "Revolutionizing workplace communication through immersive AI-powered knowledge management and instant information access.",
      backgroundImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80",
      features: [
        "Immersive AI Environments",
        "High-fidelity Data Simulations",
        "Multi-user Collaborative Learning"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  background: i % 3 === 0 
                    ? 'linear-gradient(45deg, #3b82f6, #60a5fa)' 
                    : i % 3 === 1
                    ? 'linear-gradient(45deg, #f48048, #fb923c)'
                    : 'linear-gradient(45deg, #8b5cf6, #a78bfa)',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)'
                }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          {/* AI Status */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-400/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-white">AI Systems Online & Learning</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            AI-Powered {typedText}
            <span className="animate-pulse text-blue-400">|</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-3xl text-white mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="font-semibold">Transform your business with cutting-edge artificial intelligence solutions.</span>
            <span className="font-semibold"> Automated, intelligent, and ready for the future.</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Link
              to="/products"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl px-10 py-5 rounded-xl font-bold hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
            >
              🚀 Explore AI Solutions
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm text-white text-xl px-10 py-5 rounded-xl font-bold hover:scale-110 transition-all duration-300 border-2 border-white/30 hover:bg-white/20"
            >
              ⚡ Start Your AI Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-24 bg-gray-900 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              Our AI Solutions
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Cutting-edge artificial intelligence solutions designed to transform your business operations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${feature.backgroundImage})`
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-gray-900/30 group-hover:from-blue-900/95 group-hover:via-blue-900/60 transition-all duration-500" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-8">
                  <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed group-hover:text-blue-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  <div className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="flex items-center text-blue-300 group-hover:text-blue-200 transition-colors duration-300"
                      >
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:bg-blue-300 transition-colors duration-300"></div>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <Link
                      to="/products"
                      className="inline-flex items-center text-white font-semibold group-hover:text-blue-200 transition-colors duration-300"
                    >
                      Learn More
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              Ready to Transform Your Future?
            </h2>
            <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join organizations that have already revolutionized their operations with our AI solutions.
              <span className="text-white font-bold"> The future is now!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 text-2xl px-12 py-6 rounded-2xl font-bold hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/30"
              >
                🚀 Deploy AI Now
              </Link>
              <Link
                to="/products"
                className="border-2 border-white text-white text-2xl px-12 py-6 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                📋 View Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 