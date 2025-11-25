# Project Architecture: Sports Analytics Platform

## Overview
This project is a real-time sports analytics platform (focused on Cricket) that aggregates live match data, provides AI-powered predictions, analyzes social sentiment, and delivers personalized content. It is built using a modern tech stack with a clear separation of concerns between the frontend and backend.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Lucide Icons
- **Backend**: NestJS (Node.js), Mongoose (MongoDB)
- **AI**: Google Gemini API (Generative AI)
- **Data Source**: JSON feeds (simulating external APIs)

## Architecture Diagram
```mermaid
graph TD
    User[User] --> Frontend[Next.js Frontend]
    Frontend --> API[NestJS Backend API]
    
    subgraph "Backend Services"
        API --> DataService[Data Service]
        API --> AiService[AI Service]
        API --> SentimentService[Sentiment Service]
    end
    
    subgraph "Data Layer"
        DataService --> JSON[JSON Feeds (cricket-data)]
        DataService --> DB[(MongoDB)]
    end
    
    subgraph "External Services"
        AiService --> Gemini[Google Gemini API]
        SentimentService --> Twitter[Twitter API (Optional)]
    end
```

## Backend Architecture (`cricket_backend`)

### Modules
1.  **AppModule**: Root module orchestrating other modules.
2.  **DataModule**: Handles data ingestion, normalization, and serving.
    *   **DataService**:
        *   Loads raw JSON feeds from `cricket-data` directory.
        *   Aggregates data into meaningful structures (Match Summary, Player Stats).
        *   Provides getters for various data points (Live Score, Commentary, etc.).
        *   Saves match data to MongoDB for persistence.
    *   **DataController**: Exposes REST endpoints (e.g., `/api/data/match/live-summary`).
3.  **AiModule**: Handles AI-powered features.
    *   **AiService**:
        *   Uses Google Gemini API to generate match predictions and personalized commentary.
        *   Falls back to intelligent mock data if API keys are missing.
        *   Analyzes player performance using generative AI.
    *   **AiController**: Exposes endpoints for predictions and commentary.
4.  **SentimentModule**: Handles social media analysis.
    *   **SentimentService**:
        *   Analyzes social sentiment using Twitter API (or simulated feed).
        *   Reads `social-sentiment-feed.json` via `DataService` for consistent data.
        *   Calculates sentiment scores (Positive/Neutral/Negative).
    *   **SentimentController**: Exposes endpoints for sentiment analysis.

### Data Flow
1.  **Initialization**: On startup, `DataService` reads all JSON files from `cricket-data`.
2.  **Serving**: Frontend requests data via API endpoints.
3.  **Processing**: Services process the raw data (e.g., calculating run rates, generating AI predictions based on stats).
4.  **Response**: JSON responses are sent back to the frontend.

## Frontend Architecture (`cricket`)

### Pages
1.  **Home (`/`)**:
    *   **Live Score**: Real-time match updates (Runs, Wickets, Overs).
    *   **Match Flow**: Visual graph of run rate and wickets.
    *   **Highlights**: Video/Photo highlights of key moments.
    *   **Stats**: Comparative team statistics.
2.  **Dashboard (`/dashboard`)**:
    *   **AI Predictions**: Win probability and key factors.
    *   **Sentiment Analysis**: Social media buzz, sentiment breakdown, trending hashtags.
3.  **Matches (`/matches`)**:
    *   List of live, upcoming, and recent matches.
4.  **Teams (`/teams`)**:
    *   Team rosters, captain info.
    *   Player statistics and performance heatmaps.
5.  **News (`/news`)**:
    *   Latest news and social media trends.

### Components
-   **Sidebar/RightSidebar**: Navigation and quick stats (Points Table, Top Scorer).
-   **ApiClient (`lib/api-client.ts`)**: Centralized service for making HTTP requests to the backend.

## Key Features Implementation

1.  **Live Match Data**:
    *   **Backend**: `DataService` reads `match-metadata.json`, `match-statistics-feed.json`, etc.
    *   **Frontend**: `Home` component polls `/api/data/match/live-summary` every 30s.

2.  **AI Predictions**:
    *   **Backend**: `AiService` constructs a prompt with current match stats and sends it to Gemini.
    *   **Frontend**: Displays win probability bars and key factors.

3.  **Social Sentiment**:
    *   **Backend**: `SentimentService` aggregates data from `social-sentiment-feed.json`.
    *   **Frontend**: Visualizes sentiment percentages and trending tweets.

4.  **Personalized Commentary**:
    *   **Backend**: `AiService` generates commentary based on user preferences (Hero/Music style).
    *   **Frontend**: Users can select styles to see custom commentary.

## Development Workflow
1.  **Data**: Update JSON files in `cricket-data` to simulate different match scenarios.
2.  **Backend**: `npm run start:dev` to run the NestJS server.
3.  **Frontend**: `npm run dev` to run the Next.js app.
