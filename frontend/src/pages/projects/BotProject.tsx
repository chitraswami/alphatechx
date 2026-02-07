import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';
import IntegrationSetup from './IntegrationSetup';
import WorkspaceManager from '../workspace/WorkspaceManager';
import {
  CloudArrowUpIcon,
  CogIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentIcon,
  PhotoIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  name: string;
  ownerUserId: string;
  plan: 'free' | 'pro' | 'enterprise';
  trialEndsAt?: string | null;
  createdAt: string;
  isTrialActive?: boolean;
  uploadedFiles?: number;
  botTrained?: boolean;
  integrations?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
}

type FlowStep = 'overview' | 'trial' | 'upload' | 'training' | 'integration-selection' | 'integration-config' | 'test-bot' | 'complete';

const BotProject: React.FC = () => {
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<FlowStep>('overview');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedIntegration, setSelectedIntegration] = useState<string>(''); // Single integration selection
  const [testQuery, setTestQuery] = useState<string>('');
  const [testResponse, setTestResponse] = useState<string>('');
  
  // Workspace state
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Helper function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`));
      };
      
      // Read as text for text files, or as data URL for images
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else if (file.type.startsWith('image/')) {
        // For images, just use filename as placeholder text
        resolve(`Image file: ${file.name}`);
      } else {
        // For other files, read as text and hope for the best
        reader.readAsText(file);
      }
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);

        // Note: Bot service URL from integration settings is ONLY for Teams webhook,
        // not for API calls. API calls always go through /api/uploads, /api/query, etc.

        // Load persisted uploaded files from localStorage
        try {
          const persistedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
          
          // Filter files for current user
          const userFiles = persistedFiles.filter((f: any) => f.userId === userId);
          
          // Convert to UploadedFile format
          const loadedFiles: UploadedFile[] = userFiles.map((f: any, index: number) => ({
            id: `file-${Date.now()}-${index}`,
            name: f.name,
            size: f.size,
            type: f.type,
            status: 'completed' as const,
            progress: 100
          }));
          
          setUploadedFiles(loadedFiles);
        } catch (error) {
          console.log('No persisted files found');
        }

        // Load or create project with persisted trial status
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
        
        // Check if user has an active trial
        const trialData = JSON.parse(localStorage.getItem('userTrial') || '{}');
        const userTrial = trialData[userId];
        const hasActiveTrial = userTrial?.isActive && new Date(userTrial.endsAt) > new Date();
        
        const demoProject: Project = {
          id: userTrial?.projectId || 'project-' + userId,
          name: 'My AI Bot Project',
          ownerUserId: userId,
          plan: hasActiveTrial ? 'pro' : 'free',
          trialEndsAt: hasActiveTrial ? userTrial.endsAt : null,
          createdAt: userTrial?.createdAt || new Date().toISOString(),
          isTrialActive: hasActiveTrial,
          uploadedFiles: uploadedFiles.length,
          botTrained: uploadedFiles.length > 0,
          integrations: []
        };

        setProject(demoProject);

        // Determine current step based on project state and query params
        if (query.get('startTrial') === 'true' && !hasActiveTrial) {
          setCurrentStep('trial');
        } else if (hasActiveTrial && uploadedFiles.length === 0) {
          // If trial active but no files, go to upload
          setCurrentStep('upload');
        } else if (hasActiveTrial && uploadedFiles.length > 0) {
          // If trial active and has files, show overview
          setCurrentStep('overview');
        } else {
          setCurrentStep('overview');
        }

      } catch (err: any) {
        console.error('Failed to load project:', err);
        toast.error('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [query]);

  const handleStartTrial = async () => {
    try {
      setIsLoading(true);
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
      
      // Check if user already has trial data (existing user)
      const trialData = JSON.parse(localStorage.getItem('userTrial') || '{}');
      const existingTrial = trialData[userId];
      
      if (existingTrial) {
        // Existing user - already activated trial before
        console.log('🔄 Existing user detected - redirecting to upload');
        toast.success('Welcome back! Continue building your bot.', {
          duration: 3000
        });
        setCurrentStep('upload');
        setIsLoading(false);
        return;
      }
      
      // New user - show activation flow
      console.log('🎯 New user - starting 14-day Pro trial activation...');
      setCurrentStep('trial'); // Go to activation screen
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Trial check failed:', error);
      toast.error('Failed to process trial. Please try again.');
      setIsLoading(false);
    }
  };

  const handleActivateTrial = async () => {
    try {
      setIsLoading(true);
      console.log('✨ Activating trial...');
      
      // Simulate trial activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      
      const updatedProject = {
        ...project!,
        plan: 'pro' as const,
        isTrialActive: true,
        trialEndsAt
      };
      
      // Persist trial status in localStorage
      const trialData = JSON.parse(localStorage.getItem('userTrial') || '{}');
      trialData[userId] = {
        isActive: true,
        endsAt: trialEndsAt,
        createdAt: new Date().toISOString(),
        projectId: updatedProject.id
      };
      localStorage.setItem('userTrial', JSON.stringify(trialData));
      
      setProject(updatedProject);
      setCurrentStep('upload');
      
      toast.success('🎉 14-day Pro trial activated! Upload your data to get started.', {
        duration: 5000
      });
      
    } catch (error: any) {
      console.error('Trial activation failed:', error);
      toast.error('Failed to activate trial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 20;
    
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum 5MB allowed.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      return;
    }
    
    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Upload files one by one with real processing
    for (const file of validFiles) {
      try {
        // Read file content
        const fileContent = await readFileContent(file);
        
        // Upload to bot service with workspace ID
        const uploadResponse = await apiService.uploadFileContent(selectedWorkspace.workspaceId, {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          filename: file.name,
          text: fileContent,
          fileType: file.type,
          fileSize: file.size
        });
        
        if (uploadResponse.success) {
          // Update file status to completed
          setUploadedFiles(prev => prev.map(f => 
            f.name === file.name 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          ));
          
          // Persist to localStorage
          const persistedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
          persistedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            workspaceId: selectedWorkspace.workspaceId,
            uploadedAt: new Date().toISOString()
          });
          localStorage.setItem('uploadedFiles', JSON.stringify(persistedFiles));
          
        } else {
          throw new Error('Upload failed');
        }
        
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        
        // Mark file as failed
        setUploadedFiles(prev => prev.map(f => 
          f.name === file.name 
            ? { ...f, status: 'failed', progress: 0 }
            : f
        ));
      }
    }
    
    // Show success message
    const successCount = newFiles.filter(f => f.status === 'completed').length;
    if (successCount > 0) {
      toast.success(`✅ Successfully uploaded and processed ${successCount} file(s) to Pinecone!`);
    }
  };

  const simulateFileUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...file, progress: 100, status: 'completed' };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 500);
  };

  const handleCreateBot = async () => {
    if (uploadedFiles.filter(f => f.status === 'completed').length === 0) {
      toast.error('Please upload at least one file before creating your bot.');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
    
    // Check if bot has already been trained
    const botTrainingData = JSON.parse(localStorage.getItem('botTraining') || '{}');
    const lastTraining = botTrainingData[userId];
    const currentFileCount = uploadedFiles.filter(f => f.status === 'completed').length;
    
    // Determine if we need to retrain
    const hasNewFiles = !lastTraining || currentFileCount !== lastTraining.fileCount;
    
    if (!hasNewFiles) {
      // No new files - skip training
      console.log('✅ No new files detected - skipping training step');
      toast.success('Bot is ready! Proceeding to integration setup.', { duration: 2000 });
      setProject(prev => ({ ...prev!, botTrained: true }));
      setCurrentStep('integration-selection');
      return;
    }
    
    // New files detected or first time training
    if (lastTraining) {
      console.log('🔄 New files detected - retraining bot with updated data...');
      toast.success('🔄 New files detected! Retraining your bot...', { duration: 3000 });
    } else {
      console.log('🎯 First time training...');
    }
    
    setCurrentStep('training');
    setTrainingProgress(0);
    
    // Simulate bot training process
    const trainingSteps = [
      'Processing documents...',
      'Extracting text and images...',
      'Generating embeddings...',
      'Training AI model...',
      'Optimizing responses...',
      'Bot ready!'
    ];
    
    for (let i = 0; i < trainingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTrainingProgress(((i + 1) / trainingSteps.length) * 100);
      toast.success(trainingSteps[i], { duration: 2000 });
    }
    
    // Update training data in localStorage
    botTrainingData[userId] = {
      trained: true,
      trainedAt: new Date().toISOString(),
      fileCount: currentFileCount
    };
    localStorage.setItem('botTraining', JSON.stringify(botTrainingData));
    
    setProject(prev => ({ ...prev!, botTrained: true }));
    setCurrentStep('integration-selection');
  };

  const handleSelectIntegration = (integration: string) => {
    setSelectedIntegration(integration);
    setCurrentStep('integration-config');
  };

  const handleIntegrationConfigComplete = () => {
    // After configuring integration, go to test-bot step
    setCurrentStep('test-bot');
    toast.success('Integration configured! Test your bot before going live.');
  };

  const handleIntegrationConfigSkip = () => {
    setCurrentStep('test-bot');
  };

  const handleTestBot = async () => {
    if (!testQuery.trim()) {
      toast.error('Please enter a question to test your bot.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.testQuery(testQuery, selectedWorkspace.workspaceId);
      
      if (response.success) {
        setTestResponse(response.answer);
        toast.success('✅ Bot test successful!');
      } else {
        throw new Error(response.error || 'Test failed');
      }
    } catch (error) {
      console.error('Test query error:', error);
      toast.error('Failed to test bot. Please try again.');
      setTestResponse('Error: Could not get response from bot.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoLive = () => {
    setProject(prev => ({ 
      ...prev!, 
      integrations: [selectedIntegration] 
    }));
    setCurrentStep('complete');
    toast.success('🎉 Your bot is now live!', { duration: 5000 });
  };

  const handleDeleteFile = (fileId: string, fileName: string) => {
    // Remove from state
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    // Remove from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
    const persistedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    const updatedFiles = persistedFiles.filter((f: any) => f.name !== fileName || f.userId !== userId);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    
    toast.success(`🗑️ Deleted ${fileName}`);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'trial', label: 'Trial', icon: ClockIcon },
      { key: 'upload', label: 'Upload Data', icon: CloudArrowUpIcon },
      { key: 'training', label: 'Train Bot', icon: CogIcon },
      { key: 'integration-selection', label: 'Select Platform', icon: RocketLaunchIcon },
      { key: 'integration-config', label: 'Configure', icon: CogIcon },
      { key: 'test-bot', label: 'Test Bot', icon: SparklesIcon },
      { key: 'complete', label: 'Complete', icon: CheckCircleIcon }
    ];
    
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = index < currentIndex;
          const IconComponent = step.icon;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive ? 'border-blue-500 bg-blue-500 text-white' :
                isCompleted ? 'border-green-500 bg-green-500 text-white' :
                'border-gray-300 bg-white text-gray-400'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-blue-600' :
                isCompleted ? 'text-green-600' :
                'text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🤖 Create Your AI Bot
        </h1>
        <p className="text-lg text-gray-600">
          Transform your data into an intelligent bot that can answer questions via Slack, Teams, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="text-center">
            <RocketLaunchIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Go to Projects</h3>
            <p className="text-gray-600 mb-4">
              View your existing bot projects and manage their settings.
            </p>
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              View Projects
            </button>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg shadow-sm border p-6 ${
            project?.isTrialActive 
              ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
          }`}
        >
          <div className="text-center">
            {project?.isTrialActive ? (
              <>
                <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro Trial Active!</h3>
                <p className="text-gray-600 mb-4">
                  Your 14-day trial is active. Continue building your bot.
                </p>
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Continue Setup
                </button>
              </>
            ) : (
              <>
                <SparklesIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start 14-day Pro Trial</h3>
                <p className="text-gray-600 mb-4">
                  Get full access to Pro features including unlimited uploads and integrations.
                </p>
                <button
                  onClick={handleStartTrial}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Starting Trial...' : 'Start Free Trial'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderTrialActivation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center"
    >
      <SparklesIcon className="w-16 h-16 text-purple-600 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Activate Your 14-Day Pro Trial
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Get full access to Pro features including unlimited file uploads, advanced integrations, and priority support.
      </p>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pro Trial Includes:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <span>5,000 queries/month</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <span>5GB upload limit</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <span>Slack + Teams integration</span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <span>Priority support</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setCurrentStep('overview')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 inline mr-2" />
          Back
        </button>
        <button
          onClick={handleActivateTrial}
          disabled={isLoading}
          className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Activating...' : 'Activate Trial'}
          <ArrowRightIcon className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderFileUpload = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <CloudArrowUpIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Your Data
        </h1>
        <p className="text-lg text-gray-600">
          Upload documents, images, and files that your bot will learn from.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center mb-6 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files);
          }
        }}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.jpg,.jpeg,.png,.gif"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files);
            }
          }}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-gray-500">
            Supports PDF, DOCX, CSV, XLSX, JPG, PNG and more • Max 5MB per file • Up to 20 files
          </p>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold text-gray-900">Uploaded Files ({uploadedFiles.length}/20)</h3>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center flex-1">
                  {file.type.startsWith('image/') ? (
                    <PhotoIcon className="w-5 h-5 text-blue-500 mr-2" />
                  ) : (
                    <DocumentIcon className="w-5 h-5 text-gray-500 mr-2" />
                  )}
                  <span className="font-medium text-gray-900">{file.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'completed' ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : file.status === 'failed' ? (
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <button
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete file"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        {(() => {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
          const botTrainingData = JSON.parse(localStorage.getItem('botTraining') || '{}');
          const lastTraining = botTrainingData[userId];
          const currentFileCount = uploadedFiles.filter(f => f.status === 'completed').length;
          const hasNewFiles = !lastTraining || currentFileCount !== lastTraining.fileCount;
          
          let buttonText = 'Create Your Bot Now';
          let buttonColor = 'bg-blue-600 hover:bg-blue-700';
          
          if (lastTraining && !hasNewFiles) {
            buttonText = 'Continue to Integration Setup';
            buttonColor = 'bg-green-600 hover:bg-green-700';
          } else if (lastTraining && hasNewFiles) {
            buttonText = 'Retrain Bot with New Data';
            buttonColor = 'bg-purple-600 hover:bg-purple-700';
          }
          
          return (
            <button
              onClick={handleCreateBot}
              disabled={currentFileCount === 0}
              className={`px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonColor}`}
            >
              {buttonText}
              <ArrowRightIcon className="w-4 h-4 inline ml-2" />
            </button>
          );
        })()}
      </div>
    </motion.div>
  );

  const renderTraining = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center"
    >
      <CogIcon className="w-16 h-16 text-purple-600 mx-auto mb-6 animate-spin" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Training Your Bot
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        We're processing your data and training your AI bot. This may take a few minutes.
      </p>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-900 mb-2">
            <span>Training Progress</span>
            <span>{Math.round(trainingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {trainingProgress < 20 && "Processing documents..."}
          {trainingProgress >= 20 && trainingProgress < 40 && "Extracting text and images..."}
          {trainingProgress >= 40 && trainingProgress < 60 && "Generating embeddings..."}
          {trainingProgress >= 60 && trainingProgress < 80 && "Training AI model..."}
          {trainingProgress >= 80 && trainingProgress < 100 && "Optimizing responses..."}
          {trainingProgress >= 100 && "Bot ready!"}
        </div>
      </div>
    </motion.div>
  );

  const renderIntegrationSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <RocketLaunchIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Integration Platform
        </h1>
        <p className="text-lg text-gray-600">
          Where would you like your bot to be available?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            id: 'teams', 
            name: 'Microsoft Teams', 
            icon: '🔵', 
            description: 'Deploy your bot to Microsoft Teams workspace',
            popular: true
          },
          { 
            id: 'slack', 
            name: 'Slack', 
            icon: '💬', 
            description: 'Deploy your bot to Slack channels',
            popular: true
          },
          { 
            id: 'discord', 
            name: 'Discord', 
            icon: '🎮', 
            description: 'Deploy your bot to Discord servers',
            popular: false
          },
          { 
            id: 'custom', 
            name: 'Custom Integration', 
            icon: '🔗', 
            description: 'Use custom webhook or API',
            popular: false
          }
        ].map((integration) => (
          <motion.div
            key={integration.id}
            whileHover={{ scale: 1.02 }}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedIntegration === integration.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => handleSelectIntegration(integration.id)}
          >
            {integration.popular && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Popular
              </div>
            )}
            <div className="flex items-start mb-4">
              <span className="text-4xl mr-4">{integration.icon}</span>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-gray-600">{integration.description}</p>
              </div>
            </div>
            {selectedIntegration === integration.id && (
              <div className="mt-4 flex justify-end">
                <CheckCircleIcon className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderIntegrationConfig = () => {
    // Show IntegrationSetup component only for Teams
    if (selectedIntegration === 'teams') {
      return (
        <IntegrationSetup
          userId={project?.ownerUserId || 'demo-user'}
          onComplete={handleIntegrationConfigComplete}
          onSkip={handleIntegrationConfigSkip}
        />
      );
    }

    // For other integrations, show a placeholder
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <CogIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Configure {selectedIntegration} Integration
        </h1>
        <p className="text-gray-600 mb-8">
          This integration is coming soon. For now, you can skip to test your bot.
        </p>
        <button
          onClick={handleIntegrationConfigSkip}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Skip for Now
          <ArrowRightIcon className="w-4 h-4 inline ml-2" />
        </button>
      </motion.div>
    );
  };

  const renderTestBot = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <SparklesIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Test Your Bot
        </h1>
        <p className="text-lg text-gray-600">
          Try asking questions about your uploaded data before going live.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ask your bot a question:
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleTestBot();
                }
              }}
              placeholder="e.g., What information do you have about..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleTestBot}
              disabled={isLoading || !testQuery.trim()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Testing...
                </div>
              ) : (
                'Test Bot'
              )}
            </button>
          </div>
        </div>

        {testResponse && (
          <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Bot Response:
            </h3>
            <p className="text-gray-800 whitespace-pre-wrap">{testResponse}</p>
          </div>
        )}

        {!testResponse && (
          <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-500">
              Your bot's response will appear here...
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentStep('integration-config')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 inline mr-2" />
          Back to Config
        </button>
        <button
          onClick={handleGoLive}
          disabled={!testResponse}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deploy Bot to {selectedIntegration}
          <ArrowRightIcon className="w-4 h-4 inline ml-2" />
        </button>
      </div>
    </motion.div>
  );


  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto text-center"
    >
      <CheckCircleIcon className="w-20 h-20 text-green-600 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        🎉 Your Bot is Live!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your AI bot is now running 24/7 and ready to answer questions from your integrated platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <DocumentIcon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Data Processed</h3>
          <p className="text-2xl font-bold text-blue-600">{uploadedFiles.length}</p>
          <p className="text-sm text-gray-500">files uploaded</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <RocketLaunchIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Integrations</h3>
          <p className="text-2xl font-bold text-green-600">{selectedIntegration ? 1 : 0}</p>
          <p className="text-sm text-gray-500">platforms connected</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ClockIcon className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Trial Status</h3>
          <p className="text-2xl font-bold text-purple-600">14</p>
          <p className="text-sm text-gray-500">days remaining</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Test Your Bot</p>
              <p className="text-sm text-gray-600">Try asking questions in your connected platforms</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Monitor Performance</p>
              <p className="text-sm text-gray-600">Check analytics and response quality</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Upload More Data</p>
              <p className="text-sm text-gray-600">Add more documents to improve responses</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Upgrade Plan</p>
              <p className="text-sm text-gray-600">Consider upgrading before trial ends</p>
            </div>
          </div>
        </div>

        {/* Test Query Interface */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">🤖 Test Your Bot</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Ask your bot a question:
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="e.g., What services does AlphaTechX offer?"
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const query = input.value.trim();
                      if (query) {
                        input.value = '';
                        
                        // Show loading toast
                        const loadingToast = toast.loading('🤖 Processing your question...');
                        
                        try {
                          // Call real bot-service query endpoint
                          const response = await fetch('http://localhost:4000/query', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ query })
                          });
                          
                          const result = await response.json();
                          
                          if (result.success) {
                            toast.dismiss(loadingToast);
                            toast.success(
                              <div className="max-w-md">
                                <div className="font-semibold mb-2">🤖 Bot Response:</div>
                                <div className="text-sm">{result.response}</div>
                                <div className="text-xs text-gray-500 mt-2">
                                  Sources: {result.sources} documents | Mode: {result.mode}
                                </div>
                              </div>,
                              { duration: 8000, icon: '🤖' }
                            );
                          } else {
                            throw new Error(result.error || 'Query failed');
                          }
                        } catch (error) {
                          console.error('Query error:', error);
                          toast.dismiss(loadingToast);
                          toast.error('Failed to process query. Please try again.', {
                            duration: 3000
                          });
                        }
                      }
                    }
                  }}
                />
                <button
                  onClick={async (e) => {
                    const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                    const query = input.value.trim();
                    if (query) {
                      input.value = '';
                      
                      // Show loading toast
                      const loadingToast = toast.loading('🤖 Processing your question...');
                      
                      try {
                        // Call real bot-service query endpoint
                        const response = await fetch('http://localhost:4000/query', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ query })
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                          toast.dismiss(loadingToast);
                          toast.success(
                            <div className="max-w-md">
                              <div className="font-semibold mb-2">🤖 Bot Response:</div>
                              <div className="text-sm">{result.response}</div>
                              <div className="text-xs text-gray-500 mt-2">
                                Sources: {result.sources} documents | Mode: {result.mode}
                              </div>
                            </div>,
                            { duration: 8000, icon: '🤖' }
                          );
                        } else {
                          throw new Error(result.error || 'Query failed');
                        }
                      } catch (error) {
                        console.error('Query error:', error);
                        toast.dismiss(loadingToast);
                        toast.error('Failed to process query. Please try again.', {
                          duration: 3000
                        });
                      }
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ask Bot
                </button>
              </div>
            </div>
            <div className="text-sm text-blue-700">
              💡 <strong>Integration Status:</strong> Your bot is connected to Microsoft Teams and ready to respond!
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bot project...</p>
        </div>
      </div>
    );
  }

  // Show workspace selection if no workspace is selected
  if (!selectedWorkspace) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = currentUser.id || currentUser.userId || currentUser.email || 'demo-user';
    
    return (
      <WorkspaceManager
        userId={userId}
        onWorkspaceSelected={(workspace) => {
          setSelectedWorkspace(workspace);
          toast.success(`Workspace "${workspace.name}" selected!`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Indicator */}
        <div className="mb-4 flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-lg">
                {selectedWorkspace.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{selectedWorkspace.name}</h3>
              <p className="text-xs text-gray-500">
                {selectedWorkspace.memberCount} {selectedWorkspace.memberCount === 1 ? 'member' : 'members'} · 
                {selectedWorkspace.documentCount} {selectedWorkspace.documentCount === 1 ? 'document' : 'documents'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedWorkspace(null)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Switch Workspace
          </button>
        </div>
        
        {currentStep !== 'overview' && renderStepIndicator()}
        
        <AnimatePresence mode="wait">
          {currentStep === 'overview' && renderOverview()}
          {currentStep === 'trial' && renderTrialActivation()}
          {currentStep === 'upload' && renderFileUpload()}
          {currentStep === 'training' && renderTraining()}
          {currentStep === 'integration-selection' && renderIntegrationSelection()}
          {currentStep === 'integration-config' && renderIntegrationConfig()}
          {currentStep === 'test-bot' && renderTestBot()}
          {currentStep === 'complete' && renderComplete()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BotProject;
