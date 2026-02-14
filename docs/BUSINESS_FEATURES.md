# Kling AI Clone - Business Features Documentation

## Table of Contents
1. [Quick Start Guide](#quick-start-guide)
2. [Architecture Overview](#architecture-overview)
3. [AI Integration](#ai-integration)
4. [Subscription Plans](#subscription-plans)
5. [Business Features](#business-features)
6. [API Documentation](#api-documentation)
7. [Security Features](#security-features)
8. [Platform Integrations](#platform-integrations)

---

## Quick Start Guide

### 1. Environment Setup

Create a `.env` file with the following variables:

```env
# Core
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kling-clone
JWT_SECRET=your-super-secret-key
NODE_ENV=production

# AI Services (Required)
REPLICATE_API_TOKEN=your-replicate-token
OPENAI_API_KEY=your-openai-key

# Redis (Required for queues)
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe (Required for payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloud Storage (Choose one)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
CLOUDINARY_CLOUD_NAME=...
```

### 2. Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### 3. Database Seeding

```bash
# Seed ad templates
curl -X POST http://localhost:3000/api/templates/seed
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  (Angular 17 + TypeScript + RxJS + WebSocket)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                             │
│  • Express.js + Helmet (security headers)                  │
│  • Rate limiting (100 req/15min)                           │
│  • CORS configuration                                      │
│  • JWT/Session auth                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   REST   │ │ WebSocket│ │  Stripe  │
│  Routes  │ │  Server  │ │ Webhooks │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     └────────────┼────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC                           │
│  • Auth Service      • AI Service (Replicate)              │
│  • Queue Service     • Email Service                       │
│  • Payment Service   • Analytics Service                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        ▼            ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ MongoDB  │ │  Redis   │ │   S3/    │ │ Stripe   │
│          │ │  Bull    │ │Cloudinary│ │  API     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

## AI Integration

### Replicate API (Stable Video Diffusion)

The platform uses Replicate for video generation with the following models:

1. **Image-to-Video**: `stability-ai/stable-video-diffusion`
2. **Text-to-Image**: `stability-ai/stable-diffusion` (as first step)

### Configuration

```javascript
// services/ai.service.js
const prediction = await replicate.predictions.create({
  version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
  input: {
    image: imageUrl,
    frames_per_second: 6,
    motion_bucket_id: 40, // Varies by camera movement
    cond_aug: 0.02,
    decoding_t: 7,
  },
});
```

### Motion Bucket IDs

| Camera Movement | Motion Bucket |
|----------------|---------------|
| Static | 40 |
| Zoom In | 80 |
| Zoom Out | 60 |
| Pan/Tilt | 90-100 |

---

## Subscription Plans

### Free ($0/month)
- 5 videos/month
- 15 seconds max length
- 720p max resolution
- 1 team seat
- Watermarked exports

### Pro ($29/month)
- 50 videos/month
- 60 seconds max length
- 1080p max resolution
- 3 team seats
- API access
- No watermark

### Business ($99/month)
- 200 videos/month
- 120 seconds max length
- 4K resolution
- 10 team seats
- A/B testing
- Advanced analytics
- White-label exports

### Enterprise (Custom)
- Unlimited videos
- 5 minutes max length
- 4K resolution
- Unlimited team seats
- Custom integrations
- Dedicated support
- SLA guarantees

---

## Business Features

### 1. Team Collaboration

```javascript
// Create team
POST /api/teams/create
{
  "name": "Marketing Team",
  "description": "Product marketing division"
}

// Invite member
POST /api/teams/invite
{
  "email": "member@company.com",
  "role": "editor"
}
```

**Roles & Permissions:**
- **Owner**: Full access including billing
- **Admin**: Manage team, create/edit/delete
- **Editor**: Create and edit videos
- **Viewer**: View-only access

### 2. Brand Kit Management

```javascript
// Create brand kit
POST /api/brandkits
{
  "name": "Acme Corp Brand",
  "colors": {
    "primary": { "hex": "#667eea" },
    "secondary": { "hex": "#764ba2" }
  },
  "fonts": {
    "heading": { "family": "Inter", "weights": ["600", "700"] },
    "body": { "family": "Open Sans" }
  },
  "voice": {
    "gender": "female",
    "tone": "professional",
    "accent": "american"
  }
}
```

### 3. Ad Templates

Pre-built templates for:
- **E-commerce**: Product showcases, price promos
- **Social Media**: TikTok, Instagram, YouTube formats
- **Testimonials**: Customer review videos
- **Educational**: How-to and explainer videos

```javascript
// Get templates
GET /api/templates?category=ecommerce&platform=tiktok

// Generate script from template
POST /api/templates/:id/generate-script
{
  "product": "Wireless Headphones",
  "audience": "Tech-savvy millennials",
  "tone": "energetic"
}
```

### 4. Multi-Scene Projects

Create complex video sequences:

```javascript
POST /api/projects
{
  "name": "Product Launch Video",
  "type": "multi-scene",
  "scenes": [
    {
      "name": "Hook",
      "duration": 3,
      "prompt": "Dramatic product reveal with spotlight"
    },
    {
      "name": "Features",
      "duration": 10,
      "prompt": "Product features demonstrated in use"
    },
    {
      "name": "CTA",
      "duration": 5,
      "prompt": "Call to action with discount text"
    }
  ]
}
```

### 5. A/B Testing

```javascript
// Create variant
POST /api/projects/:id/variants
{
  "name": "Variant B - Urgent CTA",
  "scenes": [...]
}

// Get results
GET /api/analytics/ab-test/:projectId
{
  "variants": [
    { "name": "Control", "ctr": 0.035, "conversions": 120 },
    { "name": "Variant B", "ctr": 0.052, "conversions": 180 }
  ],
  "recommendation": "Variant B"
}
```

---

## API Documentation

### Authentication

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

**API Key (Pro+):**
```bash
Header: X-API-Key: kling_abc123...
```

### Video Generation

**Create Video:**
```bash
POST /api/videos/generate
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "prompt": "A beautiful sunset over mountains",
  "settings": {
    "duration": 10,
    "resolution": "1080p",
    "aspectRatio": "16:9",
    "style": "cinematic",
    "cameraMovement": "zoom-in"
  },
  "referenceImage": <file> // optional
}
```

**WebSocket Progress Updates:**
```javascript
const socket = io('ws://localhost:3000');
socket.emit('subscribe-video', videoJobId);
socket.on('progress', (data) => {
  console.log(data.progress); // 0-100
  console.log(data.status);   // pending/processing/completed
});
```

### Credit System

| Duration | Base Cost | Resolution Multiplier |
|----------|-----------|----------------------|
| 5s | 10 | 480p: 1x |
| 10s | 20 | 720p: 1.5x |
| 15s | 30 | 1080p: 2x |
| 30s | 50 | 4k: 4x |
| 60s | 80 | |

**Example:** 10-second 1080p video = 20 × 2 = 40 credits

---

## Security Features

### 1. Authentication
- JWT tokens with httpOnly cookies
- Token expiration: 7 days
- Refresh token rotation
- Account lockout after 5 failed attempts

### 2. Email Verification
- Required for full platform access
- 24-hour expiration
- Resend capability

### 3. Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 10 attempts per hour
- API keys: Varies by plan

### 4. Data Protection
- Passwords hashed with bcrypt (12 rounds)
- API keys encrypted at rest
- HTTPS enforced in production
- CORS restricted to allowed origins

### 5. Privacy
- GDPR compliant data export
- Account deletion capability
- Data retention policies

---

## Platform Integrations

### Social Media Publishing (Roadmap)

**TikTok:**
- Direct upload via TikTok API
- Caption and hashtag optimization
- Schedule posting

**Meta (Facebook/Instagram):**
- Business Manager integration
- Ad account connection
- Carousel and Stories support

**YouTube:**
- YouTube Data API v3
- Title/description optimization
- Thumbnail generation

**Shopify:**
- Product catalog sync
- Auto-generate videos from products
- One-click publish to store

### API for Developers

**Generate Video:**
```bash
curl -X POST https://api.klingclone.com/api/videos/generate \
  -H "X-API-Key: kling_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Product showcase",
    "settings": { "duration": 15, "resolution": "1080p" }
  }'
```

**Webhook Notifications:**
```json
{
  "event": "video.completed",
  "data": {
    "videoId": "...",
    "status": "completed",
    "url": "https://...",
    "creditsUsed": 30
  }
}
```

---

## Target Markets

### Small Businesses (Primary)
**Use Cases:**
- Product ads for social media
- Quick promotional videos
- Basic brand consistency

**Features:**
- Template-heavy workflow
- One-click generation
- Affordable pricing ($29/month)

### Marketing Agencies
**Use Cases:**
- Client campaign management
- White-label exports
- Team collaboration

**Features:**
- Multi-client organization
- Brand kit sharing
- A/B testing tools

### Enterprise
**Use Cases:**
- High-volume production
- Custom integrations
- Dedicated infrastructure

**Features:**
- API access
- SLA guarantees
- Custom AI training
- SSO/SAML support

---

## Support & Resources

- **Documentation**: https://docs.klingclone.com
- **API Reference**: https://api.klingclone.com/docs
- **Support Email**: support@klingclone.com
- **Status Page**: https://status.klingclone.com

---

## License

MIT License - See LICENSE file for details