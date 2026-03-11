# Gharpayy CRM MVP — Deliverables Document

## 1. System Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  React SPA   │  │  Public Form │  │  Tally Hook  │  │ Calendly/Forms  │  │
│  │  (CRM UI)    │  │  (Lead gen)  │  │  (Webhook)   │  │  (Webhooks)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
└─────────┼────────────────┼────────────────┼─────────────────┼───────────┘
          │                │                │                 │
          └────────────────┴────────────────┴─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Express.js API  │  ← Auth, Validation, Rate Limiting
                    │   (REST Layer)    │
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼─────┐     ┌──────▼──────┐    ┌──────▼──────┐
    │ MongoDB   │     │  Services   │    │  Scheduler  │
    │ (Primary) │     │ (Assignment│    │  (Cron)     │
    │           │     │  Activity)  │    │  Reminders  │
    └───────────┘     └─────────────┘    └─────────────┘
```

### Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Tailwind CSS | SPA CRM interface |
| Backend | Node.js + Express | REST API layer |
| Database | MongoDB (Mongoose) | Document store for leads, agents, visits |
| Scheduler | node-cron | Hourly reminder jobs |
| Real-time | WebSockets (ready) | Future: live updates |

### API Design Principles
- **RESTful** routes under `/api/{resource}`
- **Population** of related documents (agent, lead, visit)
- **Validation** at controller level with early returns
- **Activity logging** on every state change (immutable audit trail)

---

## 2. Database Design

### Collections Overview

```javascript
// Agents (Users)
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  active: Boolean (default: true),
  activeLeads: Number,
  createdAt: Date,
  updatedAt: Date
}

// Leads (Core Entity)
{
  _id: ObjectId,
  name: String (required),
  phone: String (required),
  source: String (required),        // WhatsApp, Website, Tally, Calendly...
  status: Enum[8 stages],           // New Lead → Contacted → ... → Booked/Lost
  assignedAgent: ObjectId → Agent,
  integration: String,              // webhook source (tally/calendly/google_forms)
  rawPayload: Mixed,               // original webhook payload (audit/debug)
  createdAt: Date,
  updatedAt: Date
}

// LeadActivities (Audit Trail)
{
  _id: ObjectId,
  leadId: ObjectId → Lead,
  agentId: ObjectId → Agent,
  activityType: Enum,               // Lead Created, Agent Assigned, Status Updated...
  description: String,
  createdAt: Date
}

// Visits
{
  _id: ObjectId,
  leadId: ObjectId → Lead,
  agentId: ObjectId → Agent,
  propertyName: String,
  visitDate: String (YYYY-MM-DD),
  visitTime: String (HH:MM),
  outcome: Enum[Scheduled, Completed, No-show, Cancelled],
  createdAt: Date
}

// FollowUps (Reminders)
{
  _id: ObjectId,
  leadId: ObjectId → Lead,
  agentId: ObjectId → Agent,
  reminderDate: Date,
  status: Enum[Pending, Completed],
  createdAt: Date
}

// AssignmentState (Round-Robin Cursor)
{
  key: 'leadRoundRobin',
  lastIndex: Number                // last assigned agent index
}

// Properties, Rooms, Beds (Inventory)
Property: { name, type, address, city, status, ownerId, amenities[], geo{}, rules, description }
Room: { propertyId, name, type, floor, amenities[] }
Bed: { propertyId, roomId, bedNumber, status, rent }

// Bookings
{
  leadId, propertyId, roomId, bedId,
  checkIn, checkOut, amount, status, paymentStatus
}

