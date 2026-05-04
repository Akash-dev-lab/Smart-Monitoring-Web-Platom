# Drishyam Monitor OS - Backend

> **Smart Website Monitoring System with AI-Powered Incident Analysis**

A production-ready Node.js backend that monitors website uptime, detects incidents, analyzes failures using AI (Google Gemini), and sends intelligent email alerts.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Database Models](#database-models)
- [Background Jobs](#background-jobs)
- [AI Integration](#ai-integration)
- [Deployment](#deployment)

---

## 🎯 Overview

This backend powers a **real-time website monitoring platform** that:
- ✅ Monitors multiple websites at custom intervals
- 📊 Tracks response times, status codes, and uptime
- 🚨 Detects incidents after 3 consecutive failures
- 🧠 Uses **Google Gemini AI** to analyze failures and suggest fixes
- 📧 Sends smart email alerts with AI insights
- 🔐 Secure authentication with HTTP-only cookies
- ⚡ Background job processing with BullMQ + Redis
- 📈 Real-time analytics and incident tracking

---

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | Latest |
| **Express.js** | Web framework | 5.2.1 |
| **MongoDB** | Database (Mongoose ODM) | 9.6.1 |
| **Redis** | Queue & caching (IORedis) | 5.10.1 |
| **BullMQ** | Background job processing | 5.76.4 |
| **JWT** | Authentication tokens | 9.0.3 |
| **bcryptjs** | Password hashing | 3.0.3 |
| **Axios** | HTTP client for monitoring | 1.15.2 |
| **Nodemailer** | Email alerts | 8.0.7 |
| **Google Gemini AI** | Incident analysis | API v1beta |
| **cookie-parser** | Cookie handling | 1.4.7 |
| **CORS** | Cross-origin requests | 2.8.6 |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Frontend)                       │
│                   React + Redux + Axios                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS + Cookies
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth API   │  │ Monitor API  │  │Dashboard API │      │
│  │  (JWT+Cookie)│  │   (CRUD)     │  │  (Analytics) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │    Redis     │  │  Gemini AI   │
│  (Database)  │  │   (Queue)    │  │  (Analysis)  │
└──────────────┘  └──────────────┘  └──────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │      BACKGROUND WORKERS         │
        │  ┌──────────────────────────┐  │
        │  │  Monitor Scheduler       │  │ ← Every 5s
        │  │  (Checks active monitors)│  │
        │  └────────────┬─────────────┘  │
        │               ▼                 │
        │  ┌──────────────────────────┐  │
        │  │  BullMQ Worker           │  │
        │  │  (Executes HTTP checks)  │  │
        │  └────────────┬─────────────┘  │
        │               ▼                 │
        │  ┌──────────────────────────┐  │
        │  │  Incident Processor      │  │
        │  │  (Tracks failures)       │  │
        │  └────────────┬─────────────┘  │
        │               ▼                 │
        │  ┌──────────────────────────┐  │
        │  │  AI Processor            │  │
        │  │  (Analyzes with Gemini)  │  │
        │  └────────────┬─────────────┘  │
        │               ▼                 │
        │  ┌──────────────────────────┐  │
        │  │  Alert Service           │  │
        │  │  (Sends email via Gmail) │  │
        │  └──────────────────────────┘  │
        └────────────────────────────────┘
```

---

## ✨ Features

### 🔐 Authentication
- **JWT-based authentication** with access & refresh tokens
- **HTTP-only cookies** for secure token storage
- **Password hashing** with bcrypt (10 rounds)
- **Role-based access** (user/admin)
- **Auto-login after signup**
- **Token refresh** mechanism

### 📊 Monitoring
- **Multi-URL monitoring** with custom intervals
- **HTTP method support** (GET, POST, PUT, DELETE)
- **Response time tracking** (latency in ms)
- **Status code logging** (200, 404, 500, etc.)
- **Success/failure tracking**
- **Active/paused monitors**
- **User-specific monitors**

### 🚨 Incident Management
- **Automatic incident creation** after 3 consecutive failures
- **Incident resolution** on successful check
- **Failure count tracking**
- **Open/resolved status**
- **Incident timeline** per monitor

### 🧠 AI-Powered Analysis
- **Google Gemini 2.5 Flash** integration
- **Automatic failure analysis** on incident creation
- **Root cause identification**
- **Fix suggestions** (actionable recommendations)
- **Status classification** (CRITICAL, WARNING, etc.)
- **Context-aware prompts** (monitor + logs + incident)

### 📧 Smart Alerts
- **Email notifications** via Gmail (Nodemailer)
- **AI insights included** in alert emails
- **Formatted suggestions** (numbered list)
- **Alert status tracking** (SENT/FAILED)
- **Alert history** in database

### 📈 Analytics
- **Real-time uptime percentage**
- **Average latency** calculation
- **Success/failure counts**
- **Time-series data** (5-minute buckets)
- **Latest status** (UP/DOWN)
- **Trend analysis** (last 24 hours)

### ⚡ Background Processing
- **BullMQ job queue** with Redis
- **Concurrent workers** (5 parallel jobs)
- **Automatic retries** (3 attempts with exponential backoff)
- **Job cleanup** (completed jobs removed)
- **Scheduler** (checks every 5 seconds)

---

## 📁 Project Structure

```
backend/
├── server.js                      # Entry point
├── package.json                   # Dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
│
└── src/
    ├── app.js                    # Express app configuration
    │
    ├── config/                   # Configuration files
    │   ├── db.js                # MongoDB connection
    │   └── redis.js             # Redis connection
    │
    ├── modules/                  # Feature modules
    │   │
    │   ├── auth/                # Authentication
    │   │   ├── auth.model.js   # User schema
    │   │   ├── auth.service.js # Auth business logic
    │   │   ├── auth.controller.js # Auth endpoints
    │   │   ├── auth.routes.js  # Auth routes
    │   │   └── auth.middleware.js # JWT verification
    │   │
    │   ├── monitor/             # Website monitoring
    │   │   ├── monitor.model.js # Monitor schema
    │   │   ├── monitor.service.js # Monitor CRUD
    │   │   ├── monitor.controller.js # Monitor endpoints
    │   │   ├── monitor.routes.js # Monitor routes
    │   │   ├── monitor.scheduler.js # Scheduler (every 5s)
    │   │   └── monitor.queue.js # BullMQ queue
    │   │
    │   ├── logs/                # Check logs
    │   │   ├── log.model.js    # Log schema (TTL: 7 days)
    │   │   ├── log.service.js  # Analytics aggregation
    │   │   ├── log.controller.js # Log endpoints
    │   │   └── log.routes.js   # Log routes
    │   │
    │   ├── incident/            # Incident management
    │   │   ├── incident.model.js # Incident schema
    │   │   ├── incident.service.js # Incident CRUD
    │   │   ├── incident.processor.js # Failure tracking
    │   │   └── incident.processor.ai.js # AI trigger
    │   │
    │   ├── ai/                  # AI integration
    │   │   ├── ai.model.js     # AI insight schema
    │   │   ├── ai.service.js   # Gemini API call
    │   │   ├── ai.promptBuilder.js # Prompt generation
    │   │   ├── ai.formatter.js # Response parsing
    │   │   ├── ai.controller.js # AI endpoints
    │   │   └── ai.routes.js    # AI routes
    │   │
    │   ├── alert/               # Alert system
    │   │   ├── alert.model.js  # Alert schema
    │   │   ├── alert.service.js # Alert logic
    │   │   └── email.service.js # Nodemailer config
    │   │
    │   ├── dashboard/           # Dashboard APIs
    │   │   ├── dashboard.controller.js # Summary, incidents, analytics
    │   │   └── dashboard.routes.js # Dashboard routes
    │   │
    │   └── admin/               # Admin features
    │       ├── admin.controller.js # Admin endpoints
    │       ├── admin.routes.js # Admin routes
    │       ├── admin.service.js # Admin logic
    │       └── admin.stats.js  # System stats
    │
    ├── workers/                 # Background workers
    │   └── monitor.worker.js   # BullMQ worker (HTTP checks)
    │
    └── utils/                   # Utilities
        ├── constants.js        # App constants
        ├── httpClient.js       # Axios wrapper
        ├── logger.js           # Logging utility
        └── time.js             # Time helpers
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)
- **Redis** (local or Upstash)
- **Gmail account** (for email alerts)
- **Google Gemini API key** (free tier available)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see below)

5. **Start the server**
```bash
npm start
```

Server will run on `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/drishyam?retryWrites=true&w=majority

# JWT Secrets (generate with: openssl rand -hex 32)
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here

# Redis (Upstash or local)
REDIS_URL=rediss://default:password@host:6379

# Email Alerts (Gmail)
ALERT_EMAIL=your-email@gmail.com
ALERT_PASS=your-app-password  # Gmail App Password (not regular password)

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
# Production: FRONTEND_URL=https://your-frontend.vercel.app
```

### 📧 Gmail Setup (for Alerts)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Generate an **App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
   - Use this as `ALERT_PASS` in `.env`

### 🤖 Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and use as `GEMINI_API_KEY`

---

## 📡 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| POST | `/auth/refresh` | Refresh access token | ✅ (cookie) |

**Register/Login Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```
*Cookies set: `accessToken` (1h), `refreshToken` (7d)*

---

### Monitors (`/monitors`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/monitors` | Get all user monitors | ✅ |
| POST | `/monitors` | Create new monitor | ✅ |
| PUT | `/monitors/:id` | Update monitor | ✅ |
| DELETE | `/monitors/:id` | Delete monitor | ✅ |

**Create Monitor Request:**
```json
{
  "url": "https://example.com",
  "method": "GET",
  "interval": 60000,  // ms (60 seconds)
  "active": true
}
```

**Monitor Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "url": "https://example.com",
    "method": "GET",
    "interval": 60000,
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Logs (`/logs`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/logs/analytics/:monitorId` | Get monitor analytics | ✅ |

**Analytics Response:**
```json
{
  "uptime": "98.50",
  "avgLatency": 245,
  "totalChecks": 1440,
  "success": 1418,
  "failures": 22,
  "status": "UP",
  "trend": [
    { "time": "10:00", "latency": 230 },
    { "time": "10:05", "latency": 245 },
    { "time": "10:10", "latency": 260 }
  ]
}
```

---

### Dashboard (`/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/summary` | Get dashboard summary | ✅ |
| GET | `/dashboard/monitors` | Get all monitors | ✅ |
| GET | `/dashboard/incidents/:monitorId` | Get incident timeline | ✅ |
| GET | `/dashboard/ai/:monitorId` | Get AI insights | ✅ |
| GET | `/dashboard/analytics/:monitorId` | Get monitor analytics | ✅ |

**Summary Response:**
```json
{
  "totalMonitors": 5,
  "activeIncidents": 2,
  "uptime": "97.80"
}
```

**Incidents Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "monitorId": "507f191e810c19729de860ea",
    "status": "OPEN",
    "message": "Monitor failed 3 times",
    "failCount": 3,
    "startedAt": "2024-01-15T10:30:00.000Z",
    "resolvedAt": null,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**AI Insights Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "monitorId": "507f191e810c19729de860ea",
    "incidentId": "507f191e810c19729de860eb",
    "status": "CRITICAL",
    "reason": "Server is returning 503 Service Unavailable errors consistently",
    "suggestion": [
      "Check if the server is running and accessible",
      "Verify database connections are working",
      "Review server logs for error messages"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### AI (`/ai`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/ai/insights/:monitorId` | Get AI insights for monitor | ✅ |

---

### Admin (`/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/stats` | Get system statistics | ✅ (admin) |
| GET | `/admin/monitors` | Get all monitors (all users) | ✅ (admin) |

---

## ⚙️ How It Works

### 1. **Monitor Creation**
```
User → POST /monitors → MongoDB → Scheduler picks it up
```

### 2. **Monitoring Flow**
```
Scheduler (every 5s)
  ↓
Check active monitors
  ↓
Add jobs to BullMQ queue
  ↓
Worker executes HTTP check
  ↓
Save log to MongoDB
  ↓
Check success/failure
  ↓
Update incident processor
```

### 3. **Incident Detection**
```
3 consecutive failures
  ↓
Create incident in MongoDB
  ↓
Trigger AI processor
  ↓
Call Gemini API with context
  ↓
Parse AI response
  ↓
Save AI insight to MongoDB
  ↓
Trigger alert service
  ↓
Send email with AI insights
  ↓
Save alert record
```

### 4. **Incident Resolution**
```
Successful check after failures
  ↓
Mark incident as RESOLVED
  ↓
Reset failure counter
  ↓
(Optional) Send recovery email
```

---

## 🗄 Database Models

### User
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: "user" | "admin",
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Monitor
```javascript
{
  userId: ObjectId (ref: User),
  url: String,
  method: String (default: "GET"),
  interval: Number (default: 60000 ms),
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```
*Index: `{ active: 1 }`*

### Log
```javascript
{
  monitorId: ObjectId (ref: Monitor),
  status: Number (HTTP status code),
  responseTime: Number (ms),
  success: Boolean,
  createdAt: Date
}
```
*Indexes:*
- `{ monitorId: 1, createdAt: -1 }` (compound)
- `{ createdAt: 1 }` (TTL: 7 days auto-delete)

### Incident
```javascript
{
  monitorId: ObjectId (ref: Monitor),
  status: "OPEN" | "RESOLVED",
  message: String,
  failCount: Number,
  startedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### AIInsight
```javascript
{
  monitorId: ObjectId (ref: Monitor),
  incidentId: ObjectId (ref: Incident),
  status: String (e.g., "CRITICAL", "WARNING"),
  reason: String (AI analysis),
  suggestion: [String] (array of recommendations),
  createdAt: Date,
  updatedAt: Date
}
```

### Alert
```javascript
{
  monitorId: ObjectId (ref: Monitor),
  incidentId: ObjectId (ref: Incident),
  type: "EMAIL" | "WEBHOOK",
  status: "SENT" | "FAILED",
  message: String,
  ai: {
    status: String,
    reason: String,
    suggestion: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Background Jobs

### Monitor Scheduler
**File:** `src/modules/monitor/monitor.scheduler.js`

**Runs:** Every 5 seconds

**Logic:**
1. Fetch all active monitors from MongoDB
2. Check if interval has elapsed since last run
3. Add job to BullMQ queue
4. Update last run timestamp

**Configuration:**
```javascript
setInterval(async () => {
  const monitors = await getActiveMonitors();
  for (const monitor of monitors) {
    if (now - lastRun >= monitor.interval) {
      await monitorQueue.add('check-url', {
        monitorId: monitor._id,
        url: monitor.url,
        method: monitor.method
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      });
    }
  }
}, 5000);
```

### BullMQ Worker
**File:** `src/workers/monitor.worker.js`

**Concurrency:** 5 parallel jobs

**Logic:**
1. Receive job from queue
2. Execute HTTP request with 5s timeout
3. Measure response time
4. Save log to MongoDB
5. Call incident processor

**Retry Strategy:**
- 3 attempts
- Exponential backoff (2s, 4s, 8s)
- Failed jobs kept in Redis for debugging

---

## 🧠 AI Integration

### Gemini API Configuration
**Model:** `gemini-2.5-flash`
**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

### Prompt Structure
```javascript
You are an uptime monitoring AI.

Analyze the following data:

URL: https://example.com
Method: GET

Recent Logs:
Status: 503, Latency: 0ms, Success: false
Status: 503, Latency: 0ms, Success: false
Status: 503, Latency: 0ms, Success: false

Incident:
Monitor failed 3 times

Tasks:
1. Identify if system is stable or unstable
2. Possible root cause
3. Suggest fixes

Respond in JSON format:
{
  "status": "...",
  "reason": "...",
  "suggestion": "..."
}
```

### Response Parsing
**File:** `src/modules/ai/ai.formatter.js`

**Logic:**
1. Extract JSON from AI response (handles markdown code blocks)
2. Normalize `suggestion` field (string → array)
3. Provide fallback values if parsing fails

**Example Output:**
```json
{
  "status": "CRITICAL",
  "reason": "Server is consistently returning 503 errors",
  "suggestion": [
    "Check if the server is running",
    "Verify database connections",
    "Review server logs"
  ]
}
```

---

## 📧 Email Alert Format

**Subject:** `🚨 Website Down (CRITICAL)`

**Body:**
```
🚨 WEBSITE ALERT

🔗 Monitor ID: 507f1f77bcf86cd799439011
❌ Failures: 3

🧠 AI ANALYSIS
Status: CRITICAL

Reason:
Server is consistently returning 503 Service Unavailable errors

Suggestions:
1. Check if the server is running and accessible
2. Verify database connections are working
3. Review server logs for error messages
```

---

## 🚀 Deployment

### Render (Backend Hosting)

1. **Create new Web Service** on [Render](https://render.com)
2. **Connect GitHub repository**
3. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. **Add Environment Variables** (from `.env`)
5. **Deploy**

**Production URL:** `https://your-app.onrender.com`

### MongoDB Atlas (Database)

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow all)
4. Get connection string
5. Add to `MONGO_URI` in Render environment variables

### Upstash Redis (Queue)

1. Create database on [Upstash](https://upstash.com)
2. Copy Redis URL
3. Add to `REDIS_URL` in Render environment variables

### Environment Variables (Production)

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
REDIS_URL=rediss://...
ALERT_EMAIL=...
ALERT_PASS=...
GEMINI_API_KEY=...
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🔒 Security Features

- ✅ **HTTP-only cookies** (prevents XSS attacks)
- ✅ **Secure cookies** (HTTPS only in production)
- ✅ **SameSite=none** (cross-origin support)
- ✅ **Password hashing** (bcrypt with 10 rounds)
- ✅ **JWT expiration** (1h access, 7d refresh)
- ✅ **CORS configuration** (whitelist origins)
- ✅ **Environment variables** (no hardcoded secrets)
- ✅ **Input validation** (email, password length)
- ✅ **User-specific data** (monitors tied to userId)

---

## 📊 Performance Optimizations

- ✅ **MongoDB indexes** (fast queries)
- ✅ **TTL indexes** (auto-delete old logs after 7 days)
- ✅ **Aggregation pipelines** (efficient analytics)
- ✅ **Redis caching** (job queue)
- ✅ **Concurrent workers** (5 parallel jobs)
- ✅ **Connection pooling** (MongoDB, Redis)
- ✅ **DNS optimization** (Cloudflare, Google DNS)

---

## 🐛 Debugging

### Check Server Status
```bash
curl http://localhost:3000/
```

### View Logs
```bash
npm start
# Watch for:
# ✅ MongoDB Connected
# 🟢 Scheduler started...
# 🟢 BullMQ Worker started...
# 📦 Job queued (BullMQ): https://example.com
```

### Test Monitor
```bash
curl -X POST http://localhost:3000/monitors \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=YOUR_TOKEN" \
  -d '{
    "url": "https://httpstat.us/200",
    "method": "GET",
    "interval": 10000
  }'
```

### Check Redis Connection
```bash
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

---

## 📝 License

ISC

---

## 👨‍💻 Author

**Drishyam Monitor OS Team**

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Incident analysis
- **BullMQ** - Job queue
- **MongoDB** - Database
- **Redis** - Caching & queue
- **Nodemailer** - Email service

---

**Built with ❤️ for reliable website monitoring**
