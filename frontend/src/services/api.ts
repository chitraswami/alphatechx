import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://alfatechx.com/api';
const BOT_API_BASE_URL = process.env.REACT_APP_BOT_API_URL || 'https://alfatechx.com/api';

class ApiService {
  private api: AxiosInstance;
  private bot: AxiosInstance;
  private userBotServiceUrl: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Initialize bot service with base URL, will be updated per user
    this.bot = axios.create({
      baseURL: BOT_API_BASE_URL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.bot.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        // Don't show error toast for network errors or 404s on integrations endpoint
        const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error';
        const isIntegrationNotFound = error.config?.url?.includes('/integrations/') && error.response?.status === 404;
        
        if (!isNetworkError && !isIntegrationNotFound) {
          const message = error.response?.data?.message || 'An error occurred';
          toast.error(message);
        }
        
        return Promise.reject(error);
      }
    );

    this.bot.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private async botRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.bot.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Token management methods
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Set user's bot service URL for dynamic routing
  setUserBotServiceUrl(url: string): void {
    this.userBotServiceUrl = url;
    // Update the bot axios instance base URL
    this.bot.defaults.baseURL = url;
    console.log('Bot service URL updated to:', url);
  }

  getCurrentBotServiceUrl(): string | null {
    return this.userBotServiceUrl;
  }

