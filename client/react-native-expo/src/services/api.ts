import axios, { AxiosInstance } from 'axios';

interface WorkflowExecutionResponse {
  link: string;
  token: string;
  workflowId: string;
}

/**
 * API service that communicates with the backend server.
 * The backend server handles API secrets securely - they are never exposed to the client.
 */
class TransactionlinkAPI {
  private client: AxiosInstance;

  constructor() {
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'EXPO_PUBLIC_BACKEND_URL is not configured. ' +
        'Please set it in your .env file to point to your deployed backend server.'
      );
    }

    this.client = axios.create({
      baseURL: backendUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get widget token from backend server
   * The backend handles authentication and workflow creation securely
   */
  async getWidgetToken(parameters?: Record<string, any>): Promise<string> {
    try {
      const response = await this.client.post<WorkflowExecutionResponse>(
        '/workflow-execution',
        parameters || {}
      );

      const token = response.data.token;

      if (!token) {
        throw new Error('No widget token received from backend');
      }

      return token;
    } catch (error) {
      console.error('Failed to get widget token:', error);
      throw error;
    }
  }

  /**
   * Check workflow status
   */
  async getWorkflowStatus(workflowId: string): Promise<{ status: string; workflowId: string }> {
    try {
      const response = await this.client.get('/workflow-status', {
        params: { workflowId },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get workflow status:', error);
      throw error;
    }
  }
}

export const apiService = new TransactionlinkAPI();
