import { apiRequest } from './queryClient';

export async function trackEvent(eventType: string, eventData?: Record<string, any>) {
  try {
    await apiRequest('POST', '/api/analytics/track', {
      eventType,
      eventData: eventData || {},
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export const ANALYTICS_EVENTS = {
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  USER_LOGOUT: 'user_logout',
  VIEW_PROFILE: 'view_profile',
  EDIT_PROFILE: 'edit_profile',
  VIEW_MATCH: 'view_match',
  CREATE_MATCH: 'create_match',
  START_CHAT: 'start_chat',
  SEND_MESSAGE: 'send_message',
  CHECKOUT: 'checkout',
  PAYMENT_SUCCESS: 'payment_success',
  CREATE_REVIEW: 'create_review',
  VIEW_REVIEWS: 'view_reviews',
} as const;
