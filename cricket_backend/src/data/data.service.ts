import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { Match, MatchDocument } from './schemas/match.schema';

export interface MatchMetadata {
  match_id: string;
  series: string;
  match_number: number;
  format: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  toss: any;
  teams: any;
  umpires: any[];
  innings: any[];
  result: any;
  player_of_match: string;
  top_scorers: any[];
  top_wicket_takers: any[];
  match_highlights: any;
}

@Injectable()
export class DataService implements OnModuleInit {
  private dataPath: string;
  private matchMetadata: MatchMetadata;
  private matchStatistics: any[];
  private commentary: any[];
  private bowlerStats: any[];
  private wicketFeed: any[];
  private physicsFeed: any[];
  private fielderFeed: any[];
  private crowdReactions: any[];
  private umpireDecisions: any[];
  private playerBiometrics: any[];
  private equipmentSensor: any[];
  private socialSentiment: any;

  constructor(
    private configService: ConfigService,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {
    this.dataPath = path.join(__dirname, '../../..', 'cricket-data');
  }

  async onModuleInit() {
    await this.loadAllData();
    await this.saveToMongoDB();
  }

      recentCommentary: this.commentary.slice(-5),
      liveScore: {
        team1: {
          name: this.matchMetadata.teams.team1.name,
          score: `${this.matchMetadata.innings[0].total_runs}/${this.matchMetadata.innings[0].total_wickets}`,
          overs: this.matchMetadata.innings[0].total_overs,
        },
        team2: {
          name: this.matchMetadata.teams.team2.name,
          score: `${this.matchMetadata.innings[1].total_runs}/${this.matchMetadata.innings[1].total_wickets}`,
          overs: this.matchMetadata.innings[1].total_overs,
        },
      },
    };
  }

  getPlayerPerformance(playerId: string) {
    // Aggregate player performance from multiple feeds
    const bowlingStats = this.bowlerStats.find(
      (stat) => stat.bowler_id === playerId,
    );
    const biometrics = this.playerBiometrics.filter(
      (bio) => bio.player_id === playerId,
    );

    return {
      playerId,
      bowling: bowlingStats,
      biometrics: biometrics[biometrics.length - 1], // Latest biometric data
      performance: this.calculatePerformanceScore(playerId),
    };
  }

  private calculatePerformanceScore(playerId: string): number {
    // Simple performance calculation based on available data
    // This would be more sophisticated in production
    return Math.random() * 100; // Placeholder
  }

  getTeamAnalytics(teamName: string) {
    const innings = this.matchMetadata.innings.find(
      (inning) => inning.batting_team === teamName,
    );

    return {
      team: teamName,
      totalRuns: innings?.total_runs || 0,
      wicketsLost: innings?.total_wickets || 0,
      runRate: innings ? innings.total_runs / innings.total_overs : 0,
      boundaries: innings?.boundaries || { fours: 0, sixes: 0 },
      topScorers: this.matchMetadata.top_scorers.filter(
        (scorer) => scorer.team === teamName,
      ),
    };
  }

  searchEvents(query: {
    type?: string;
    innings?: number;
    overRange?: [number, number];
  }) {
    let events = [...this.commentary, ...this.wicketFeed];

    if (query.type) {
      events = events.filter((e) => e.event_type === query.type);
    }

    if (query.innings) {
      events = events.filter((e) => e.innings === query.innings);
    }

    if (query.overRange && query.overRange.length === 2) {
      events = events.filter(
        (e) =>
          e.over_number >= query.overRange![0] &&
          e.over_number <= query.overRange![1],
      );
    }

    return events;
  }

  // New endpoints for complete functionality
  getPointsTable() {
    // Calculate points table from match data
    const teams = [
      {
        position: 1,
        team: this.matchMetadata.teams.team1.name,
        played: 1,
        won: this.matchMetadata.result.winner === this.matchMetadata.teams.team1.name ? 1 : 0,
        lost: this.matchMetadata.result.winner === this.matchMetadata.teams.team2.name ? 1 : 0,
        tied: 0,
        noResult: 0,
        points: this.matchMetadata.result.winner === this.matchMetadata.teams.team1.name ? 2 : 0,
        netRunRate: this.calculateNetRunRate(this.matchMetadata.teams.team1.name),
      },
      {
        position: 2,
        team: this.matchMetadata.teams.team2.name,
        played: 1,
        won: this.matchMetadata.result.winner === this.matchMetadata.teams.team2.name ? 1 : 0,
        lost: this.matchMetadata.result.winner === this.matchMetadata.teams.team1.name ? 1 : 0,
        tied: 0,
        noResult: 0,
        points: this.matchMetadata.result.winner === this.matchMetadata.teams.team2.name ? 2 : 0,
        netRunRate: this.calculateNetRunRate(this.matchMetadata.teams.team2.name),
      },
    ];

    return teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.netRunRate - a.netRunRate;
    }).map((team, index) => ({ ...team, position: index + 1 }));
  }

  private calculateNetRunRate(teamName: string): number {
    const innings = this.matchMetadata.innings.find(
      (inning) => inning.batting_team === teamName,
    );
    if (!innings) return 0;
    const runRate = innings.total_runs / innings.total_overs;
    return parseFloat((runRate - 8.5).toFixed(2)); // Simplified calculation
  }

  getTopScorers() {
    // Get top scorers from match metadata
    return this.matchMetadata.top_scorers.map((scorer, index) => ({
      position: index + 1,
      playerName: scorer.player,
      team: scorer.team,
      runs: scorer.runs,
      balls: scorer.balls,
      fours: scorer.fours,
      sixes: scorer.sixes,
      strikeRate: scorer.strike_rate,
      matches: 1,
    }));
  }

  getTopWicketTakers() {
    // Get top wicket takers from match metadata
    return this.matchMetadata.top_wicket_takers.map((bowler, index) => ({
      position: index + 1,
      playerName: bowler.player,
      team: bowler.team,
      wickets: bowler.wickets,
      overs: bowler.overs,
      runs: bowler.runs,
      economy: bowler.economy,
      matches: 1,
    }));
  }

  getMatchHighlights() {
    return {
      videoHighlights: this.matchMetadata.match_highlights.video_highlights,
      topMoments: this.matchMetadata.match_highlights.top_moments,
      photoGallery: this.matchMetadata.match_highlights.photo_gallery,
    };
  }

  getAllMatches() {
    // Return list of matches (currently just one)
    return [
      {
        match_id: this.matchMetadata.match_id,
        series: this.matchMetadata.series,
        match_number: this.matchMetadata.match_number,
        format: this.matchMetadata.format,
        date: this.matchMetadata.date,
        venue: this.matchMetadata.venue,
        teams: {
          team1: this.matchMetadata.teams.team1.name,
          team2: this.matchMetadata.teams.team2.name,
        },
        result: this.matchMetadata.result,
        status: 'completed',
      },
    ];
  }

  getMatchById(matchId: string) {
    if (matchId === this.matchMetadata.match_id) {
      return {
        metadata: this.matchMetadata,
        statistics: this.matchStatistics,
        commentary: this.commentary,
        bowlerStats: this.bowlerStats,
        wickets: this.wicketFeed,
        highlights: this.getMatchHighlights(),
      };
    }
    return null;
  }
}
