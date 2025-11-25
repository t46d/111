import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { insertPaymentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" }
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'VeXa' });
  });

  // Auth endpoints for Replit Auth
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Profile endpoints
  app.get('/api/profile/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.put('/api/profile/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { updates } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!updates) {
        return res.status(400).json({ error: 'Updates required' });
      }

      // Validate interests format
      if (updates.interests !== undefined && !Array.isArray(updates.interests)) {
        return res.status(400).json({ error: 'Interests must be an array' });
      }

      // Validate name if provided
      if (updates.name !== undefined && typeof updates.name !== 'string') {
        return res.status(400).json({ error: 'Name must be a string' });
      }

      const updatedUser = await storage.updateUser(userId, {
        name: updates.name,
        interests: updates.interests,
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Matchmaking endpoints
  app.get('/api/match/recommendations', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      // Allow unauthenticated users to see demo recommendations
      const allUsers = await storage.getAllUsers();
      let currentUserInterests = ['Design', 'Tech'];
      let currentUserId = '';
      
      if (userId) {
        const currentUser = await storage.getUser(userId);
        if (currentUser) {
          currentUserInterests = currentUser.interests;
          currentUserId = currentUser.id;
        }
      }
      
      // Calculate match scores for other users
      const recommendations = allUsers
        .filter(u => u.id !== currentUserId)
        .map(user => {
          const score = calculateMatchScore(currentUserInterests, user.interests);
          return {
            id: user.id,
            name: user.name,
            score,
            interests: user.interests,
            avatarUrl: user.avatarUrl,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });

  // Chat history endpoint
  app.get('/api/chat/history', async (req, res) => {
    try {
      const chats = await storage.getRecentChats(20);
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get chat history' });
    }
  });

  // Payment endpoint
  app.post('/api/payment/checkout', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { amount } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount required' });
      }

      // Verify user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const payment = await storage.createPayment({
        userId,
        amount,
        status: 'pending',
      });

      res.json({ 
        message: `Checkout initiated for $${payment.amount}`, 
        paymentId: payment.id 
      });
    } catch (error) {
      res.status(500).json({ error: 'Checkout failed' });
    }
  });

  // Review endpoints
  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { toUserId, rating, comment } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!toUserId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid review data' });
      }

      const review = await storage.createReview({
        fromUserId: userId,
        toUserId,
        rating,
        comment: comment || '',
      });

      res.json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  app.get('/api/reviews/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const reviews = await storage.getReviewsForUser(userId);
      const averageRating = await storage.getAverageRating(userId);
      
      res.json({ reviews, averageRating });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  // Analytics endpoints
  app.post('/api/analytics/track', async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { eventType, eventData } = req.body;
      
      if (!eventType) {
        return res.status(400).json({ error: 'Event type required' });
      }

      const event = await storage.trackEvent({
        userId,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : undefined,
      });

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to track event' });
    }
  });

  app.get('/api/analytics/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { eventType, limit } = req.query;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const events = await storage.getAnalyticsEvents(
        eventType as string | undefined,
        limit ? parseInt(limit as string) : 100
      );

      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Socket.IO for real-time chat
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('message', async (msg) => {
      try {
        const fromUserId = msg.fromUserId;
        const toUserId = msg.toUserId;
        const text = msg.text;

        if (!fromUserId || !toUserId || !text) {
          console.error('Invalid message format:', msg);
          return;
        }

        // Persist message
        const chat = await storage.createChat({
          fromUserId,
          toUserId,
          text,
        });

        // Broadcast to sender and recipient
        const messageData = {
          id: chat.id,
          text: chat.text,
          timestamp: chat.createdAt.toISOString(),
          fromUserId: chat.fromUserId,
          toUserId: chat.toUserId,
        };

        io.to(`user-${fromUserId}`).emit('message', messageData);
        io.to(`user-${toUserId}`).emit('message', messageData);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return httpServer;
}

// AI matchmaking algorithm
function calculateMatchScore(interests1: string[], interests2: string[]): number {
  if (!interests1.length || !interests2.length) return 0.5;
  
  const set1 = new Set(interests1.map(i => i.toLowerCase()));
  const set2 = new Set(interests2.map(i => i.toLowerCase()));
  
  let commonInterests = 0;
  set1.forEach(interest => {
    if (set2.has(interest)) commonInterests++;
  });
  
  const totalUnique = new Set(Array.from(set1).concat(Array.from(set2))).size;
  const jaccardIndex = commonInterests / totalUnique;
  
  // Add some randomness for variety
  const randomFactor = 0.7 + Math.random() * 0.3;
  
  return Math.min(0.99, jaccardIndex * randomFactor);
}
