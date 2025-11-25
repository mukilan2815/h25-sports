import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DataService } from '../data/data.service';

export interface MatchPrediction {
  team1WinProbability: number;
  team2WinProbability: number;
  projectedScore: number;
  keyFactors: string[];
  confidence: number;
  explanation: string;
}

export interface PersonalizedCommentary {
  commentary: string;
  style: string;
  timestamp: Date;
}

@Injectable()
export class AiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private dataService: DataService,
  ) {}

  async onModuleInit() {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      console.log('✅ Gemini AI initialized');
    } else {
      console.warn('⚠️  Gemini API key not found');
    }
  }

  async predictMatchOutcome(matchId: string): Promise<MatchPrediction> {
    try {
      const matchData = this.dataService.getLiveMatchSummary();
      const stats = this.dataService.getMatchStatistics(10);

      const prompt = `Based on the following cricket match data, predict the match outcome:
      
Match: ${matchData.metadata.teams.team1.name} vs ${matchData.metadata.teams.team2.name}
Current Score: ${matchData.liveScore.team1.score} vs ${matchData.liveScore.team2.score}
Overs: ${matchData.liveScore.team1.overs} and ${matchData.liveScore.team2.overs}
Target: ${matchData.metadata.innings[0].target}

Recent statistics: ${JSON.stringify(stats.slice(-3))}

Provide:
1. Win probability for each team (as decimal 0-1)
2. Projected final score for batting team
3. Top 3 key factors affecting the outcome
4. Confidence level (0-100)
5. Brief explanation

Return as JSON only.`;

      if (!this.model) {
        return this.getMockPrediction();
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const prediction = JSON.parse(jsonMatch[0]);
          return {
            team1WinProbability: prediction.team1WinProbability || 0.65,
            team2WinProbability: prediction.team2WinProbability || 0.35,
            projectedScore: prediction.projectedScore || 178,
            keyFactors: prediction.keyFactors || [
              'Required run rate manageable',
              'Wickets in hand crucial',
              'Spin bowling in middle overs',
            ],
            confidence: prediction.confidence || 75,
            explanation:
              prediction.explanation ||
              'Based on current run rate and wickets in hand, the chasing team has a moderate chance of success.',
          };
        }
      } catch (e) {
        console.error('Failed to parse AI response:', e);
      }

      return this.getMockPrediction();
    } catch (error) {
      console.error('Prediction error:', error.message);
      return this.getMockPrediction();
    }
  }

  async generatePersonalizedCommentary(
    event: any,
    userPreferences: {
      favoriteHero?: string;
      musicGenre?: string;
      style?: string;
    },
  ): Promise<PersonalizedCommentary> {
    try {
      const prompt = `Generate exciting cricket commentary for this event in the style of ${userPreferences.favoriteHero || 'Iron Man'} mixed with ${userPreferences.musicGenre || 'Rock'} music vibes:

Event: ${event.sub_type}
Over: ${event.over_number}.${event.ball_number}

Make it creative, engaging, and fun! Keep it under 100 words.`;

      if (!this.model) {
        return this.getMockCommentary(event, userPreferences);
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      return {
        commentary: response.text(),
        style: `${userPreferences.favoriteHero}-${userPreferences.musicGenre}`,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Commentary generation error:', error.message);
      return this.getMockCommentary(event, userPreferences);
    }
  }

  async analyzePlayerPerformance(playerId: string): Promise<any> {
    try {
      const playerData = this.dataService.getPlayerPerformance(playerId);

      const prompt = `Analyze this cricket player's performance and provide insights:
      
Player ID: ${playerId}
Performance Score: ${playerData.performance}
Bowling Stats: ${JSON.stringify(playerData.bowling)}

Provide:
1. Overall performance rating (1-10)
2. Strengths (3 points)
3. Areas for improvement (2 points)
4. Prediction for next match

Return as JSON.`;

      if (!this.model) {
        return this.getMockPlayerAnalysis();
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return this.getMockPlayerAnalysis();
    } catch (error) {
      console.error('Player analysis error:', error.message);
      return this.getMockPlayerAnalysis();
    }
  }

  private getMockPrediction(): MatchPrediction {
    return {
      team1WinProbability: 0.65,
      team2WinProbability: 0.35,
      projectedScore: 178,
      keyFactors: [
        'England needs 108 runs from 90 balls',
        'Required run rate is manageable at 7.2',
        'Spin bowlers will be crucial in middle overs',
      ],
      confidence: 75,
      explanation:
        'Based on the current match situation, Australia has a strong advantage with England needing a significant partnership to chase down the target. The required run rate is achievable, but wickets in hand will be crucial.',
    };
  }

  private getMockCommentary(event: any, prefs: any): PersonalizedCommentary {
    const heroThemes: any = {
      'iron-man': '🦾 BOOM! Stark Industries level power shot!',
      batman: '🦇 Dark knight precision! What a delivery!',
      'spider-man': "🕷️  With great power comes great cricket! That's a web-slinger!",
    };

    const musicVibes: any = {
      rock: '🎸 ROCKING the stadium!',
      classical: '🎻 Orchestral perfection!',
      'hip-hop': '🎤 Dropping beats AND wickets!',
    };

    const heroText = heroThemes[prefs.favoriteHero] || heroThemes['iron-man'];
    const musicText = musicVibes[prefs.musicGenre] || musicVibes['rock'];

    return {
      commentary: `${heroText} ${musicText} ${event.sub_type === 'boundary_scored' ? 'FOUR runs smashed!' : event.sub_type === 'wicket_fall' ? 'WICKET DOWN!' : 'Amazing cricket moment!'}`,
      style: `${prefs.favoriteHero}-${prefs.musicGenre}`,
      timestamp: new Date(),
    };
  }

  private getMockPlayerAnalysis(): any {
    return {
      rating: 8.5,
      strengths: [
        'Excellent economy rate in powerplay overs',
        'Consistent line and length',
        'Good variation with slower balls',
      ],
      improvements: [
        'Death overs execution needs work',
        'Fielding can be more aggressive',
      ],
      nextMatchPrediction:
        'Expected to take 2-3 wickets based on current form',
    };
  }
}
