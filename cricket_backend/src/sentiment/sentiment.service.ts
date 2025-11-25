import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi } from 'twitter-api-v2';
import { DataService } from '../data/data.service';

export interface SentimentAnalysis {
  hashtags: string[];
  mentions: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topTweets: any[];
  trending: any[];
}

@Injectable()
export class SentimentService implements OnModuleInit {
  private twitterClient: TwitterApi;
  private cachedSentiment: SentimentAnalysis;

  constructor(
    private configService: ConfigService,
    private dataService: DataService,
  ) {}

  async onModuleInit() {
    const apiKey = this.configService.get('TWITTER_API_KEY');
    const apiSecret = this.configService.get('TWITTER_API_SECRET');

    if (apiKey && apiSecret) {
      this.twitterClient = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
      });
      console.log('✅ Twitter API initialized');
    } else {
      console.warn('⚠️  Twitter API credentials not found, using data feed');
    }

    // Initialize with data from feed
    this.cachedSentiment = this.getSentimentFromFeed();
  }

  async analyzeSentiment(query: string): Promise<SentimentAnalysis> {
    try {
      if (!this.twitterClient) {
        return this.getSentimentFromFeed();
      }

      // Search recent tweets (Note: This requires elevated access)
      // For now, returning enhanced mock data
      return this.getSentimentFromFeed();
    } catch (error) {
      console.error('Twitter API error:', error.message);
      return this.getSentimentFromFeed();
    }
  }

  async getMatchSentiment(matchId: string): Promise<SentimentAnalysis> {
    // Analyze sentiment for specific match
    return this.analyzeSentiment(`cricket ${matchId}`);
  }

  async getPlayerSentiment(playerName: string): Promise<SentimentAnalysis> {
    // Analyze sentiment for specific player
    return this.analyzeSentiment(playerName);
  }

  async getTrendingHashtags(): Promise<string[]> {
    return this.cachedSentiment.hashtags;
  }

  private getSentimentFromFeed(): SentimentAnalysis {
    const feedData = this.dataService.getSocialSentiment();
    if (feedData) {
      return feedData;
    }
    
    // Fallback if feed is missing
    return {
      hashtags: [
        '#AUSvENG',
        '#MaxwellMagic',
        '#T20Cricket',
        '#MCG',
        '#CricketFever',
        '#Ashes',
        '#CricketTwitter',
      ],
      mentions: 125000,
      sentiment: {
        positive: 0.65,
        neutral: 0.25,
        negative: 0.1,
      },
      topTweets: [
        {
          id: '1',
          text: 'Maxwell absolutely smashing it! What a player! 🔥 #AUSvENG',
          likes: 2540,
          retweets: 890,
          sentiment: 'positive',
        },
        {
          id: '2',
          text: 'England needs to step up their game in the middle overs #T20Cricket',
          likes: 1820,
          retweets: 542,
          sentiment: 'neutral',
        },
        {
          id: '3',
          text: 'Unbelievable atmosphere at the MCG! This is cricket at its finest! 🏏 #CricketFever',
          likes: 3120,
          retweets: 1240,
          sentiment: 'positive',
        },
        {
          id: '4',
          text: 'Australia showing why they are world champions! Dominant performance #MaxwellMagic',
          likes: 2890,
          retweets: 956,
          sentiment: 'positive',
        },
      ],
      trending: [
        { player: 'Glenn Maxwell', mentions: 12500, trend: 'up' },
        { player: 'Jos Buttler', mentions: 8200, trend: 'neutral' },
        { player: 'Mitchell Starc', mentions: 6800, trend: 'up' },
        { player: 'Jofra Archer', mentions: 5400, trend: 'down' },
      ],
    };
  }

  getCachedSentiment(): SentimentAnalysis {
    return this.cachedSentiment;
  }

  async refreshSentiment(): Promise<SentimentAnalysis> {
    this.cachedSentiment = await this.analyzeSentiment('cricket');
    return this.cachedSentiment;
  }
}
