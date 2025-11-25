'use client';

import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, MapPin } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '../lib/api-client';

import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamAnalytics, setTeamAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const matchData = await apiClient.getMatchMetadata();
        const teamsData = [(matchData as any).teams.team1, (matchData as any).teams.team2];
        setTeams(teamsData);
        setSelectedTeam(teamsData[0]);
        
        // Load analytics for first team
        const analytics = await apiClient.getTeamAnalytics(teamsData[0].name);
        setTeamAnalytics(analytics);
      } catch (error) {
        console.error('Error loading teams data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadTeamAnalytics() {
      if (selectedTeam) {
        try {
          const analytics = await apiClient.getTeamAnalytics(selectedTeam.name);
          setTeamAnalytics(analytics);
        } catch (error) {
          console.error('Error loading team analytics:', error);
        }
      }
    }
    loadTeamAnalytics();
  }, [selectedTeam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading teams data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-8 h-screen overflow-y-auto">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 rounded-2xl mb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Teams & <span className="text-emerald-400">Players</span>
            </h1>
            <p className="text-slate-400 text-lg">Comprehensive team statistics and player performance analysis</p>
          </div>
        </section>

        {/* Team Selection */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {teams.map((team, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTeam(team)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedTeam?.name === team.name
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                    {team.name.substring(0, 1)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white">{team.name}</h3>
                    <p className="text-sm text-slate-400">Captain: {team.captain}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Team Stats Overview */}
          {teamAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-slate-400 text-sm">Ranking</h4>
                </div>
                <div className="text-3xl font-bold text-white">
                  #{teamAnalytics.ranking || 'N/A'}
                </div>
                <p className="text-xs text-slate-500 mt-1">ICC T20 Rankings</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-slate-400 text-sm">Win Rate</h4>
                </div>
                <div className="text-3xl font-bold text-white">
                  {teamAnalytics.winRate ? `${Math.round(teamAnalytics.winRate * 100)}%` : 'N/A'}
                </div>
                <p className="text-xs text-slate-500 mt-1">Season performance</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-slate-400 text-sm">Squad Size</h4>
                </div>
                <div className="text-3xl font-bold text-white">{selectedTeam?.players.length || 0}</div>
                <p className="text-xs text-slate-500 mt-1">Active players</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-slate-400 text-sm">Average Score</h4>
                </div>
                <div className="text-lg font-bold text-white">
                  {teamAnalytics.averageScore || 'N/A'}
                </div>
                <p className="text-xs text-slate-500 mt-1">Per innings</p>
              </div>
            </div>
          )}

          {/* Squad List */}
          {selectedTeam && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-8">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg">Squad - {selectedTeam.name}</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {selectedTeam.players.map((player: any, idx: number) => (
                  <PlayerRow key={idx} player={player} />
                ))}
              </div>
            </div>
          )}

          {/* Performance Heatmap */}
          {teamAnalytics && teamAnalytics.recentForm && (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="font-bold text-white text-lg mb-6">Performance Heatmap - Recent Form</h3>
              <div className="grid grid-cols-10 gap-2">
                {teamAnalytics.recentForm.map((result: any, i: number) => {
                  const intensity = result.won ? 0.9 : result.close ? 0.5 : 0.2;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded group relative cursor-pointer"
                      style={{
                        backgroundColor: result.won ? '#10b981' : result.close ? '#f59e0b' : '#ef4444',
                        opacity: 0.2 + intensity * 0.8
                      }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Match {i + 1}: {result.won ? 'Won' : result.close ? 'Close' : 'Lost'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Lost</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span>Close Match</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                  <span>Won</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <RightSidebar />
    </div>
  );
}

function PlayerRow({ player }: { player: any }) {
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadPlayerStats = async () => {
    if (loading || playerStats) return;
    
    try {
      setLoading(true);
      const stats = await apiClient.getPlayerPerformance(player.id);
      setPlayerStats(stats);
    } catch (error) {
      console.error('Error loading player stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="p-6 hover:bg-slate-800/30 transition-colors cursor-pointer"
      onClick={loadPlayerStats}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-lg font-bold text-white">
            {player.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-bold text-white">{player.name}</h4>
            <p className="text-sm text-slate-400 capitalize">{player.role}</p>
          </div>
        </div>
        {loading ? (
          <div className="text-slate-400 text-sm">Loading stats...</div>
        ) : playerStats ? (
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs text-slate-500">Matches</div>
              <div className="font-bold text-white">{playerStats.matches || 'N/A'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Avg</div>
              <div className="font-bold text-white">{playerStats.average || 'N/A'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Strike Rate</div>
              <div className="font-bold text-emerald-400">{playerStats.strikeRate || 'N/A'}</div>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-sm">Click to load stats</div>
        )}
      </div>
    </div>
  );
}
