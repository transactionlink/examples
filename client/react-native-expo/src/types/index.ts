export interface AuthRequest {
  key: string;
  secret: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiryDuration: number;
  tokenType: string;
}

export interface WorkflowRequest {
  workflowDefinitionId: string;
  locale: string;
  parameters?: Record<string, any>;
}

export interface WorkflowResponse {
  id: string;
  link: string;
  token: string;
  status: string;
}

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
