import { Controller, Get, Query, Param } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('api/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('match/metadata')
  getMatchMetadata() {
    return this.dataService.getMatchMetadata();
  }

  @Get('match/live-summary')
  getLiveMatchSummary() {
    return this.dataService.getLiveMatchSummary();
  }

  @Get('match/statistics')
  getMatchStatistics(@Query('limit') limit?: string) {
    return this.dataService.getMatchStatistics(limit ? parseInt(limit) : undefined);
  }

  @Get('match/commentary')
  getCommentary(@Query('limit') limit?: string) {
    return this.dataService.getCommentary(limit ? parseInt(limit) : undefined);
  }

  @Get('match/bowler-stats')
  getBowlerStats() {
    return this.dataService.getBowlerStats();
  }

  @Get('match/wickets')
  getWicketFeed() {
    return this.dataService.getWicketFeed();
  }

  @Get('match/physics')
  getPhysicsFeed(@Query('limit') limit?: string) {
    return this.dataService.getPhysicsFeed(limit ? parseInt(limit) : undefined);
  }

  @Get('match/fielders')
  getFielderFeed() {
    return this.dataService.getFielderFeed();
  }

  @Get('match/crowd-reactions')
  getCrowdReactions() {
    return this.dataService.getCrowdReactions();
  }

  @Get('match/umpire-decisions')
  getUmpireDecisions() {
    return this.dataService.getUmpireDecisions();
  }

  @Get('match/player-biometrics')
  getPlayerBiometrics() {
    return this.dataService.getPlayerBiometrics();
  }

  @Get('match/equipment-sensor')
  getEquipmentSensor() {
    return this.dataService.getEquipmentSensor();
  }

  @Get('player/:playerId/performance')
  getPlayerPerformance(@Param('playerId') playerId: string) {
    return this.dataService.getPlayerPerformance(playerId);
  }

  @Get('team/:teamName/analytics')
  getTeamAnalytics(@Param('teamName') teamName: string) {
    return this.dataService.getTeamAnalytics(teamName);
  }

  @Get('events/search')
  searchEvents(
    @Query('type') type?: string,
    @Query('innings') innings?: string,
    @Query('overFrom') overFrom?: string,
    @Query('overTo') overTo?: string,
  ) {
    const query: any = {};
    if (type) query.type = type;
    if (innings) query.innings = parseInt(innings);
    if (overFrom && overTo) {
      query.overRange = [parseInt(overFrom), parseInt(overTo)];
    }
    return this.dataService.searchEvents(query);
  }

  @Get('points-table')
  getPointsTable() {
    return this.dataService.getPointsTable();
  }

  @Get('top-scorers')
  getTopScorers() {
    return this.dataService.getTopScorers();
  }

  @Get('top-wicket-takers')
  getTopWicketTakers() {
    return this.dataService.getTopWicketTakers();
  }

  @Get('matches')
  getAllMatches() {
    return this.dataService.getAllMatches();
  }

  @Get('match/:matchId/details')
  getMatchDetails(@Param('matchId') matchId: string) {
    return this.dataService.getMatchById(matchId);
  }

  @Get('match/highlights')
  getMatchHighlights() {
    return this.dataService.getMatchHighlights();
  }

  @Get('news')
  getNews() {
    return this.dataService.getNews();
  }
}
