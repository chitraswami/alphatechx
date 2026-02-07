import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';
import {
  CogIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface IntegrationSetupProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const IntegrationSetup: React.FC<IntegrationSetupProps> = ({
  userId,
  onComplete,
  onSkip
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [integration, setIntegration] = useState({
    microsoftAppId: '',
    microsoftAppPassword: '',
    microsoftBotServiceUrl: '',
    isActive: false
  });

  useEffect(() => {
    loadExistingIntegration();
  }, [userId]);

  const loadExistingIntegration = async () => {
    try {
      const existing = await apiService.getUserIntegration(userId);
      if (existing) {
        setIntegration({
          microsoftAppId: existing.microsoftAppId || '',
          microsoftAppPassword: '', // Don't populate password for security
          microsoftBotServiceUrl: existing.microsoftBotServiceUrl || '',
          isActive: existing.isActive || false
        });
      }
    } catch (error) {
      // No existing integration, that's fine
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!integration.microsoftAppId || !integration.microsoftAppPassword || !integration.microsoftBotServiceUrl) {
      toast.error('Please fill in all Microsoft Teams integration fields');
      return;
    }

    setLoading(true);

    try {
      await apiService.upsertUserIntegration(userId, {
        microsoftAppId: integration.microsoftAppId,
        microsoftAppPassword: integration.microsoftAppPassword,
        microsoftBotServiceUrl: integration.microsoftBotServiceUrl
      });

      // Note: Bot service URL is stored for Teams webhook configuration only,
      // not used as the base URL for API calls

      toast.success('Teams integration configured successfully!');
      onComplete();
    } catch (error) {
      console.error('Integration setup error:', error);
      toast.error('Failed to configure integration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <CogIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Configure Microsoft Teams Integration
        </h2>
        <p className="text-gray-600">
          Connect your Azure Bot to enable Teams chat functionality
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Microsoft App ID */}
        <div>
          <label htmlFor="microsoftAppId" className="block text-sm font-medium text-gray-700 mb-2">
            Microsoft App ID *
          </label>
          <input
            type="text"
            id="microsoftAppId"
            value={integration.microsoftAppId}
            onChange={(e) => setIntegration(prev => ({
              ...prev,
              microsoftAppId: e.target.value
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="8e62163a-323e-40b4-ad26-9825166b5b07"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Your Azure Bot's Application (client) ID
          </p>
        </div>

        {/* Microsoft App Password */}
        <div>
          <label htmlFor="microsoftAppPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Microsoft App Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="microsoftAppPassword"
              value={integration.microsoftAppPassword}
              onChange={(e) => setIntegration(prev => ({
                ...prev,
                microsoftAppPassword: e.target.value
              }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your app password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your Azure Bot's client secret password
          </p>
        </div>

        {/* Bot Service URL */}
        <div>
          <label htmlFor="microsoftBotServiceUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Bot Service URL *
          </label>
          <input
            type="url"
            id="microsoftBotServiceUrl"
            value={integration.microsoftBotServiceUrl}
            onChange={(e) => setIntegration(prev => ({
              ...prev,
              microsoftBotServiceUrl: e.target.value
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://your-bot-service.com/api/teams/messages"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The webhook URL where Teams will send messages (e.g., https://your-tunnel-url/api/teams/messages)
          </p>
        </div>

        {/* Integration Status */}
        {integration.isActive && (
          <div className="flex items-center p-4 bg-green-50 rounded-md">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm">
              Teams integration is active
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Configuring...
              </>
            ) : (
              <>
                Configure Integration
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          📋 Setup Instructions:
        </h3>
        <ol className="text-sm text-blue-800 space-y-2">
          <li><strong>1. Azure Bot Registration:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Go to <a href="https://portal.azure.com" className="underline" target="_blank" rel="noopener noreferrer">Azure Portal</a></li>
              <li>• Create "Azure Bot" resource (F0 - Free tier)</li>
              <li>• Copy the Microsoft App ID from Configuration</li>
            </ul>
          </li>
          <li><strong>2. Generate Client Secret:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Click App ID link → "Certificates & secrets"</li>
              <li>• Create new client secret → Copy value immediately</li>
            </ul>
          </li>
          <li><strong>3. Bot Service URL (PRODUCTION ONLY):</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• <strong>Production:</strong> <code className="bg-white px-1">https://api.yourdomain.com/api/teams/messages</code></li>
              <li>• <strong>Development:</strong> Use ngrok/localtunnel for testing only</li>
              <li>• ⚠️ Each user needs isolated webhook routing in production</li>
            </ul>
          </li>
        </ol>
      </div>
      
      {/* Production Warning */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h3 className="text-sm font-semibold text-amber-900 mb-1">
          ⚠️ Production Deployment Required
        </h3>
        <p className="text-xs text-amber-800">
          This integration requires your application to be deployed to a public server with a domain name. 
          Microsoft Teams cannot reach localhost. Deploy to AWS/Azure/GCP before activating Teams integration.
        </p>
      </div>
    </motion.div>
  );
};

export default IntegrationSetup;
