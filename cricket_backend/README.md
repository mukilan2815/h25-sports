# Cricket Backend Microservices

A comprehensive NestJS backend system for live cricket data aggregation, AI-powered predictions, and social sentiment analysis.

## 🏗️ Architecture

The backend is built using a microservices architecture with the following modules:

### 1. **Data Service** (`/api/data`)
- Loads and normalizes cricket mock data from `../cricket-data`
- Provides REST APIs for match metadata, statistics, commentary, and more
- Aggregates data from multiple feeds (bowler stats, fielder positions, physics, biometrics, etc.)

### 2. **AI Service** (`/api/ai`)
- Uses Google Gemini AI (v1.5-pro) for match predictions
- Generates personalized commentary based on user preferences
- Analyzes player performance with AI insights

### 3. **Sentiment Service** (`/api/sentiment`)
- Integrates with Twitter API for social media sentiment analysis
- Tracks trending hashtags and player mentions
- Provides real-time fan sentiment data

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Environment Variables

Create a `.env` file with:

```env
# Twitter API Credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# Data Path
CRICKET_DATA_PATH=../cricket-data

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## 📡 Running the Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Data Endpoints

- `GET /api/data/match/metadata` - Get match metadata
- `GET /api/data/match/live-summary` - Get live match summary
- `GET /api/data/match/statistics?limit=10` - Get match statistics
- `GET /api/data/match/commentary?limit=20` - Get ball-by-ball commentary
- `GET /api/data/match/bowler-stats` - Get bowler statistics
- `GET /api/data/match/wickets` - Get wicket feed
- `GET /api/data/match/physics?limit=100` - Get physics data
- `GET /api/data/match/fielders` - Get fielder positions
- `GET /api/data/match/crowd-reactions` - Get crowd reaction feed
- `GET /api/data/match/umpire-decisions` - Get umpire decisions
- `GET /api/data/match/player-biometrics` - Get player biometric data
- `GET /api/data/match/equipment-sensor` - Get equipment sensor data
- `GET /api/data/player/:playerId/performance` - Get player performance
- `GET /api/data/team/:teamName/analytics` - Get team analytics
- `GET /api/data/events/search?type=wicket&innings=1` - Search events

### AI Endpoints

- `GET /api/ai/predict/:matchId` - Get AI match prediction
- `POST /api/ai/commentary/generate` - Generate personalized commentary
  ```json
  {
    "event": { "sub_type": "boundary_scored", "over_number": 5, "ball_number": 3 },
    "userPreferences": {
      "favoriteHero": "iron-man",
      "musicGenre": "rock"
    }
  }
  ```
- `GET /api/ai/player/:playerId/analysis` - AI player analysis

### Sentiment Endpoints

- `GET /api/sentiment/current` - Get current sentiment data
- `GET /api/sentiment/match/:matchId` - Get match-specific sentiment
- `GET /api/sentiment/player/:playerName` - Get player sentiment
- `GET /api/sentiment/trending` - Get trending hashtags
- `GET /api/sentiment/refresh` - Refresh sentiment data

## 🎯 Features

### Data Normalization
- Automatically loads and normalizes 11 different cricket data feeds
- Provides aggregated views of match, player, and team data
- Efficient in-memory caching for fast API responses

### AI-Powered Predictions
- Match outcome predictions with confidence scores
- Win probability calculations
- Key factors analysis
- Player performance insights

### Personalized Commentary
- Generates unique commentary based on user preferences
- Supports multiple hero themes (Iron Man, Batman, Spider-Man, etc.)
- Multiple music genre styles (Rock, Classical, Hip-Hop, etc.)

### Social Sentiment Analysis
- Real-time Twitter sentiment tracking
- Trending hashtags and player mentions
- Positive/Neutral/Negative sentiment breakdown
- Top tweets and fan reactions

## 🗂️ Project Structure

```
cricket_backend/
├── src/
│   ├── data/           # Data aggregation module
│   │   ├── data.service.ts
│   │   ├── data.controller.ts
│   │   └── data.module.ts
│   ├── ai/             # AI predictions module
│   │   ├── ai.service.ts
│   │   ├── ai.controller.ts
│   │   └── ai.module.ts
│   ├── sentiment/      # Social sentiment module
│   │   ├── sentiment.service.ts
│   │   ├── sentiment.controller.ts
│   │   └── sentiment.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
└── package.json
```

## 🔧 Technologies Used

- **NestJS** - Progressive Node.js framework
- **Google Generative AI** - Gemini 1.5 Pro for AI predictions
- **Twitter API v2** - Social media sentiment analysis
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming

## 📝 Mock Data

The backend uses comprehensive mock data from `../cricket-data`:
- Match metadata and results
- Ball-by-ball statistics
- Player biometrics
- Physics data (ball speed, trajectory)
- Fielder positions
- Umpire decisions
- Crowd reactions
- Equipment sensors
- Commentary feed

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📄 License

UNLICENSED
