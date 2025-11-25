import { type User } from "@shared/schema";

const USER_KEY = 'vexa_user';

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function getUserId(): string | null {
  const user = getUser();
  return user ? user.id : null;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export function getAuthHeaders(): Record<string, string> {
  const userId = getUserId();
  return userId ? { 'x-user-id': userId } : {};
}
