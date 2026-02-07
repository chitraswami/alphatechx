import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
  const features = [
    {
      title: "Instant Knowledge Access",
      description: "Get immediate answers to your questions about company data, policies, and procedures without waiting for human support.",
      icon: "⚡",
      benefit: "Reduce support tickets by 80%"
    },
    {
      title: "24/7 Availability",
      description: "Your AI assistant is always available, even outside business hours, ensuring your team never gets blocked.",
      icon: "🕒",
      benefit: "Never wait for information again"
    },
    {
      title: "Secure & Private",
      description: "All your organizational data stays within your secure environment. Internal use only with enterprise-grade security.",
      icon: "🔒",
      benefit: "Complete data privacy & control"
    },
    {
      title: "Smart Document Search",
      description: "Instantly search through all your uploaded documents, GitHub repositories, user lists, and company resources.",
      icon: "📋",
      benefit: "Find any document in seconds"
    },
    {
      title: "Natural Language Queries",
      description: "Ask questions in plain English - no need to learn complex search commands or navigate multiple systems.",
      icon: "💬",
      benefit: "Easy for everyone to use"
    },
    {
      title: "Team Productivity Boost",
      description: "Eliminate time wasted searching for information and let your team focus on what they do best.",
      icon: "🚀",
      benefit: "Increase productivity by 40%"
    }
  ];

  const useCases = [
    {
      scenario: "New Employee Onboarding",
      question: "What's our GitHub Actions workflow for deployment?",
      response: "Bot instantly provides the complete workflow documentation with step-by-step instructions."
    },
    {
      scenario: "HR Inquiries",
      question: "Who are the members of the marketing team?",
      response: "Bot quickly lists all marketing team members with their roles and contact information."
    },
    {
      scenario: "Technical Support",
      question: "How do I configure Okta for our organization?",
      response: "Bot provides detailed Okta configuration guide specific to your organization's setup."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text">
              AI-Powered Slack Bot
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Transform your workplace communication with an intelligent assistant that knows your organization inside out
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4 mr-4">
                  <span className="text-4xl">🤖</span>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">Your Internal Knowledge Assistant</h3>
                  <p className="text-gray-600">Instant answers to all your organizational queries</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Product Demo Video Placeholder */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">See Our AI Slack Bot In Action</h2>
              <div className="bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl p-6 relative overflow-hidden">
                {/* Slack Interface Mockup */}
                <div className="bg-white rounded-lg shadow-2xl max-w-4xl mx-auto">
                  {/* Slack Header */}
                  <div className="bg-gray-800 text-white p-4 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <span className="font-bold">#general</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-6 space-y-4 h-96 overflow-hidden">
                    {/* User Message 1 */}
                    <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">J</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-gray-900">John Smith</span>
                          <span className="text-gray-500 text-sm">2:30 PM</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                          <p className="text-gray-800">@AlphatechX Bot, what's our GitHub Actions workflow for deployment?</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bot Response 1 */}
                    <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 2 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-blue-600">AlphatechX Bot</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">BOT</span>
                          <span className="text-gray-500 text-sm">2:31 PM</span>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 max-w-2xl">
                          <p className="text-gray-800 mb-2">📋 <strong>GitHub Actions Deployment Workflow</strong></p>
                          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                            <div>→ Trigger: Push to main branch</div>
                            <div>→ Build: npm install && npm run build</div>
                            <div>→ Test: npm run test</div>
                            <div>→ Deploy: AWS S3 sync</div>
                          </div>
                          <p className="text-gray-600 text-sm">Need the complete YAML file? I can share the full workflow configuration.</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* User Message 2 */}
                    <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 3.5 }}
                    >
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">S</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-gray-900">Sarah Wilson</span>
                          <span className="text-gray-500 text-sm">2:32 PM</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 max-w-md">
                          <p className="text-gray-800">@AlphatechX Bot, who are the members of the marketing team?</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bot Response 2 */}
                    <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 4.5 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-bold text-blue-600">AlphatechX Bot</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">BOT</span>
                          <span className="text-gray-500 text-sm">2:32 PM</span>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 max-w-2xl">
                          <p className="text-gray-800 mb-3">👥 <strong>Marketing Team Members:</strong></p>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">A</div>
                              <span>Alice Johnson - Marketing Director</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">M</div>
                              <span>Mike Chen - Content Specialist</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">L</div>
                              <span>Lisa Rodriguez - Social Media Manager</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-2">📧 Want their contact details? Just ask!</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Typing Indicator */}
                    <motion.div
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 6 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="bg-gray-200 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <p className="text-gray-500">Ask AlphatechX Bot anything about your organization...</p>
                      </div>
                      <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">&lt;2s</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
              Why Choose Our AI Slack Bot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eliminate information bottlenecks and empower your team with instant access to organizational knowledge
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="bg-blue-100 rounded-lg p-3">
                  <span className="text-blue-800 font-semibold">{feature.benefit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
              Real-World Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our AI Slack bot handles common workplace queries
            </p>
          </motion.div>

          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">{useCase.scenario}</h3>
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 font-medium">Employee asks:</p>
                      <p className="text-gray-600 italic">"{useCase.question}"</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800 font-medium">Bot responds:</p>
                      <p className="text-blue-700">{useCase.response}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm">
                      <div className="bg-green-500 h-3 w-3 rounded-full mb-4"></div>
                      <div className="space-y-3">
                        <div className="bg-gray-700 h-4 rounded w-3/4"></div>
                        <div className="bg-gray-700 h-4 rounded w-1/2"></div>
                        <div className="bg-blue-500 h-4 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-900">
              Transform Your Workplace
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6 text-gray-900">Before Our AI Bot</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-red-600">
                  <span className="text-2xl mr-3">❌</span>
                  <span>Employees wait hours for simple information</span>
                </li>
                <li className="flex items-center text-red-600">
                  <span className="text-2xl mr-3">❌</span>
                  <span>Support team overwhelmed with repetitive queries</span>
                </li>
                <li className="flex items-center text-red-600">
                  <span className="text-2xl mr-3">❌</span>
                  <span>Information scattered across multiple systems</span>
                </li>
                <li className="flex items-center text-red-600">
                  <span className="text-2xl mr-3">❌</span>
                  <span>New employees struggle to find resources</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-6 text-gray-900">After Our AI Bot</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-green-600">
                  <span className="text-2xl mr-3">✅</span>
                  <span>Instant answers to any organizational query</span>
                </li>
                <li className="flex items-center text-green-600">
                  <span className="text-2xl mr-3">✅</span>
                  <span>Support team focuses on complex issues</span>
                </li>
                <li className="flex items-center text-green-600">
                  <span className="text-2xl mr-3">✅</span>
                  <span>All information accessible through one bot</span>
                </li>
                <li className="flex items-center text-green-600">
                  <span className="text-2xl mr-3">✅</span>
                  <span>Seamless onboarding experience</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Ready to Transform Your Workplace?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join organizations that have already revolutionized their internal communication with our AI Slack bot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              >
                🚀 Get Started Today
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                📅 Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Products; 