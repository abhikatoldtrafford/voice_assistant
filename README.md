# RIATA - AI-Powered Educational Platform

## 🌟 Overview

RIATA is a revolutionary AI-powered educational platform that transforms online learning through personalized AI coaching, real-time voice interactions, and adaptive course management. Built with cutting-edge technologies, it serves students, instructors, and administrators with a seamless, intelligent learning ecosystem.

## 🚀 Key Features

- **Real-time AI Voice Coach**: Interactive voice-based learning with WebRTC integration
- **Personalized Learning**: Adaptive AI that remembers everything and personalizes education at scale
- **Course Management**: Complete instructor tools for course creation and management
- **Smart Image Generation**: AI-powered image generation and retrieval for educational content
- **Deep Research Pipeline**: AI-driven course content generation from research
- **Multi-role Support**: Student, Instructor, and Admin portals
- **Memory System (RAG)**: Vector-based memory storage for personalized interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, MongoDB, NextAuth
- **AI Integration**: OpenAI API (GPT-4, DALL-E 3, Whisper), Realtime API
- **Storage**: AWS S3
- **Authentication**: Auth0, NextAuth
- **Payments**: Stripe
- **Real-time**: WebRTC, WebSockets

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- OpenAI API key
- AWS S3 bucket
- Auth0 account
- Stripe account (for payments)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/abhikatoldtrafford/voice_assistant.git
cd voice_assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Auth0
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Application
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
RIATA/
├── app/                    # Next.js App Router
├── components/             # Reusable React components
├── lib/                    # Core libraries and utilities
├── models/                 # MongoDB schemas
├── actions/                # Server actions
├── services/               # Service layer
├── hooks/                  # Custom React hooks
├── contexts/               # React contexts
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 🎯 Core Features

### For Students
- AI-powered voice coach for personalized learning
- Real-time interaction with course content
- Adaptive quizzes and notes
- Progress tracking and achievements
- Memory system that remembers your learning journey

### For Instructors
- Course creation and management tools
- AI-assisted content generation
- Student analytics and tracking
- Image generation for course materials
- Deep research pipeline for course creation

### For Administrators
- Course review and approval system
- User management
- Platform settings and configuration
- Analytics dashboard

## 🔒 Security

- Authentication via Auth0/NextAuth
- Role-based access control (Student, Instructor, Admin)
- Secure API endpoints with middleware protection
- Environment variable management for sensitive data

## 📚 Documentation

For detailed documentation about the codebase architecture and implementation details, please refer to the [CLAUDE.md](./CLAUDE.md) file.

## 🤝 Contributing

Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For support, please contact the development team.

---

Built with ❤️ by the RIATA Team