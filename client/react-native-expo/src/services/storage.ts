import * as SecureStore from 'expo-secure-store';
import { StoredAuth } from '../types';

const AUTH_KEY = 'transactionlink_auth';

export const StorageService = {
  async saveAuth(auth: StoredAuth): Promise<void> {
    try {
      await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(auth));
    } catch (error) {
      console.error('Failed to save auth:', error);
      throw error;
    }
  },

  async getAuth(): Promise<StoredAuth | null> {
    try {
      const authStr = await SecureStore.getItemAsync(AUTH_KEY);
      if (!authStr) return null;

      const auth = JSON.parse(authStr) as StoredAuth;

      // Check if token is expired
      if (auth.expiresAt < Date.now()) {
        await this.clearAuth();
        return null;
      }

      return auth;
    } catch (error) {
      console.error('Failed to get auth:', error);
      return null;
    }
  },

  async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_KEY);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const auth = await this.getAuth();
    return auth !== null;
  },
};
