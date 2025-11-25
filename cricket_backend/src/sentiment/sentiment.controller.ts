import { Controller, Get, Query, Param } from '@nestjs/common';
import { SentimentService } from './sentiment.service';

@Controller('api/sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @Get('match/:matchId')
  async getMatchSentiment(@Param('matchId') matchId: string) {
    return this.sentimentService.getMatchSentiment(matchId);
  }

  @Get('player/:playerName')
  async getPlayerSentiment(@Param('playerName') playerName: string) {
    return this.sentimentService.getPlayerSentiment(playerName);
  }

  @Get('trending')
  async getTrendingHashtags() {
    return {
      hashtags: await this.sentimentService.getTrendingHashtags(),
    };
  }

  @Get('current')
  getCurrentSentiment() {
    return this.sentimentService.getCachedSentiment();
  }

  @Get('refresh')
  async refreshSentiment() {
    return this.sentimentService.refreshSentiment();
  }
}
