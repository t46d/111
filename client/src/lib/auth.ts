// Legacy auth functions - kept for backwards compatibility
// Authentication is now handled by Replit Auth via useAuth hook
// These functions are no longer active but remain for code that still imports them

import { type User } from "@shared/schema";

const USER_KEY = 'vexa_user';

export function saveUser(user: User) {
  // Legacy function - no longer used with Replit Auth
}

export function getUser(): User | null {
  // Legacy function - use useAuth hook from @/hooks/useAuth instead
  return null;
}

export function getUserId(): string | null {
  // Legacy function - user ID comes from Replit Auth session
  return null;
}

export function clearUser() {
  // Legacy function - session cleanup handled by Replit Auth
}

export function isAuthenticated(): boolean {
  // Legacy function - use useAuth hook instead
  return false;
}

export function getAuthHeaders(): Record<string, string> {
  // With Replit Auth, headers are not needed - authentication is handled via session
  return {};
}
