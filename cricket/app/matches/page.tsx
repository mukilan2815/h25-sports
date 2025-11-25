  'use client';

import { useState, useEffect } from 'react';
import { Calendar, Trophy, MapPin, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '../lib/api-client';

import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const matchSummary = await apiClient.getLiveMatchSummary();
        setLiveMatch((matchSummary as any).metadata);
        
        // TODO: Backend should provide these endpoints
        // For now, we'll show only live match data from backend
        setUpcomingMatches([]);
        setRecentMatches([]);
      } catch (error) {
        console.error('Error loading matches data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading matches...</div>
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
              Live & Upcoming <span className="text-emerald-400">Matches</span>
            </h1>
            <p className="text-slate-400 text-lg">Real-time scores and AI-powered match predictions</p>
          </div>
        </section>

        {/* Tabs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex gap-4 border-b border-slate-800">
            {['live', 'upcoming', 'recent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Live Matches */}
        {activeTab === 'live' && liveMatch && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-slate-900 rounded-xl border border-emerald-500/30 p-8 shadow-lg shadow-emerald-900/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Live Now</span>
                </div>
                <span className="text-xs text-slate-400">{liveMatch.format} • {liveMatch.venue}</span>
              </div>

              <div className="grid md:grid-cols-3 gap-8 items-center mb-6">
                <div className="text-center md:text-right">
                  <div className="flex justify-center md:justify-end mb-3">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {liveMatch.teams.team1.name.substring(0, 1)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{liveMatch.teams.team1.name}</h3>
                  <div className="text-3xl font-bold text-white">
                    {liveMatch.innings[0].total_runs}/{liveMatch.innings[0].total_wickets}
                  </div>
                  <p className="text-slate-400 text-sm">({liveMatch.innings[0].total_overs} overs)</p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">VS</div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="text-xs text-slate-500 mb-1">Match Status</div>
                    <div className="text-sm font-medium text-white">{liveMatch.result.note.split('.')[0]}</div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-3">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {liveMatch.teams.team2.name.substring(0, 1)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{liveMatch.teams.team2.name}</h3>
                  <div className="text-3xl font-bold text-white">
                    {liveMatch.innings[1].total_runs}/{liveMatch.innings[1].total_wickets}
                  </div>
                  <p className="text-slate-400 text-sm">({liveMatch.innings[1].total_overs} overs)</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 flex justify-between items-center">
                <div className="text-sm text-slate-400">
                  <span className="text-white font-medium">Target:</span> {liveMatch.innings[0].target} • 
                  <span className="text-white font-medium ml-2">Series:</span> {liveMatch.series}
                </div>
                <Link 
                  href={`/match/${liveMatch.match_id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        {activeTab === 'upcoming' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {upcomingMatches.length === 0 ? (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
                <p className="text-slate-400 text-lg">No upcoming matches data available from API yet.</p>
                <p className="text-slate-500 text-sm mt-2">Backend needs to implement upcoming matches endpoint.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:shadow-emerald-900/20 hover:shadow-lg transition-all">
                    {/* Upcoming match card content */}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent Matches */}
        {activeTab === 'recent' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {recentMatches.length === 0 ? (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
                <p className="text-slate-400 text-lg">No recent matches data available from API yet.</p>
                <p className="text-slate-500 text-sm mt-2">Backend needs to implement recent matches endpoint.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMatches.map((match, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:bg-slate-800/50 transition-colors">
                    {/* Recent match card content */}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <RightSidebar />
    </div>
  );
}
