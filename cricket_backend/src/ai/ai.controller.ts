import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('predict/:matchId')
  async predictMatch(@Param('matchId') matchId: string) {
    return this.aiService.predictMatchOutcome(matchId);
  }

  @Post('commentary/generate')
  async generateCommentary(
    @Body()
    body: {
      event: any;
      userPreferences: {
        favoriteHero?: string;
        musicGenre?: string;
        style?: string;
      };
    },
  ) {
    return this.aiService.generatePersonalizedCommentary(
      body.event,
      body.userPreferences,
    );
  }

  @Get('player/:playerId/analysis')
  async analyzePlayer(@Param('playerId') playerId: string) {
    return this.aiService.analyzePlayerPerformance(playerId);
  }
}