// Messages (Threads)
Thread: { leadId, agentIds[], lastMessage, unreadCount }
Message: { threadId, senderId, content, createdAt }
```

### Key Indexes
- `Leads.phone` — deduplication checks
- `Leads.assignedAgent + status` — agent workload queries
- `LeadActivities.leadId` — timeline lookups
- `Visits.leadId + outcome` — dashboard aggregations
- `FollowUps.leadId + status` — pending reminders

---

## 3. Scaling for Production

### Short-Term (1-3 months)
1. **Add Redis** for session store and rate limiting
2. **File uploads** (S3/Cloudinary) for visit photos, ID proofs
3. **SMS gateway** integration (Twilio/MessageBird) for visit reminders
4. **WhatsApp Business API** webhook for lead capture

### Medium-Term (3-6 months)
1. **Microservices split**:
   - `lead-service` (capture + assignment)
   - `visit-service` (scheduling + reminders)
   - `notification-service` (SMS/email/WhatsApp)
   - `analytics-service` (aggregations + reports)
2. **Read replicas** for MongoDB analytics queries
3. **Queue system** (Bull/BullMQ) for:
   - Webhook processing (idempotent + retry)
   - Reminder batching
   - Report generation

### Long-Term (6+ months)
1. **Multi-tenancy** — separate databases per city/franchise
2. **ML pipeline** — lead scoring, best-time-to-call prediction
3. **Mobile apps** — React Native agent app with offline sync
4. **Data warehouse** — BigQuery/ClickHouse for historical analytics

### Reliability Patterns
- **Idempotency**: Webhook endpoints use `rawPayload` hash to detect duplicates
- **Retry logic**: Failed webhook calls retry with exponential backoff
- **Circuit breaker**: External SMS/WhatsApp APIs fail gracefully
- **Health checks**: `/health` endpoint for load balancer monitoring

---

## 4. Tools & Technical Expectations

### What You Need to Build/Run This

| Requirement | Tool/Service | Alternative |
|-------------|--------------|-------------|
| Runtime | Node.js 18+ | Deno (future) |
| Package Manager | npm | yarn, pnpm |
| Database | MongoDB 6+ | MongoDB Atlas (cloud) |
| Process Manager | PM2 | systemd, Docker |
| Reverse Proxy | Nginx | Caddy, Traefik |
| Cloud Hosting | AWS EC2 / Render / Railway | DigitalOcean, GCP |
| Frontend Build | Vite | Create React App |
| CSS Framework | Tailwind CSS | Bootstrap, Chakra |

### Environment Variables (`.env`)
```bash
# Database
MONGO_URI=mongodb://localhost:27017/gharpayy-crm

# Security (optional for MVP)
WEBHOOK_SHARED_SECRET=your_secret_here
JWT_SECRET=your_jwt_secret

# Client
CLIENT_ORIGIN=http://localhost:5173

# Server
PORT=5000
```

### Webhook Integration Setup Guide

#### Tally
1. Tally form → Settings → Webhooks
2. URL: `https://your-api.com/api/public/webhooks/tally`
3. Header: `x-gharpayy-webhook-secret: your_secret`

#### Calendly (via Zapier or direct)
1. Calendly → Integrations → Webhooks
2. Event: `invitee.created`
3. Target: `https://your-api.com/api/public/webhooks/calendly`

#### Google Forms
1. Create Apps Script in Form → Extensions → Apps Script
2. Code:
```javascript
function onSubmit(e) {
  const itemResponses = e.response.getItemResponses();
  const payload = {};
  itemResponses.forEach(r => payload[r.getItem().getTitle()] = r.getResponse());
  
  UrlFetchApp.fetch('https://your-api.com/api/public/webhooks/google-forms', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: { 'x-gharpayy-webhook-secret': 'your_secret' }
  });
}
```
3. Trigger: On form submit

---

## 5. MVP Feature Checklist (All Implemented)

| Feature | Status | Evidence |
|---------|--------|----------|
| Lead capture (form) | ✅ | `POST /api/public/lead` |
| Lead capture (webhooks) | ✅ | `POST /api/public/webhooks/*` |
| Auto assignment (round-robin) | ✅ | `services/assignmentService.js` |
| Pipeline stages (8) | ✅ | `LEAD_STATUSES` enum + drag-drop UI |
| Visit scheduling | ✅ | `Visit` model + CRUD endpoints |
| Visit outcome tracking | ✅ | `updateVisitOutcome` controller |
| Follow-up reminders | ✅ | `reminderService.js` (cron) |
| Dashboard KPIs | ✅ | `dashboardController.js` |
| Analytics charts | ✅ | `analyticsController.js` + Recharts |
| Agent leaderboard | ✅ | `AgentLeaderboard.jsx` |
| Inventory (PG mgmt) | ✅ | Properties/Rooms/Beds CRUD |
| Bookings mgmt | ✅ | `Booking` model + UI |
| Messaging (agent-lead) | ✅ | Threads + Messages |

---

## 6. Deployment Checklist

```bash
# 1. Install dependencies
npm install

# 2. Set environment
cp .env.example .env
# Edit .env with your values

# 3. Start MongoDB
mongod --dbpath /data/db

# 4. Start backend
npm run dev

# 5. Start frontend (new terminal)
cd frontend && npm run dev

# Production build
cd frontend && npm run build
# Serve dist/ via Nginx or copy to backend/public
```

---

**Author**: Gharpayy CRM MVP Candidate  
**Date**: March 2026  
**Repo**: `d:\Internshala\Gharp` (local) / Push to GitHub for submission
