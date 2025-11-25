const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Data API
  async getMatchMetadata() {
    return this.fetcher('/api/data/match/metadata');
  }

  async getLiveMatchSummary() {
    return this.fetcher('/api/data/match/live-summary');
  }

  async getMatchStatistics(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.fetcher(`/api/data/match/statistics${query}`);
  }

  async getCommentary(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.fetcher(`/api/data/match/commentary${query}`);
  }

  async getBowlerStats() {
    return this.fetcher('/api/data/match/bowler-stats');
  }

  async getWicketFeed() {
    return this.fetcher('/api/data/match/wickets');
  }

  async getPlayerPerformance(playerId: string) {
    return this.fetcher(`/api/data/player/${playerId}/performance`);
  }

  async getTeamAnalytics(teamName: string) {
    return this.fetcher(`/api/data/team/${teamName}/analytics`);
  }

  async getPointsTable() {
    return this.fetcher('/api/data/points-table');
  }

  async getTopScorers() {
    return this.fetcher('/api/data/top-scorers');
  }

  async getTopWicketTakers() {
    return this.fetcher('/api/data/top-wicket-takers');
  }

  async getAllMatches() {
    return this.fetcher('/api/data/matches');
  }

  async getMatchDetails(matchId: string) {
    return this.fetcher(`/api/data/match/${matchId}/details`);
  }

  async getMatchHighlights() {
    return this.fetcher('/api/data/match/highlights');
  }

  async getPhysicsFeed(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.fetcher(`/api/data/match/physics${query}`);
  }

  async getFielderFeed() {
    return this.fetcher('/api/data/match/fielders');
  }

  async getCrowdReactions() {
    return this.fetcher('/api/data/match/crowd-reactions');
  }

  async getUmpireDecisions() {
    return this.fetcher('/api/data/match/umpire-decisions');
  }

  async getPlayerBiometrics() {
    return this.fetcher('/api/data/match/player-biometrics');
  }

  async getEquipmentSensor() {
    return this.fetcher('/api/data/match/equipment-sensor');
  }

  // AI API
  async getPrediction(matchId: string) {
    return this.fetcher(`/api/ai/predict/${matchId}`);
  }

  async generateCommentary(event: any, userPreferences: any) {
    return this.fetcher('/api/ai/commentary/generate', {
      method: 'POST',
      body: JSON.stringify({ event, userPreferences }),
    });
  }

  async analyzePlayer(playerId: string) {
    return this.fetcher(`/api/ai/player/${playerId}/analysis`);
  }

  // Sentiment API
  async getCurrentSentiment() {
    return this.fetcher('/api/sentiment/current');
  }

  async getMatchSentiment(matchId: string) {
    return this.fetcher(`/api/sentiment/match/${matchId}`);
  }

  async getPlayerSentiment(playerName: string) {
    return this.fetcher(`/api/sentiment/player/${playerName}`);
  }

  async getTrendingHashtags() {
    return this.fetcher('/api/sentiment/trending');
  }

  async refreshSentiment() {
    return this.fetcher('/api/sentiment/refresh');
  }

  async getNews() {
    return this.fetcher('/api/data/news');
  }
}

export const apiClient = new ApiClient();
