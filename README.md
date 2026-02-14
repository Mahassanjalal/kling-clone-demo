# Kling AI Clone - Business Edition

A production-ready, full-stack AI-powered video generation platform built with Angular and Node.js/Express. Features real AI integration, subscription billing, team collaboration, and enterprise-grade security.

## 🌟 What's New in Business Edition

### Core AI Features
- ✅ **Real AI Integration**: Replicate API (Stable Video Diffusion)
- ✅ **Background Processing**: Bull queue with Redis for async processing
- ✅ **Real-time Updates**: WebSocket progress tracking
- ✅ **Text-to-Video & Image-to-Video**: Full support for both modes

### Business Features
- ✅ **Subscription Plans**: Free, Pro ($29), Business ($99), Enterprise
- ✅ **Team Collaboration**: Multi-user teams with role-based permissions
- ✅ **Brand Kit Management**: Colors, fonts, logos, voice settings
- ✅ **Ad Templates**: Pre-built templates for e-commerce & social media
- ✅ **Multi-Scene Projects**: Complex video sequences with scene editor
- ✅ **A/B Testing**: Create and test multiple video variants
- ✅ **Script Generator**: AI-powered ad copywriting with OpenAI

### Security & Production
- ✅ **Enhanced Security**: httpOnly cookies, rate limiting, CORS
- ✅ **Email Verification**: Required for account activation
- ✅ **Password Reset**: Secure token-based reset flow
- ✅ **Stripe Integration**: Complete payment & billing system
- ✅ **API Access**: Developer API keys (Pro+ plans)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Replicate API key
- Stripe account (for payments)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/kling-clone.git
cd kling-clone

# Setup Backend
cd backend
cp .env.example .env
# Edit .env with your API keys
npm install
npm run dev

# Setup Frontend (new terminal)
cd frontend
npm install
npm start
```

### Environment Variables

```env
# Required for AI Generation
REPLICATE_API_TOKEN=your_token_here
OPENAI_API_KEY=your_key_here

# Required for Queue System
REDIS_URL=redis://localhost:6379

# Required for Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Required for Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email
SMTP_PASS=your_app_password

# Security
JWT_SECRET=generate_strong_random_string
NODE_ENV=production
```

## 📁 Project Structure

```
kling-clone/
├── backend/
│   ├── middleware/
│   │   ├── auth.js           # JWT + API key auth
│   │   └── upload.js         # File uploads
│   ├── models/
│   │   ├── User.js           # Auth + 2FA + OAuth
│   │   ├── VideoJob.js       # Video generation jobs
│   │   ├── Project.js        # Multi-scene projects
│   │   ├── Team.js           # Team collaboration
│   │   ├── BrandKit.js       # Brand assets
│   │   ├── AdTemplate.js     # Video templates
│   │   └── Subscription.js   # Billing & plans
│   ├── routes/
│   │   ├── auth.routes.js    # Auth + email verification
│   │   ├── video.routes.js   # Video generation
│   │   ├── payment.routes.js # Stripe integration
│   │   ├── team.routes.js    # Team management
│   │   ├── template.routes.js# Ad templates
│   │   ├── brandkit.routes.js# Brand management
│   │   ├── project.routes.js # Project editor
│   │   └── analytics.routes.js# Usage analytics
│   ├── services/
│   │   ├── ai.service.js     # Replicate + OpenAI
│   │   ├── queue.service.js  # Bull + Redis
│   │   └── email.service.js  # SMTP emails
│   ├── uploads/              # Temporary file storage
│   └── server.js             # Express + Socket.io
│
├── frontend/
│   └── src/
│       └── app/
│           ├── components/
│           │   ├── auth/     # Login/Register/Verify
│           │   ├── dashboard/# Stats + overview
│           │   ├── video-generator/ # AI video creation
│           │   ├── video-gallery/   # Video library
│           │   ├── templates/     # Ad templates
│           │   ├── projects/      # Project editor
│           │   ├── team/          # Team management
│           │   ├── brandkits/     # Brand management
│           │   ├── payments/      # Billing + plans
│           │   └── analytics/     # Usage stats
│           ├── services/     # API services
│           ├── guards/       # Route guards
│           └── interceptors/ # HTTP interceptors
│
└── docs/
    └── BUSINESS_FEATURES.md  # Detailed documentation
```

## 🎯 Features by Plan

### Free Plan ($0)
- 5 videos/month (15s max, 720p)
- Basic templates
- 1 team seat
- Watermarked exports
- Community support

### Pro Plan ($29/month)
- 50 videos/month (60s max, 1080p)
- All templates + custom uploads
- 3 team seats
- No watermark
- API access (100 requests/hour)
- Email support

### Business Plan ($99/month)
- 200 videos/month (120s max, 4K)
- A/B testing tools
- 10 team seats
- Advanced analytics
- White-label exports
- Priority support

### Enterprise (Custom)
- Unlimited videos (5min max)
- Unlimited team seats
- Custom AI training
- SLA guarantees
- Dedicated support
- SSO/SAML

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/register           # Register new account
POST   /api/auth/login              # Login
GET    /api/auth/verify-email       # Verify email
POST   /api/auth/resend-verification# Resend verification
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
POST   /api/auth/logout             # Logout
GET    /api/auth/me                 # Get current user
```

