const Workspace = require('../models/Workspace');
const WorkspaceMember = require('../models/WorkspaceMember');

// Create a new workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, userId, userName, userEmail, teamsUserId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Workspace name and user ID are required' 
      });
    }

    // Generate unique IDs
    const workspaceId = Workspace.generateWorkspaceId();
    let inviteCode = Workspace.generateInviteCode();
    
    // Ensure invite code is unique
    let existingCode = await Workspace.findOne({ inviteCode });
    while (existingCode) {
      inviteCode = Workspace.generateInviteCode();
      existingCode = await Workspace.findOne({ inviteCode });
    }

    // Create workspace
    const workspace = new Workspace({
      workspaceId,
      name,
      description: description || '',
      inviteCode,
      ownerId: userId,
      ownerName: userName || '',
      ownerEmail: userEmail || '',
      memberCount: 1
    });

    await workspace.save();

    // Add owner as first member
    const member = new WorkspaceMember({
      workspaceId,
      userId,
      teamsUserId: teamsUserId || '',
      userName: userName || '',
      userEmail: userEmail || '',
      role: 'owner'
    });

    await member.save();

    console.log(`✅ Created workspace: ${workspaceId} (${name}) for user ${userId}`);

    res.json({
      success: true,
      workspace: {
        workspaceId: workspace.workspaceId,
        name: workspace.name,
        description: workspace.description,
        inviteCode: workspace.inviteCode,
        role: 'owner',
        memberCount: workspace.memberCount,
        documentCount: workspace.documentCount,
        plan: workspace.plan,
        trialEndsAt: workspace.trialEndsAt,
        createdAt: workspace.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error creating workspace:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Join workspace with invite code
exports.joinWorkspace = async (req, res) => {
  try {
    const { inviteCode, userId, userName, userEmail, teamsUserId } = req.body;

    if (!inviteCode || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invite code and user ID are required' 
      });
    }

    // Find workspace by invite code
    const workspace = await Workspace.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!workspace) {
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid invite code' 
      });
    }

    if (!workspace.isActive) {
      return res.status(403).json({ 
        success: false, 
        error: 'This workspace is no longer active' 
      });
    }

    // Check if user is already a member
    const existingMember = await WorkspaceMember.findOne({
      workspaceId: workspace.workspaceId,
      userId
    });

    if (existingMember) {
      return res.json({
        success: true,
        message: 'You are already a member of this workspace',
        workspace: {
          workspaceId: workspace.workspaceId,
          name: workspace.name,
          description: workspace.description,
          role: existingMember.role,
          memberCount: workspace.memberCount,
          documentCount: workspace.documentCount
        }
      });
    }

    // Check member limit
    if (workspace.memberCount >= workspace.maxMembers) {
      return res.status(403).json({ 
        success: false, 
        error: `This workspace has reached its member limit (${workspace.maxMembers} members)` 
      });
    }

    // Add user as member
    const member = new WorkspaceMember({
      workspaceId: workspace.workspaceId,
      userId,
      teamsUserId: teamsUserId || '',
      userName: userName || '',
      userEmail: userEmail || '',
      role: 'member'
    });

    await member.save();

    // Update workspace member count
    workspace.memberCount += 1;
    await workspace.save();

    console.log(`✅ User ${userId} joined workspace: ${workspace.workspaceId} (${workspace.name})`);

    res.json({
      success: true,
      message: `Successfully joined ${workspace.name}`,
      workspace: {
        workspaceId: workspace.workspaceId,
        name: workspace.name,
        description: workspace.description,
        role: 'member',
        memberCount: workspace.memberCount,
        documentCount: workspace.documentCount
      }
    });

  } catch (error) {
    console.error('❌ Error joining workspace:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get user's workspaces
exports.getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    // Find all workspaces user is a member of
    const memberships = await WorkspaceMember.find({ userId });

    if (memberships.length === 0) {
      return res.json({
        success: true,
        workspaces: []
      });
    }

    // Get workspace details
    const workspaceIds = memberships.map(m => m.workspaceId);
    const workspaces = await Workspace.find({ 
      workspaceId: { $in: workspaceIds },
      isActive: true
    });

    // Combine workspace data with user's role
    const result = workspaces.map(ws => {
      const membership = memberships.find(m => m.workspaceId === ws.workspaceId);
      return {
        workspaceId: ws.workspaceId,
        name: ws.name,
        description: ws.description,
        inviteCode: ws.inviteCode,
        role: membership.role,
        memberCount: ws.memberCount,
        documentCount: ws.documentCount,
        plan: ws.plan,
        trialEndsAt: ws.trialEndsAt,
        createdAt: ws.createdAt,
        joinedAt: membership.joinedAt
      };
    });

    res.json({
      success: true,
      workspaces: result
    });

  } catch (error) {
    console.error('❌ Error getting user workspaces:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get workspace by Teams user ID
exports.getWorkspaceByTeamsUser = async (req, res) => {
  try {
    const { teamsUserId } = req.query;

    if (!teamsUserId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Teams user ID is required' 
      });
    }

    // Find user's membership
    const membership = await WorkspaceMember.findOne({ teamsUserId });

    if (!membership) {
      return res.json({
        success: true,
        hasWorkspace: false,
        message: 'No workspace found for this Teams user'
      });
    }

    // Get workspace details
    const workspace = await Workspace.findOne({ 
      workspaceId: membership.workspaceId,
      isActive: true
    });

    if (!workspace) {
      return res.json({
        success: true,
        hasWorkspace: false,
        message: 'Workspace not found or inactive'
      });
    }

    // Update last active
    await membership.updateActivity();

    res.json({
      success: true,
      hasWorkspace: true,
      workspace: {
        workspaceId: workspace.workspaceId,
        name: workspace.name,
        description: workspace.description,
        role: membership.role,
        memberCount: workspace.memberCount,
        documentCount: workspace.documentCount,
        plan: workspace.plan,
        trialEndsAt: workspace.trialEndsAt
      }
    });

  } catch (error) {
    console.error('❌ Error getting workspace by Teams user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get workspace members
exports.getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Workspace ID is required' 
      });
    }

    const members = await WorkspaceMember.find({ workspaceId }).sort({ joinedAt: 1 });

    res.json({
      success: true,
      members: members.map(m => ({
        userId: m.userId,
        userName: m.userName,
        userEmail: m.userEmail,
        role: m.role,
        joinedAt: m.joinedAt,
        lastActiveAt: m.lastActiveAt
      }))
    });

  } catch (error) {
    console.error('❌ Error getting workspace members:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update workspace document count
exports.updateDocumentCount = async (req, res) => {
  try {
    const { workspaceId, count } = req.body;

    if (!workspaceId || count === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Workspace ID and count are required' 
      });
    }

    const workspace = await Workspace.findOne({ workspaceId });

    if (!workspace) {
      return res.status(404).json({ 
        success: false, 
        error: 'Workspace not found' 
      });
    }

    workspace.documentCount = count;
    await workspace.save();

    res.json({
      success: true,
      documentCount: workspace.documentCount
    });

  } catch (error) {
    console.error('❌ Error updating document count:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Link Teams user to workspace
exports.linkTeamsUser = async (req, res) => {
  try {
    const { workspaceId, userId, teamsUserId } = req.body;

    if (!workspaceId || !teamsUserId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Workspace ID and Teams user ID are required' 
      });
    }

    // Find the workspace first
    const workspace = await Workspace.findOne({ workspaceId });
    
    if (!workspace) {
      return res.status(404).json({ 
        success: false, 
        error: 'Workspace not found. Please check your workspace ID.' 
      });
    }

    // Try to find existing member by userId or create new one
    let member = await WorkspaceMember.findOne({ workspaceId, userId: userId || teamsUserId });

    if (!member) {
      // If no member found, check if there's a member without Teams ID (created from web)
      member = await WorkspaceMember.findOne({ workspaceId, teamsUserId: '' });
      
      if (!member) {
        // Create a new member if none exists
        member = new WorkspaceMember({
          workspaceId,
          userId: userId || teamsUserId,
          teamsUserId,
          role: 'member'
        });
      } else {
        // Update existing member without Teams ID
        member.teamsUserId = teamsUserId;
        if (!member.userId || member.userId === '') {
          member.userId = userId || teamsUserId;
        }
      }
    } else {
      // Update existing member's Teams ID
      member.teamsUserId = teamsUserId;
    }

    await member.save();

    console.log(`✅ Linked Teams user ${teamsUserId} to workspace ${workspaceId} (${workspace.name})`);

    res.json({
      success: true,
      message: `Successfully linked to workspace "${workspace.name}"`,
      workspace: {
        workspaceId: workspace.workspaceId,
        name: workspace.name,
        role: member.role
      }
    });

  } catch (error) {
    console.error('❌ Error linking Teams user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Link Teams user to workspace
exports.linkTeamsUser = async (req, res) => {
  try {
    const { userId, workspaceId, teamsUserId } = req.body;

    if (!userId || !workspaceId || !teamsUserId) {
      return res.status(400).json({ 
        success: false, 
        error: 'userId, workspaceId, and teamsUserId are required' 
      });
    }

    // Find the workspace member
    const member = await WorkspaceMember.findOne({ workspaceId, userId });

    if (!member) {
      return res.status(404).json({ 
        success: false, 
        error: 'Member not found in workspace' 
      });
    }

    // Update Teams user ID
    member.teamsUserId = teamsUserId;
    await member.save();

    console.log(`✅ Linked Teams user ${teamsUserId} to workspace ${workspaceId}`);

    res.json({
      success: true,
      message: 'Teams user linked successfully'
    });

  } catch (error) {
    console.error('❌ Error linking Teams user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

