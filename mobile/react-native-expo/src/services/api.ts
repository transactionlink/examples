import axios, { AxiosInstance } from 'axios';
import {
  AuthRequest,
  AuthResponse,
  WorkflowRequest,
  WorkflowResponse,
  StoredAuth,
} from '../types';
import { StorageService } from './storage';

class TransactionlinkAPI {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.transactionlink.io/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Authenticate with API credentials
   */
  async authenticate(): Promise<AuthResponse> {
    try {
      const authRequest: AuthRequest = {
        key: process.env.EXPO_PUBLIC_API_KEY || '',
        secret: process.env.EXPO_PUBLIC_API_SECRET || '',
      };

      const response = await this.client.post<AuthResponse>(
        'auth/authorize',
        authRequest
      );

      this.authToken = response.data.accessToken;

      // Calculate expiry time and save to secure storage
      const expiresAt = Date.now() + response.data.expiryDuration * 1000;
      const storedAuth: StoredAuth = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresAt,
      };

      await StorageService.saveAuth(storedAuth);

      return response.data;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  /**
   * Get current auth token (from memory or storage)
   */
  async getAuthToken(): Promise<string> {
    if (this.authToken) {
      return this.authToken;
    }

    const storedAuth = await StorageService.getAuth();
    if (storedAuth) {
      this.authToken = storedAuth.accessToken;
      return storedAuth.accessToken;
    }

    // No valid token, need to authenticate
    const authResponse = await this.authenticate();
    return authResponse.accessToken;
  }

  /**
   * Create and run a workflow
   */
  async runWorkflow(
    workflowDefinitionId: string,
    parameters?: Record<string, any>
  ): Promise<WorkflowResponse> {
    try {
      const token = await this.getAuthToken();

      const workflowRequest: WorkflowRequest = {
        workflowDefinitionId,
        locale: process.env.EXPO_PUBLIC_LOCALE || 'en',
        parameters: parameters || {},
      };

      const response = await this.client.post<WorkflowResponse>(
        'workflows',
        workflowRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to run workflow:', error);
      throw error;
    }
  }

  /**
   * Extract token from widget link
   */
  extractTokenFromLink(link: string): string | null {
    try {
      const url = new URL(link);
      return url.searchParams.get('token');
    } catch (error) {
      console.error('Failed to extract token from link:', error);
      return null;
    }
  }

  /**
   * Get widget token for a workflow
   */
  async getWidgetToken(
    workflowDefinitionId?: string,
    parameters?: Record<string, any>
  ): Promise<string> {
    const defId = workflowDefinitionId || process.env.EXPO_PUBLIC_WORKFLOW_DEFINITION_ID || '';
    const workflowResponse = await this.runWorkflow(defId, parameters);

    // Try to extract token from link first, fallback to direct token
    const token =
      this.extractTokenFromLink(workflowResponse.link) ||
      workflowResponse.token;

    if (!token) {
      throw new Error('No widget token received from API');
    }

    return token;
  }
}

export const apiService = new TransactionlinkAPI();
