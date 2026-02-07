import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { apiService } from '../../services/api';
import { 
  PlusIcon, 
  UserGroupIcon,
  ClipboardDocumentIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Workspace {
  workspaceId: string;
  name: string;
  description: string;
  inviteCode: string;
  role: string;
  memberCount: number;
  documentCount: number;
  createdAt: string;
}

interface WorkspaceManagerProps {
  userId: string;
  onWorkspaceSelected: (workspace: Workspace) => void;
}

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ userId, onWorkspaceSelected }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  // Create workspace form
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Join workspace form
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, [userId]);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUserWorkspaces(userId);
      setWorkspaces(data.workspaces || []);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      toast.error('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }

    try {
      setCreating(true);
      const result = await apiService.createWorkspace({
        name: newWorkspaceName.trim(),
        description: newWorkspaceDesc.trim(),
        userId,
        userName: '', // Can be populated from user profile
        userEmail: '',
        teamsUserId: ''
      });

      if (result.success) {
        toast.success(`Workspace "${result.workspace.name}" created!`);
        setNewWorkspaceName('');
        setNewWorkspaceDesc('');
        setShowCreate(false);
        await loadWorkspaces();
      }
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      toast.error(error.message || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    try {
      setJoining(true);
      const result = await apiService.joinWorkspace({
        inviteCode: joinCode.trim().toUpperCase(),
        userId,
        userName: '',
        userEmail: '',
        teamsUserId: ''
      });

      if (result.success) {
        toast.success(result.message || 'Joined workspace successfully!');
        setJoinCode('');
        setShowJoin(false);
        await loadWorkspaces();
      }
    } catch (error: any) {
      console.error('Error joining workspace:', error);
      toast.error(error.message || 'Failed to join workspace');
    } finally {
      setJoining(false);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Invite code copied!');
  };

  const linkTeamsToWorkspace = async (workspaceId: string, teamsUserId: string) => {
    try {
      const response = await fetch('https://alfatechx.com/api/workspaces/link-teams-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          userId,
          teamsUserId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`✅ ${data.message}\n\nYou can now chat with the bot in Teams!`);
      } else {
        toast.error(`Failed to link: ${data.error}`);
      }
    } catch (error) {
      console.error('Error linking Teams account:', error);
      toast.error('Failed to link Teams account. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Workspaces
          </h1>
          <p className="text-gray-600">
            Select a workspace or create a new one to get started
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Create Workspace
          </button>
          <button
            onClick={() => setShowJoin(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <UserGroupIcon className="w-5 h-5" />
            Join Workspace
          </button>
        </div>

        {/* Create Workspace Modal */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Create New Workspace</h2>
              <form onSubmit={handleCreateWorkspace}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="My Team Workspace"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newWorkspaceDesc}
                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="What's this workspace for?"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Join Workspace Modal */}
        {showJoin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoin(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Join Workspace</h2>
              <form onSubmit={handleJoinWorkspace}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Code
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl font-mono tracking-wider"
                    placeholder="ABC123"
                    maxLength={6}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the 6-character code shared by your team
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowJoin(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={joining}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {joining ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Workspaces List */}
        {workspaces.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workspaces yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create a new workspace or join an existing one to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {workspaces.map((workspace) => (
              <motion.div
                key={workspace.workspaceId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {workspace.name}
                      </h3>
                      {workspace.role === 'owner' && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                          Owner
                        </span>
                      )}
                    </div>
                    {workspace.description && (
                      <p className="text-gray-600 mb-3">{workspace.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClipboardDocumentIcon className="w-4 h-4" />
                        {workspace.documentCount} {workspace.documentCount === 1 ? 'document' : 'documents'}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Invite Code:</span>
                        <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm font-bold">
                          {workspace.inviteCode}
                        </code>
                        <button
                          onClick={() => copyInviteCode(workspace.inviteCode)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Workspace ID:</span>
                        <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm font-bold">
                          {workspace.workspaceId}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(workspace.workspaceId);
                            toast.success('Workspace ID copied!');
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            const teamsId = prompt('Paste your Teams User ID here (from Teams bot message):');
                            if (teamsId && teamsId.trim()) {
                              linkTeamsToWorkspace(workspace.workspaceId, teamsId.trim());
                            }
                          }}
                          className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded hover:bg-green-100 transition-colors font-medium"
                        >
                          🔗 Link Teams Account
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onWorkspaceSelected(workspace)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Select
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceManager;