  // Auth Methods - Using bot service for authentication
  async login(email: string, password: string) {
    try {
      const response = await this.bot.post('/auth/login', { email, password });
      if (response.data.success && response.data.token) {
        this.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    }
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
  }) {
    try {
      const response = await this.bot.post('/auth/register', userData);
      if (response.data.success && response.data.token) {
        this.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      throw error;
    }
  }

  async getProfile() {
    try {
      // Try to get profile from localStorage first (demo mode)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return { success: true, user: JSON.parse(userStr) };
      }

      // If no local user, try API
      const response = await this.api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.clearAuthToken();
        // Don't show error toast on page load, just clear auth
        console.log('Session expired');
      } else if (error.response?.status === 404) {
        // Auth endpoint not found, use demo mode
        const userStr = localStorage.getItem('user');
        if (userStr) {
          return { success: true, user: JSON.parse(userStr) };
        }
      }
      throw error;
    }                                                                                         
  }

  async updateProfile(userData: any) {
    return this.request({
      method: 'PUT',
      url: '/auth/profile',
      data: userData,
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request({
      method: 'PUT',
      url: '/auth/change-password',
      data: passwordData,
    });
  }

  // Public Content Methods
  async getContent(section: string) {
    return this.request({
      method: 'GET',
      url: `/public/content/${section}`,
    });
  }

  async getProducts(params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
  }) {
    return this.request({
      method: 'GET',
      url: '/public/products',
      params,
    });
  }

  async getProduct(slug: string) {
    return this.request({
      method: 'GET',
      url: `/public/products/${slug}`,
    });
  }

  async submitContact(contactData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    inquiryType?: string;
  }) {
    return this.request({
      method: 'POST',
      url: '/public/contact',
      data: contactData,
    });
  }

  // Admin Methods
  async getAllContent(params?: {
    section?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request({
      method: 'GET',
      url: '/admin/content',
      params,
    });
  }

  async createContent(contentData: any) {
    return this.request({
      method: 'POST',
      url: '/admin/content',
      data: contentData,
    });
  }

  async updateContent(id: string, contentData: any) {
    return this.request({
      method: 'PUT',
      url: `/admin/content/${id}`,
      data: contentData,
    });
  }

  async deleteContent(id: string) {
    return this.request({
      method: 'DELETE',
      url: `/admin/content/${id}`,
    });
  }

  async getAllProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request({
      method: 'GET',
      url: '/admin/products',
      params,
    });
  }

  async createProduct(productData: FormData) {
    return this.request({
      method: 'POST',
      url: '/admin/products',
      data: productData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateProduct(id: string, productData: FormData) {
    return this.request({
      method: 'PUT',
      url: `/admin/products/${id}`,
      data: productData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteProduct(id: string) {
    return this.request({
      method: 'DELETE',
      url: `/admin/products/${id}`,
    });
  }

  async getContacts(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request({
      method: 'GET',
      url: '/admin/contacts',
      params,
    });
  }

  async getContact(id: string) {
    return this.request({
      method: 'GET',
      url: `/admin/contacts/${id}`,
    });
  }

  async updateContactStatus(id: string, status: string) {
    return this.request({
      method: 'PUT',
      url: `/admin/contacts/${id}/status`,
      data: { status },
    });
  }

  async addContactNote(id: string, note: string) {
    return this.request({
      method: 'POST',
      url: `/admin/contacts/${id}/notes`,
      data: { note },
    });
  }

  async getUsers() {
    return this.request({
      method: 'GET',
      url: '/admin/users',
    });
  }

  async updateUserRole(id: string, role: string) {
    return this.request({
      method: 'PUT',
      url: `/admin/users/${id}/role`,
      data: { role },
    });
  }

  // Bot-service Methods
  async getOrCreateProject() {
    return this.botRequest({
      method: 'POST',
      url: '/projects/get-or-create',
    });
  }

  async getProject(projectId: string) {
    return this.botRequest({
      method: 'GET',
      url: `/projects/${projectId}`,
    });
  }

  async startTrial(plan: 'pro') {
    return this.botRequest({
      method: 'POST',
      url: '/billing/start-trial',
      data: { plan },
    });
  }

  async uploadDocuments(projectId: string, files: File[]) {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    return this.botRequest({
      method: 'POST',
      url: `/projects/${projectId}/documents/upload`,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async trainBot(projectId: string) {
    return this.botRequest({
      method: 'POST',
      url: `/projects/${projectId}/train`,
    });
  }

  async getIntegrationUrls(projectId: string) {
    return this.botRequest({
      method: 'GET',
      url: `/projects/${projectId}/integrations/install-urls`,
    });
  }
  // Bot Project Methods
  async uploadFiles(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await this.bot.post('/uploads/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('File upload failed. Please try again.');
      }
      throw error;
    }
  }

  // Upload file content (text extracted from file)
  async uploadFileContent(workspaceId: string, document: {
    id: string;
    filename: string;
    text: string;
    fileType?: string;
    fileSize?: number;
  }): Promise<any> {
    try {
      const response = await this.bot.post('/uploads/files', {
        workspaceId,
        documents: [document]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('File content upload failed:', error);
      throw error;
    }
  }

  async validateIntegration(type: string, credentials: any): Promise<any> {
    try {
      const response = await this.bot.post('/integrations/validate', {
        type,
        credentials,
      }, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Integration validation failed. Please try again.');
      }
      throw error;
    }
  }

  async testQuery(query: string, workspaceId: string): Promise<any> {
    try {
      const response = await this.bot.post('/uploads/test-query', {
        query,
        workspaceId, // Include workspaceId so bot knows which namespace to query
      }, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Query test failed. Please try again.');
      }
      throw error;
    }
  }

  // Get user's bot service URL for dynamic routing
  async getUserBotServiceUrl(userId: string): Promise<string> {
    try {
      const response = await this.api.get(`/integrations/boturl?userId=${userId}`);
      return response.data.botServiceUrl;
    } catch (error: any) {
      // Don't throw errors - just return empty string if not configured
      // This is expected for new users or when backend is not running
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.log('Backend not available - using default bot service URL');
        return '';
      }
      if (error.response?.status === 404) {
        console.log('Bot service URL not configured for user yet');
        return '';
      }
      console.log('Could not fetch bot service URL:', error.message);
      return '';
    }
  }

  // Get user's integration settings
  async getUserIntegration(userId: string): Promise<any> {
    try {
      const response = await this.api.get(`/integrations/get?userId=${userId}`);
      return response.data.integration;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No integration configured
      }
      throw error;
    }
  }

  // Create or update user's integration settings
  async upsertUserIntegration(userId: string, integrationData: {
    microsoftAppId?: string;
    microsoftAppPassword?: string;
    microsoftBotServiceUrl?: string;
    slackBotToken?: string;
    slackSigningSecret?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post(`/integrations/save`, { userId, ...integrationData });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update integration settings');
      }
      throw error;
    }
  }

  // ==================== WORKSPACE METHODS ====================

  // Create a new workspace
  async createWorkspace(data: {
    name: string;
    description?: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    teamsUserId?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post('/workspaces/create', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create workspace');
    }
  }

  // Join workspace with invite code
  async joinWorkspace(data: {
    inviteCode: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    teamsUserId?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post('/workspaces/join', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to join workspace');
    }
  }

  // Get user's workspaces
  async getUserWorkspaces(userId: string): Promise<any> {
    try {
      const response = await this.api.get(`/workspaces/list?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to load workspaces');
    }
  }

  // Get workspace by Teams user ID
  async getWorkspaceByTeamsUser(teamsUserId: string): Promise<any> {
    try {
      const response = await this.api.get(`/workspaces/by-teams-user?teamsUserId=${teamsUserId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to find workspace');
    }
  }

  // Get workspace members
  async getWorkspaceMembers(workspaceId: string): Promise<any> {
    try {
      const response = await this.api.get(`/workspaces/members?workspaceId=${workspaceId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to load members');
    }
  }
}

export const apiService = new ApiService();
export default apiService; 