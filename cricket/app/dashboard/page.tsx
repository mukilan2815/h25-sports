'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Target, Hash, ThumbsUp, MessageCircle } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import { apiClient } from '../lib/api-client';

export default function Dashboard() {
  const [sentiment, setSentiment] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [sentimentData, liveMatch] = await Promise.all([
          apiClient.getCurrentSentiment(),
          apiClient.getLiveMatchSummary(),
        ]);
        
        setSentiment(sentimentData);
        setMatchData(liveMatch);
        
        // Get prediction for the match
        if (liveMatch?.metadata?.match_id) {
          const predictionData = await apiClient.getPrediction(liveMatch.metadata.match_id);
          setPrediction(predictionData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-8 h-screen overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Real-time match insights, sentiment analysis, and AI predictions</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Match Prediction */}
            {prediction && matchData && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <Target className="text-emerald-500" size={24} />
                    AI Match Prediction
                  </h2>
                  <div className="h-[1px] bg-slate-800 flex-1 ml-6"></div>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/20 to-blue-900/20 p-8 rounded-2xl border border-emerald-500/30">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-4">{matchData.metadata.teams.team1.name}</h3>
                      <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${prediction.team1WinProbability * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-3xl font-bold text-blue-400">
                        {(prediction.team1WinProbability * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-400 mt-1">Win Probability</div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-4">{matchData.metadata.teams.team2.name}</h3>
                      <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-600"
                          style={{ width: `${prediction.team2WinProbability * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-3xl font-bold text-purple-400">
                        {(prediction.team2WinProbability * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-400 mt-1">Win Probability</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white">Key Factors</h4>
                      <span className="text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                        {prediction.confidence}% Confidence
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {prediction.keyFactors.map((factor: string, index: number) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-slate-400 text-sm mt-4 italic">{prediction.explanation}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Social Sentiment Analysis */}
            {sentiment && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <MessageCircle className="text-pink-500" size={24} />
                    Social Sentiment Analysis
                  </h2>
                  <div className="h-[1px] bg-slate-800 flex-1 ml-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Positive</span>
                      <ThumbsUp className="text-green-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-green-400">
                      {(sentiment.sentiment.positive * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-900/20 to-slate-800/20 p-6 rounded-xl border border-slate-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Neutral</span>
                      <BarChart3 className="text-slate-400" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-slate-400">
                      {(sentiment.sentiment.neutral * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 rounded-xl border border-red-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Negative</span>
                      <TrendingUp className="text-red-500 rotate-180" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-red-400">
                      {(sentiment.sentiment.negative * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Trending Hashtags */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-6">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Hash className="text-blue-400" size={20} />
                    Trending Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sentiment.hashtags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium hover:bg-blue-500/30 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    <span className="font-semibold text-white">{sentiment.mentions.toLocaleString()}</span> mentions in the last hour
                  </div>
                </div>

                {/* Top Tweets */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                  <h3 className="font-semibold text-white mb-4">Top Fan Reactions</h3>
                  <div className="space-y-4">
                    {sentiment.topTweets.slice(0, 3).map((tweet: any) => (
                      <div key={tweet.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-300 text-sm mb-3">{tweet.text}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>❤️ {tweet.likes.toLocaleString()}</span>
                          <span>🔁 {tweet.retweets.toLocaleString()}</span>
                          <span className={`ml-auto px-2 py-1 rounded ${
                            tweet.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                            tweet.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {tweet.sentiment}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <RightSidebar />
    </div>
  );
}
