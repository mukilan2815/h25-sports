'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Activity, Target, Hash, Play, ChevronRight, BarChart3 } from "lucide-react";
import { apiClient } from './lib/api-client';
import Link from 'next/link';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';

export default function Home() {
  const [liveMatch, setLiveMatch] = useState<any>(null);
  const [pointsTable, setPointsTable] = useState<any[]>([]);
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [matchStats, setMatchStats] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [highlights, setHighlights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    async function loadData() {
      try {
        const [matchData, points, scorers, stats, sentimentData, highlightsData] = await Promise.all([
          apiClient.getLiveMatchSummary(),
          apiClient.getPointsTable(),
          apiClient.getTopScorers(),
          apiClient.getMatchStatistics(20),
          apiClient.getCurrentSentiment(),
          apiClient.getMatchHighlights(),
        ]);
        
        setLiveMatch((matchData as any).metadata);
        setPointsTable(points as any);
        setTopScorers(scorers as any);
        setMatchStats(stats as any);
        setSentiment(sentimentData as any);
        setHighlights(highlightsData as any);

        // Get predictions
        if ((matchData as any)?.metadata?.match_id) {
          const pred = await apiClient.getPrediction((matchData as any).metadata.match_id);
          setPrediction(pred);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    
    // Refresh every 30 seconds for live updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-8 h-screen overflow-y-auto">
        {/* Search */}
        <div className="mb-8">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full bg-[#1e293b] border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 shadow-sm"
                />
            </div>
        </div>

        {/* Live Match */}
        {loading ? (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">Live Match</h2>
                <div className="h-[1px] bg-slate-800 flex-1 ml-6"></div>
            </div>
            <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <div className="text-slate-400">Loading live match...</div>
            </div>
          </section>
        ) : liveMatch ? (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">Live Match</h2>
                <div className="h-[1px] bg-slate-800 flex-1 ml-6"></div>
            </div>
            
            <Link href={`/match/${liveMatch.match_id}`}>
              <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border border-slate-800 shadow-2xl group cursor-pointer hover:border-emerald-500/50 transition-all">
                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-950/80"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-between px-16 z-20">
                      {/* Left Team */}
                      <div className="text-center transform transition-transform duration-500 hover:scale-105">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border-4 border-slate-900">
                              <span className="font-black text-3xl text-white">{liveMatch.teams.team1.name.substring(0, 1)}</span>
                          </div>
                          <div className="font-black text-5xl italic text-white drop-shadow-lg tracking-tighter">{liveMatch.teams.team1.name}</div>
                          <div className="text-2xl font-bold text-blue-300 mt-2">{liveMatch.innings[0].total_runs}/{liveMatch.innings[0].total_wickets}</div>
                      </div>

                      {/* Center Info */}
                      <div className="text-center mt-4">
                          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold mb-4 inline-block tracking-widest uppercase text-blue-200">
                            {liveMatch.format} - {liveMatch.series}
                          </div>
                          <div className="flex items-center justify-center gap-4 mb-2">
                               <div className="text-6xl font-black italic text-white/20">VS</div>
                          </div>
                          <div className="text-xl font-bold text-white mb-1">{liveMatch.venue}</div>
                          <div className="text-sm font-bold text-emerald-400 mb-6 animate-pulse">🔴 LIVE</div>
                      </div>

                      {/* Right Team */}
                      <div className="text-center transform transition-transform duration-500 hover:scale-105">
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] border-4 border-slate-900">
                              <span className="font-black text-3xl text-white">{liveMatch.teams.team2.name.substring(0, 1)}</span>
                          </div>
                          <div className="font-black text-5xl italic text-white drop-shadow-lg tracking-tighter">{liveMatch.teams.team2.name}</div>
                          <div className="text-2xl font-bold text-purple-300 mt-2">{liveMatch.innings[1].total_runs}/{liveMatch.innings[1].total_wickets}</div>
                      </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
              </div>
            </Link>
          </section>
        ) : (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">Live Match</h2>
                <div className="h-[1px] bg-slate-800 flex-1 ml-6"></div>
            </div>
            <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <div className="text-slate-400">No live match data available</div>
            </div>
          </section>
        )}

        {/* Highlights */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide">Highlights</h2>
                <div className="h-[1px] bg-slate-800 flex-1 ml-6"></div>
            </div>

            {highlights ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {highlights.videoHighlights?.map((video: any, index: number) => (
                  <div key={index} className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer border border-slate-800 hover:border-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="absolute inset-0 bg-slate-900/50"></div>
                      
                      <div className="absolute inset-0 flex items-end justify-center pb-20">
                           <div className="w-32 h-48 bg-slate-700/50 rounded-t-full blur-sm group-hover:blur-0 transition-all duration-500"></div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 p-5 w-full">
                          <h3 className="font-bold text-white text-sm mb-2 leading-tight">{video.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{video.description}</p>
                          <span className="text-xs text-slate-500 mt-2 inline-block">{video.duration}</span>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 shadow-lg">
                              <Play className="text-white fill-white ml-1" size={24} />
                          </div>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer border border-slate-800 bg-slate-900/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-slate-400">Loading highlights...</div>
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
