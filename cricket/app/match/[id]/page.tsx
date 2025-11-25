
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { ArrowLeft, Share2, BarChart2, MessageSquare, Activity, Zap, Shield, Eye, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PersonalizedCommentary from '../../components/PersonalizedCommentary';

import Sidebar from '../../components/Sidebar';
import RightSidebar from '../../components/RightSidebar';

export default function MatchDetails() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('scorecard');
  const [match, setMatch] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [physics, setPhysics] = useState<any[]>([]);
  const [fielders, setFielders] = useState<any[]>([]);
  const [umpire, setUmpire] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [matchData, statsData, physicsData, fieldersData, umpireData, equipmentData] = await Promise.all([
          apiClient.getLiveMatchSummary(),
          apiClient.getMatchStatistics(10),
          apiClient.getPhysicsFeed(10),
          apiClient.getFielderFeed(),
          apiClient.getUmpireDecisions(),
          apiClient.getEquipmentSensor()
        ]);
        
        setMatch((matchData as any).metadata);
        setStats(statsData as any);
        setPhysics(physicsData as any);
        setFielders(fieldersData as any);
        setUmpire(umpireData as any);
        setEquipment(equipmentData as any);
      } catch (error) {
        console.error('Error loading match data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !match) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading match data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white font-sans flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 mr-80 p-8 h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 -mx-8 px-8 pt-4 pb-0 mb-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Link>
              <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
               <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="text-right">
                     <h2 className="text-2xl font-bold text-white">{match.teams.team1.name}</h2>
                     <p className="text-slate-400">{match.innings[0].total_runs}/{match.innings[0].total_wickets} ({match.innings[0].total_overs})</p>
                  </div>
                  <div className="text-2xl font-bold text-slate-600">VS</div>
                  <div>
                     <h2 className="text-2xl font-bold text-white">{match.teams.team2.name}</h2>
                     <p className="text-slate-400">{match.innings[1].total_runs}/{match.innings[1].total_wickets} ({match.innings[1].total_overs})</p>
                  </div>
               </div>
               <div className="text-center md:text-right">
                  <div className="text-emerald-400 font-bold mb-1">{match.result.note.split('.')[0]}</div>
                  <div className="text-xs text-slate-500">
                    Target: {match.innings[0].target}
                    {stats[0]?.chase_stats && (
                      <>
                        {' • CRR: '}{stats[0].chase_stats.current_run_rate.toFixed(2)}
                        {' • RRR: '}{stats[0].chase_stats.required_run_rate.toFixed(2)}
                      </>
                    )}
                  </div>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 overflow-x-auto">
               {['scorecard', 'commentary', 'analysis', 'predictions', 'advanced'].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`pb-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                        activeTab === tab 
                        ? 'border-emerald-500 text-emerald-400' 
                        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto pb-8 pt-4">
           {activeTab === 'scorecard' && <ScorecardView match={match} />}
           {activeTab === 'commentary' && <CommentaryView stats={stats} />}
           {activeTab === 'analysis' && <AnalysisView match={match} />}
           {activeTab === 'predictions' && <PredictionsView stats={stats} />}
           {activeTab === 'advanced' && (
             <AdvancedView 
               physics={physics} 
               fielders={fielders} 
               umpire={umpire} 
               equipment={equipment} 
             />
           )}
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}

function ScorecardView({ match }: { match: any }) {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Batting Card */}
         <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
               <h3 className="font-bold text-white">Batting</h3>
               <span className="text-xs text-slate-400">Australia (1st Innings)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-500 bg-slate-800/30 uppercase">
                    <tr>
                       <th className="px-6 py-3">Batter</th>
                       <th className="px-6 py-3 text-right">R</th>
                       <th className="px-6 py-3 text-right">B</th>
                       <th className="px-6 py-3 text-right">4s</th>
                       <th className="px-6 py-3 text-right">6s</th>
                       <th className="px-6 py-3 text-right">SR</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {match.top_scorers.map((player: any, idx: number) => (
                       <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{player.player}</td>
                          <td className="px-6 py-4 text-right font-bold text-white">{player.runs}</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.balls}</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.fours || '-'}</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.sixes || '-'}</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.strike_rate}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>

         {/* Bowling Card */}
         <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
               <h3 className="font-bold text-white">Bowling</h3>
               <span className="text-xs text-slate-400">England</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-500 bg-slate-800/30 uppercase">
                    <tr>
                       <th className="px-6 py-3">Bowler</th>
                       <th className="px-6 py-3 text-right">O</th>
                       <th className="px-6 py-3 text-right">M</th>
                       <th className="px-6 py-3 text-right">R</th>
                       <th className="px-6 py-3 text-right">W</th>
                       <th className="px-6 py-3 text-right">ECO</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {match.top_wicket_takers.map((player: any, idx: number) => (
                       <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{player.player}</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.overs || '-'}</td>
                          <td className="px-6 py-4 text-right text-slate-400">-</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.runs}</td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-400">{player.wickets}</td>
                          <td className="px-6 py-4 text-right text-slate-400">{player.economy}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>
      </div>
   );
}

function CommentaryView({ stats }: { stats: any[] }) {
   return (
      <div className="max-w-3xl mx-auto space-y-4">
         {/* Personalized Commentary */}
         {stats[0] && (
           <PersonalizedCommentary 
              event={stats[0]} 
              userPreferences={{
                 favoriteHero: 'iron-man',
                 musicGenre: 'rock',
                 style: 'dynamic'
              }}
           />
         )}
         
         {/* Regular Commentary */}
         {stats.map((event, idx) => (
            <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-4">
               <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-sm font-bold text-emerald-400">{event.over_number}.{event.ball_number}</div>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">{event.sub_type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                     {event.sub_type === 'boundary_scored' && `FOUR! What a shot!`}
                     {event.sub_type === 'wicket_fall' && `OUT! Clean bowled! The stumps are flying.`}
                     {event.sub_type === 'chase_progress' && event.chase_stats && `England needs ${event.chase_stats.runs_needed} runs from ${event.chase_stats.balls_remaining} balls.`}
                     {event.sub_type === 'team_milestone' && `50 Partnership up for England!`}
                  </p>
               </div>
            </div>
         ))}
      </div>
   );
}

function AnalysisView({ match }: { match: any }) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <BarChart2 className="w-5 h-5 text-emerald-400" /> Run Rate Comparison
            </h3>
            <div className="h-64 flex items-center justify-center text-slate-500">
               Visualization coming from backend data
            </div>
         </div>
         <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Activity className="w-5 h-5 text-emerald-400" /> Match Momentum
            </h3>
            <div className="h-64 flex items-center justify-center text-slate-500">
               Momentum Graph Visualization
            </div>
         </div>
      </div>
   );
}

function PredictionsView({ stats }: { stats: any[] }) {
   const winProb = stats[0]?.chase_stats?.win_probability || { england: 0.5, australia: 0.5 };
   return (
      <div className="max-w-3xl mx-auto">
         <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Win Probability</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
               <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">{Math.round(winProb.australia * 100)}%</div>
                  <div className="text-sm text-slate-400">Australia</div>
               </div>
               <div className="w-64 h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${winProb.australia * 100}%` }}></div>
                  <div className="h-full bg-blue-500" style={{ width: `${winProb.england * 100}%` }}></div>
               </div>
               <div className="text-left">
                  <div className="text-3xl font-bold text-blue-400">{Math.round(winProb.england * 100)}%</div>
                  <div className="text-sm text-slate-400">England</div>
               </div>
            </div>
            <p className="text-slate-400 text-sm">
               Based on current run rate, wickets in hand, and historical data at Melbourne Cricket Ground.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
               <h4 className="font-bold text-white mb-2">Projected Score</h4>
               <div className="text-4xl font-bold text-white mb-1">{stats[0]?.chase_stats?.projected_score || 180}</div>
               <p className="text-xs text-slate-500">Predicted final score for England</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
               <h4 className="font-bold text-white mb-2">Key Factor</h4>
               <div className="text-lg font-medium text-emerald-400 mb-1">Middle Overs Spin</div>
               <p className="text-xs text-slate-500">England's performance against Zampa will be crucial.</p>
            </div>
         </div>
      </div>
   );
}

