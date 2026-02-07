import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  RocketLaunchIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demo
  const stats = {
    totalUsers: 1247,
    activeProjects: 89,
    totalRevenue: 45670,
    trialUsers: 23,
    trainingJobs: 156,
    successfulTrainings: 142
  };

  const recentProjects = [
    {
      id: '1',
      name: 'Customer Support Bot',
      owner: 'john@company.com',
      status: 'active',
      plan: 'pro',
      documents: 45,
      queries: 1203,
      lastActivity: '2 hours ago'
    },
    {
      id: '2', 
      name: 'HR Assistant Bot',
      owner: 'sarah@startup.com',
      status: 'training',
      plan: 'enterprise',
      documents: 78,
      queries: 0,
      lastActivity: '30 minutes ago'
    },
    {
      id: '3',
      name: 'Sales FAQ Bot', 
      owner: 'demo@alphatechx.com',
      status: 'active',
      plan: 'free',
      documents: 12,
      queries: 234,
      lastActivity: '1 day ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'training':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: UsersIcon,
      change: '+12%',
      trending: 'up',
      color: 'text-blue-600'
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: RocketLaunchIcon,
      change: '+8%',
      trending: 'up', 
      color: 'text-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change: '+23%',
      trending: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'Trial Users',
      value: stats.trialUsers.toString(),
      icon: ClockIcon,
      change: '-5%',
      trending: 'down',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 AI Bot SaaS Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your AI Bot platform, monitor performance, and track revenue
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trending === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trending === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: ChartBarIcon },
                { id: 'projects', name: 'Bot Projects', icon: RocketLaunchIcon },
                { id: 'users', name: 'Users', icon: UsersIcon },
                { id: 'settings', name: 'Settings', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">🚀 Recent Bot Projects</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          {getStatusIcon(project.status)}
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-500">{project.owner}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanBadgeColor(project.plan)}`}>
                            {project.plan}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{project.lastActivity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Training Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Training Statistics</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Success Rate</span>
                        <span className="font-medium">{stats.successfulTrainings}/{stats.trainingJobs}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(stats.successfulTrainings / stats.trainingJobs) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">{stats.successfulTrainings}</p>
                        <p className="text-sm text-green-600">Successful</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">{stats.trainingJobs - stats.successfulTrainings}</p>
                        <p className="text-sm text-red-600">Failed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">🤖 All Bot Projects</h3>
                <p className="text-sm text-gray-500 mt-1">Monitor and manage all AI bot projects</p>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <RocketLaunchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bot Projects Management</h3>
                  <p className="text-gray-500 mb-4">Here you can view and manage all bot projects, monitor training status, and track performance metrics.</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600">💡 Features coming soon: Project analytics, training logs, performance metrics, and bulk actions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">👥 User Management</h3>
                <p className="text-sm text-gray-500 mt-1">Track user subscriptions, trials, and activity</p>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Analytics & Management</h3>
                  <p className="text-gray-500 mb-4">Comprehensive user management dashboard with subscription tracking, usage analytics, and support tools.</p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600">📈 Current Stats: 1,247 total users, 23 on trial, 89 active projects</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">⚙️ System Settings</h3>
                  <p className="text-sm text-gray-500 mt-1">Configure API integrations and monitor system health</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">🔌 API Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <p className="font-medium text-gray-900">OpenAI API Status</p>
                          <div className="flex items-center mt-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-600">Connected & Active</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">GPT-4 model ready</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <p className="font-medium text-gray-900">Stripe Integration</p>
                          <div className="flex items-center mt-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-600">Active</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Payments processing</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">🏥 System Health</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <p className="font-medium text-green-900">Database</p>
                          </div>
                          <p className="text-sm text-green-600 mt-1">PostgreSQL: Operational</p>
                          <p className="text-xs text-green-500 mt-1">99.9% uptime</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <p className="font-medium text-green-900">Bot Service</p>
                          </div>
                          <p className="text-sm text-green-600 mt-1">NestJS: Running</p>
                          <p className="text-xs text-green-500 mt-1">All endpoints healthy</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <p className="font-medium text-green-900">Training Queue</p>
                          </div>
                          <p className="text-sm text-green-600 mt-1">Processing: 3 jobs</p>
                          <p className="text-xs text-green-500 mt-1">Avg wait: 2.3 min</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">🔗 Integration Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <p className="font-medium text-blue-900">Slack Integration</p>
                          </div>
                          <p className="text-sm text-blue-600 mt-1">12 teams connected</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
                            <p className="font-medium text-purple-900">MS Teams Integration</p>
                          </div>
                          <p className="text-sm text-purple-600 mt-1">8 organizations active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 
