import { type User, type InsertUser, type Match, type InsertMatch, type Chat, type InsertChat, type Payment, type InsertPayment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private matches: Map<string, Match>;
  private chats: Map<string, Chat>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.chats = new Map();
    this.payments = new Map();
    
    // Seed some demo users for matchmaking
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoUsers: InsertUser[] = [
      { name: 'Ava', email: 'ava@demo.com', password: 'demo123', interests: ['Design', 'Tech', 'Music'] },
      { name: 'Leo', email: 'leo@demo.com', password: 'demo123', interests: ['Music', 'Travel', 'Art'] },
      { name: 'Maya', email: 'maya@demo.com', password: 'demo123', interests: ['Art', 'Wellness', 'Books'] },
      { name: 'Omar', email: 'omar@demo.com', password: 'demo123', interests: ['Tech', 'Gaming', 'Sports'] },
      { name: 'Sara', email: 'sara@demo.com', password: 'demo123', interests: ['Wellness', 'Cooking', 'Travel'] },
    ];

    demoUsers.forEach(user => {
      const id = randomUUID();
      this.users.set(id, { ...user, id, avatarUrl: null });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, avatarUrl: null };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email'>>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      name: updates.name !== undefined ? updates.name : user.name,
      interests: updates.interests !== undefined ? updates.interests : user.interests,
      avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : user.avatarUrl,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Match operations
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = randomUUID();
    const match: Match = { ...insertMatch, id, createdAt: new Date() };
    this.matches.set(id, match);
    return match;
  }

  async getMatchesForUser(userId: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.userId === userId
    );
  }

  // Chat operations
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = randomUUID();
    const chat: Chat = { ...insertChat, id, createdAt: new Date() };
    this.chats.set(id, chat);
    return chat;
  }

  async getChatHistory(userId1: string, userId2: string): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .filter(chat =>
        (chat.fromUserId === userId1 && chat.toUserId === userId2) ||
        (chat.fromUserId === userId2 && chat.toUserId === userId1)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async getRecentChats(limit: number = 20): Promise<Chat[]> {
    return Array.from(this.chats.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { ...insertPayment, id, createdAt: new Date() };
    this.payments.set(id, payment);
    return payment;
  }

  async getPaymentsForUser(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      payment => payment.userId === userId
    );
  }
}

export const storage = new MemStorage();
