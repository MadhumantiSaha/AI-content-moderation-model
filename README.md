# AI Content Moderation Model

A full-stack application that provides automated content moderation using AI to detect and filter inappropriate content across images, videos, and text. The system includes a demo social media application (PixelPost) where users can post content that gets automatically moderated by the AI system.

## Overview

This project consists of three main components:
1. Content Moderation Dashboard (Frontend)
2. Moderation Backend Service
3. Demo Social Media App (PixelPost)

### PixelPost - Demo Social Media App
- Users can create accounts and post content (images/videos)
- Add captions and hashtags to posts
- Real-time content moderation before posts go live
- Content gets approved/rejected based on AI analysis
- Clean and modern UI built with shadcn/ui components

## Features

### Multi-Modal Content Analysis
Supports moderation of:
- Images - Detect inappropriate visual content
- Videos - Frame-by-frame analysis
- Text/Captions - Toxicity detection
- Hashtags - Blacklist filtering

### AI-Powered Detection
- Explicit content detection
- Violence and graphic content detection
- Hate speech and toxicity analysis
- Automated content flagging
- Real-time moderation decisions

### Policy Management
- Configurable moderation thresholds
- Custom rule creation
- Automated flagging settings
- Content filtering policies

### Moderation Dashboard
- Content review interface
- Moderation history tracking
- Analytics and reporting
- Bulk actions support
- User management

## Tech Stack

### Frontend (Dashboard & PixelPost)
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form
- Real-time updates

### Backend
- Python
- Flask
- Google Cloud AI services
  - Vision AI
  - Video Intelligence API
  - Natural Language API
- SQLite Database

## Getting Started

### Frontend Setup

```sh
cd Frontend
pnpm install
pnpm run dev
```

### Backend Setup

```sh
cd Backend
pip install -r requirements.txt
Fastapi run app.py
```

### Demo App Setup

```sh
cd "Demo app/pixel-posts"
pnpm install
pnpm run dev
```

## Environment Variables

Create a `.env` file in the Backend directory:

```
GOOGLE_APPLICATION_CREDENTIALS=path/to/service_account.json
```

## API Endpoints

### Content Moderation
- `POST /check_content` - Submit content for moderation
- `GET /moderation-history` - Retrieve moderation history
- `GET /analytics` - Get moderation analytics
- `POST /policy` - Update moderation policies

### Demo App
- `POST /posts` - Create new post
- `GET /posts` - Get approved posts
- `POST /register` - User registration
- `POST /login` - User authentication

## Project Structure

```
├── Frontend/           # Next.js moderation dashboard
├── Backend/           # Python Flask backend
│   ├── app.py        # Main application file
│   └── cloud_operations.py  # Cloud AI operations
└── Demo app/          # PixelPost social media app
    └── pixel-posts/   # React-based demo frontend
```

## Workflow

1. User creates post on PixelPost
2. Content sent to moderation backend
3. AI analyzes content across multiple dimensions
4. Content either approved or rejected based on policies
5. Approved content appears on PixelPost feed
6. Moderators can review decisions in dashboard