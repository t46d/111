import { type User, type UpsertUser, type InsertUser, type Match, type InsertMatch, type Chat, type InsertChat, type Payment, type InsertPayment, type Review, type InsertReview, type Analytics, type InsertAnalytics } from "@shared/schema";
import { db } from "./db";
import { users, matches, chats, payments, reviews, analytics } from "@shared/schema";
import { eq, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesForUser(userId: string): Promise<Match[]>;
  
  // Chat operations
  createChat(chat: InsertChat): Promise<Chat>;
  getChatHistory(userId1: string, userId2: string): Promise<Chat[]>;
  getRecentChats(limit?: number): Promise<Chat[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsForUser(userId: string): Promise<Payment[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsForUser(userId: string): Promise<Review[]>;
  getAverageRating(userId: string): Promise<number>;
  
  // Analytics operations
  trackEvent(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsEvents(eventType?: string, limit?: number): Promise<Analytics[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Match operations
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db.insert(matches).values(insertMatch).returning();
    return match;
  }

  async getMatchesForUser(userId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.userId, userId));
  }

  // Chat operations
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const [chat] = await db.insert(chats).values(insertChat).returning();
    return chat;
  }

  async getChatHistory(userId1: string, userId2: string): Promise<Chat[]> {
    return await db
      .select()
      .from(chats)
      .where(
        or(
          and(eq(chats.fromUserId, userId1), eq(chats.toUserId, userId2)),
          and(eq(chats.fromUserId, userId2), eq(chats.toUserId, userId1))
        )
      )
      .orderBy(chats.createdAt);
  }

  async getRecentChats(limit: number = 20): Promise<Chat[]> {
    return await db.select().from(chats).orderBy(chats.createdAt).limit(limit);
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getPaymentsForUser(userId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }

  // Review operations
  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async getReviewsForUser(userId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.toUserId, userId));
  }

  async getAverageRating(userId: string): Promise<number> {
    const reviewList = await this.getReviewsForUser(userId);
    if (reviewList.length === 0) return 0;
    const sum = reviewList.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviewList.length;
  }

  // Analytics operations
  async trackEvent(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analytic] = await db.insert(analytics).values(insertAnalytics).returning();
    return analytic;
  }

  async getAnalyticsEvents(eventType?: string, limit: number = 100): Promise<Analytics[]> {
    let query = db.select().from(analytics);
    if (eventType) {
      query = query.where(eq(analytics.eventType, eventType)) as any;
    }
    return await query.orderBy(analytics.createdAt).limit(limit);
  }
}

export const storage = new DatabaseStorage();
