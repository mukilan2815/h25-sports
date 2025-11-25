'use client';

import { useState, useEffect } from 'react';
import { Clock, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { apiClient } from '../lib/api-client';

import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const categories = ['all', 'match report', 'news', 'analysis', 'feature', 'fan engagement'];

  useEffect(() => {
    async function loadSentiment() {
      try {
        const data = await apiClient.getCurrentSentiment();
        setSentimentData(data);
      } catch (error) {
        console.error('Error loading sentiment:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSentiment();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-8 h-screen overflow-y-auto">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 rounded-2xl mb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Latest Cricket <span className="text-emerald-400">News</span>
            </h1>
            <p className="text-slate-400 text-lg">Stay updated with breaking news, match reports, and expert analysis</p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* News Content Placeholder */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">News Content</h2>
            <p className="text-slate-400 text-lg mb-2">News articles would be fetched from backend API</p>
            <p className="text-slate-500 text-sm">Backend needs to implement news/articles endpoint</p>
          </div>
        </section>

        {/* Social Sentiment Section */}
        {!loading && sentimentData && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Social Media Buzz 🐦</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Trending Hashtags</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {sentimentData.hashtags && sentimentData.hashtags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                    {!sentimentData.hashtags && <p className="text-slate-500 text-sm">No hashtags available</p>}
                  </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Fan Sentiment</h3>
                  <div className="space-y-3 mt-4">
                    {sentimentData.sentiment && (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Positive</span>
                            <span className="text-emerald-400 font-bold">{Math.round(sentimentData.sentiment.positive * 100)}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${sentimentData.sentiment.positive * 100}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Neutral</span>
                            <span className="text-slate-400 font-bold">{Math.round(sentimentData.sentiment.neutral * 100)}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-500" style={{ width: `${sentimentData.sentiment.neutral * 100}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Negative</span>
                            <span className="text-red-400 font-bold">{Math.round(sentimentData.sentiment.negative * 100)}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${sentimentData.sentiment.negative * 100}%` }}></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Most Discussed</h3>
                  <div className="space-y-2 mt-4">
                    {sentimentData.trending && sentimentData.trending.map((player: any) => (
                      <div key={player.player} className="flex justify-between items-center">
                        <span className="text-slate-300">{player.player}</span>
                        <span className="text-xs text-emerald-400 font-bold">{player.mentions} mentions</span>
                      </div>
                    ))}
                    {!sentimentData.trending && <p className="text-slate-500 text-sm">No trending data</p>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <RightSidebar />
    </div>
  );
}