function AdvancedView({ physics, fielders, umpire, equipment }: { physics: any[], fielders: any[], umpire: any[], equipment: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Physics Feed */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" /> Ball Physics
        </h3>
        <div className="space-y-4">
          {physics.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Speed</span>
                <span className="text-white font-bold">{item.speed_kph} kph</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Spin</span>
                <span className="text-white font-bold">{item.spin_rpm} rpm</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Trajectory: {item.trajectory_data?.pitch_point?.x}, {item.trajectory_data?.pitch_point?.y}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Sensors */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" /> Smart Equipment
        </h3>
        <div className="space-y-4">
          {equipment.slice(0, 3).map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Bat Speed</span>
                <span className="text-white font-bold">{item.bat_speed_kph} kph</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Impact Force</span>
                <span className="text-white font-bold">{item.impact_force_newtons} N</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(item.timing_index || 0) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-500 mt-1">Timing Index</div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Positions */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" /> Field Positions
        </h3>
        <div className="relative h-64 bg-green-900/20 rounded-lg border border-green-900/50 flex items-center justify-center overflow-hidden">
           {/* Simple Field Visualization */}
           <div className="absolute w-48 h-48 rounded-full border-2 border-white/10"></div>
           <div className="absolute w-12 h-32 bg-yellow-900/20 border border-yellow-900/40"></div>
           
           {fielders.slice(0, 5).map((fielder, idx) => (
             <div 
               key={idx}
               className="absolute w-3 h-3 bg-white rounded-full text-[8px] flex items-center justify-center font-bold text-slate-900 cursor-help"
               style={{ 
                 top: `${50 + (Math.random() * 80 - 40)}%`, 
                 left: `${50 + (Math.random() * 80 - 40)}%` 
               }}
               title={fielder.player_id}
             >
               {fielder.player_id.substring(0,1)}
             </div>
           ))}
           <div className="absolute bottom-2 right-2 text-xs text-slate-500">Live Field Map</div>
        </div>
      </div>

      {/* Umpire Decisions / DRS */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-400" /> DRS & Umpire
        </h3>
        <div className="space-y-3">
          {umpire.slice(0, 3).map((decision, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <div className={`w-2 h-full self-stretch rounded-full ${
                decision.decision === 'out' ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
              <div>
                <div className="text-sm font-bold text-white uppercase">{decision.decision_type}</div>
                <div className="text-xs text-slate-400">
                  {decision.umpire_name} • {decision.confidence_score}% Confidence
                </div>
              </div>
              <div className="ml-auto text-xs font-bold px-2 py-1 bg-slate-700 rounded text-white">
                {decision.decision.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
