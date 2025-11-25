'use client';

import { useState, useEffect } from 'react';
import { Bell, Trophy, TrendingUp } from "lucide-react";
import { apiClient } from '../lib/api-client';

export default function RightSidebar() {
  const [pointsTableData, setPointsTableData] = useState<any[]>([]);
  const [topScorer, setTopScorer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [points, scorers] = await Promise.all([
          apiClient.getPointsTable(),
          apiClient.getTopScorers(),
        ]);
        
        setPointsTableData(points);
        setTopScorer(scorers[0]); // Get the top scorer
        setLoading(false);
      } catch (error) {
        console.error('Error loading sidebar data:', error);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-80 bg-[#0f172a] h-screen flex flex-col border-l border-slate-800 fixed right-0 top-0 p-6 overflow-y-auto z-50">
      <div className="flex justify-end gap-4 mb-8 items-center">
        <button className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-800"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600">
             <div className="w-full h-full bg-slate-600 flex items-center justify-center text-white text-xs">User</div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Points Table
            </h3>
            <div className="h-[1px] bg-slate-800 flex-1 ml-4"></div>
        </div>
        
        {loading ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-center">
            <p className="text-slate-400">Loading...</p>
          </div>
        ) : pointsTableData.length > 0 ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs text-slate-400 font-semibold p-3">Team</th>
                  <th className="text-center text-xs text-slate-400 font-semibold p-3">P</th>
                  <th className="text-center text-xs text-slate-400 font-semibold p-3">W</th>
                  <th className="text-center text-xs text-slate-400 font-semibold p-3">Pts</th>
                </tr>
              </thead>
              <tbody>
                {pointsTableData.map((team, index) => (
                  <tr key={index} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="text-sm text-white font-medium p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">{team.position}</span>
                        <span>{team.team}</span>
                      </div>
                    </td>
                    <td className="text-center text-sm text-slate-300 p-3">{team.played}</td>
                    <td className="text-center text-sm text-emerald-400 font-semibold p-3">{team.won}</td>
                    <td className="text-center text-sm text-yellow-400 font-bold p-3">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-center">
            <p className="text-slate-400">No data available</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-orange-500" />
              Orange Cap
            </h3>
            <div className="h-[1px] bg-slate-800 flex-1 ml-4"></div>
        </div>
        
        {loading ? (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-5 relative overflow-hidden h-36 flex items-center shadow-lg">
            <div className="z-10 relative">
                <div className="text-white/90 font-bold text-sm uppercase tracking-wider mb-1">Loading...</div>
            </div>
          </div>
        ) : topScorer ? (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-5 relative overflow-hidden shadow-lg">
            <div className="z-10 relative">
                <div className="text-white/90 font-bold text-xs uppercase tracking-wider mb-1">Top Scorer</div>
                <div className="text-white font-black text-2xl italic drop-shadow-md mb-2">{topScorer.playerName}</div>
                <div className="flex items-center gap-4 text-white/90">
                  <div>
                    <div className="text-3xl font-bold">{topScorer.runs}</div>
                    <div className="text-xs opacity-80">Runs</div>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div>
                    <div className="text-xl font-bold">{topScorer.strikeRate.toFixed(1)}</div>
                    <div className="text-xs opacity-80">SR</div>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div>
                    <div className="text-xl font-bold">{topScorer.fours}/{topScorer.sixes}</div>
                    <div className="text-xs opacity-80">4s/6s</div>
                  </div>
                </div>
                <div className="text-white/70 text-xs mt-3">{topScorer.team}</div>
            </div>
            <div className="absolute right-0 bottom-0 h-40 w-32 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-5 relative overflow-hidden h-36 flex items-center shadow-lg">
            <div className="z-10 relative">
                <div className="text-white/90 font-bold text-sm uppercase tracking-wider mb-1">No Data</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