### Video Generation
```
POST   /api/videos/generate         # Create video
GET    /api/videos/my-videos        # List videos
GET    /api/videos/:id              # Get video details
GET    /api/videos/:id/status       # Get progress
POST   /api/videos/:id/cancel       # Cancel generation
POST   /api/videos/:id/regenerate   # Regenerate video
DELETE /api/videos/:id              # Delete video
```

### Payments & Subscriptions
```
GET    /api/payments/plans          # List available plans
GET    /api/payments/subscription   # Get current subscription
POST   /api/payments/create-checkout-session  # Subscribe
POST   /api/payments/purchase-credits          # Buy credits
POST   /api/payments/billing-portal            # Manage billing
GET    /api/payments/invoices       # Get invoices
POST   /api/payments/webhook        # Stripe webhooks
```

### Team Management
```
POST   /api/teams/create            # Create team
GET    /api/teams/my-team           # Get team details
POST   /api/teams/invite            # Invite member
POST   /api/teams/accept-invite     # Accept invitation
PUT    /api/teams/members/:id/role  # Update member role
DELETE /api/teams/members/:id       # Remove member
POST   /api/teams/api-key           # Generate API key
```

### Business Features
```
# Templates
GET    /api/templates               # List templates
GET    /api/templates/:id           # Get template
POST   /api/templates/:id/generate-script  # AI script generation

# Brand Kits
GET    /api/brandkits               # List brand kits
POST   /api/brandkits               # Create brand kit
PUT    /api/brandkits/:id           # Update brand kit

# Projects (Multi-scene)
GET    /api/projects                # List projects
POST   /api/projects                # Create project
POST   /api/projects/:id/scenes/:sceneId/generate  # Generate scene
POST   /api/projects/:id/compile    # Compile multi-scene video
POST   /api/projects/:id/variants   # Create A/B test variant

# Analytics
GET    /api/analytics/dashboard     # Usage dashboard
GET    /api/analytics/videos/:id    # Video performance
GET    /api/analytics/ab-test/:id   # A/B test results
```

## 🔐 Security Features

- ✅ **JWT Authentication** with httpOnly cookies
- ✅ **Email Verification** required for full access
- ✅ **Rate Limiting** on all endpoints
- ✅ **Account Lockout** after failed attempts
- ✅ **Password Hashing** with bcrypt (12 rounds)
- ✅ **CORS** restricted to allowed origins
- ✅ **Helmet** security headers
- ✅ **Input Validation** with express-validator

## 📊 Credit System

| Duration | Base Cost | 480p | 720p | 1080p | 4K |
|----------|-----------|------|------|-------|-----|
| 5s       | 10        | 10   | 15   | 20    | 40  |
| 10s      | 20        | 20   | 30   | 40    | 80  |
| 15s      | 30        | 30   | 45   | 60    | 120 |
| 30s      | 50        | 50   | 75   | 100   | 200 |
| 60s      | 80        | 80   | 120  | 160   | 320 |

## 🎨 Customization

### Creating Custom Templates

```javascript
POST /api/templates
{
  "name": "My Custom Template",
  "category": "ecommerce",
  "platform": "instagram",
  "format": "story",
  "aspectRatio": "9:16",
  "structure": {
    "scenes": [...]
  }
}
```

### Brand Kit Configuration

```javascript
POST /api/brandkits
{
  "name": "Acme Brand",
  "colors": {
    "primary": { "hex": "#667eea" },
    "secondary": { "hex": "#764ba2" }
  },
  "fonts": {
    "heading": { "family": "Inter" },
    "body": { "family": "Open Sans" }
  },
  "voice": {
    "gender": "female",
    "tone": "professional"
  }
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run e2e
```

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Services:
# - App: http://localhost:3000
# - MongoDB: localhost:27017
# - Redis: localhost:6379
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB
- [ ] Set up Redis cluster
- [ ] Configure S3/Cloudinary for storage
- [ ] Set up Stripe live keys
- [ ] Configure production SMTP
- [ ] Enable HTTPS
- [ ] Set up monitoring (Sentry/DataDog)
- [ ] Configure backups

## 📈 Roadmap

### Q1 2024
- [ ] TikTok direct publishing
- [ ] YouTube integration
- [ ] Shopify product sync

### Q2 2024
- [ ] Voice cloning integration
- [ ] Custom AI model training
- [ ] Mobile apps (iOS/Android)

### Q3 2024
- [ ] Live streaming support
- [ ] Real-time collaboration
- [ ] White-label reseller program

## 📄 Documentation

- [Business Features Guide](./docs/BUSINESS_FEATURES.md) - Detailed feature documentation
- [API Reference](./docs/API.md) - Complete API documentation
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📜 License

MIT License - see [LICENSE](LICENSE) file

## 🆘 Support

- Documentation: https://docs.klingclone.com
- Email: support@klingclone.com
- Discord: https://discord.gg/klingclone
- Status: https://status.klingclone.com

---

Built with ❤️ by the Kling Clone Team