# VeXa - AI-Powered Social Dating Platform

## Overview

VeXa is a modern social dating and chat platform that uses AI-driven matching algorithms to connect users based on shared interests. The application features a cyberpunk-inspired neon aesthetic with glassmorphism design elements, real-time chat functionality, and premium subscription options.

The platform is built as a full-stack TypeScript application with React on the frontend and Express with Socket.IO on the backend, designed to run seamlessly on Replit with minimal configuration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (SPA architecture)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system following "Cyberpunk Elegance" aesthetic:
  - Dark mode as default theme
  - Neon color palette (cyan, magenta, purple accents)
  - Glassmorphic surfaces with backdrop blur effects
  - Custom CSS variables for consistent theming

**State Management Strategy**
- Server state managed via React Query with optimistic updates
- Client state handled with React hooks (useState, useEffect)
- Authentication state persisted in localStorage
- Real-time chat state synchronized via Socket.IO client

**Key Frontend Features**
- Responsive layouts with mobile-first approach
- Dark/light theme toggle functionality
- RTL (Arabic) language support with Cairo/Tajawal fonts
- Form validation using React Hook Form with Zod schemas
- Toast notifications for user feedback

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and REST API endpoints
- Socket.IO for real-time bidirectional communication (chat system)
- TypeScript for type safety across server code
- Dual server setup: development (Vite middleware) and production (static serving)

**API Design Pattern**
- RESTful API structure with consistent endpoint naming
- JSON request/response format
- Error handling middleware for consistent error responses
- Request logging middleware for debugging

**Data Layer**
- In-memory storage implementation (MemStorage class) for development
- Schema definitions using Drizzle ORM with PostgreSQL dialect
- Ready for migration to Neon PostgreSQL database
- Zod schemas for runtime validation of incoming data

**Authentication & Authorization**
- Simple email/password authentication
- User ID passed via custom header (x-user-id)
- Session management ready for production enhancement
- Password storage (currently plain text, should be hashed in production)

**Real-time Communication**
- Socket.IO server for WebSocket connections
- Event-based architecture for chat messages
- Room-based chat organization (user joins their own room)
- Message persistence in storage layer

### Core Application Features

**User Management**
- Registration with name, email, password, and interests
- Login authentication
- Profile editing (name and interests)
- Avatar support (placeholder ready)

**Matching System**
- AI-driven match scoring based on shared interests
- Match recommendations endpoint
- Match history tracking
- Score calculation algorithm (simple overlap for now)

**Chat System**
- Real-time messaging via WebSocket
- Chat history retrieval
- Message persistence
- Online status indicators
- Support for both free and premium chat features

**Payment Integration**
- Payment checkout endpoint structure
- Support for basic and premium subscription tiers
- Payment status tracking
- Ready for Stripe or similar payment processor integration

### Database Schema

**Users Table**
- UUID primary keys
- Name, email, password fields
- Array of interests (text[])
- Optional avatar URL

**Matches Table**
- UUID primary key
- Foreign keys to users (userId, matchedUserId)
- Match score (0-1 range)
- Timestamp for match creation

**Chats Table**
- UUID primary key
- Foreign keys for sender and recipient
- Message text content
- Timestamp for message creation

**Payments Table**
- UUID primary key
- Foreign key to user
- Amount and status fields
- Timestamp for payment creation

## External Dependencies

### Production Dependencies

**UI Framework & Components**
- `react` & `react-dom` - Core React library
- `@radix-ui/*` - Accessible component primitives (20+ component packages)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant management
- `lucide-react` - Icon library

**Data Fetching & State**
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation

**Backend Framework**
- `express` - Web application framework
- `socket.io` - Real-time bidirectional communication
- `wouter` - Lightweight routing library

**Database & ORM**
- `drizzle-orm` - TypeScript ORM
- `drizzle-zod` - Zod schema generation from Drizzle
- `@neondatabase/serverless` - Neon PostgreSQL serverless driver
- `connect-pg-simple` - PostgreSQL session store

**Utilities**
- `date-fns` - Date manipulation library
- `nanoid` - Unique ID generation
- `clsx` & `tailwind-merge` - Conditional CSS class utilities

### Development Dependencies

**Build Tools**
- `vite` - Frontend build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `esbuild` - JavaScript bundler for production server
- `tsx` - TypeScript execution for Node.js

**Type Definitions**
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `@types/express` - Express type definitions

**Replit Integrations**
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development banner

### Third-Party Services (Ready for Integration)

**Database**
- Neon PostgreSQL (serverless) - Configured via DATABASE_URL environment variable
- Connection pooling via @neondatabase/serverless driver

**Potential Future Integrations**
- Stripe for payment processing (checkout endpoint prepared)
- OpenAI or similar for AI-enhanced matching algorithms
- Cloud storage (AWS S3, Cloudflare R2) for avatar uploads
- Email service (SendGrid, Postmark) for notifications