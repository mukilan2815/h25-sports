
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';

interface MatchCardProps {
  match: any; // Using any for simplicity with the mock data structure
}

export default function MatchCard({ match }: MatchCardProps) {
  const team1 = match.teams.team1;
  const team2 = match.teams.team2;
  const currentInnings = match.innings.find((i: any) => i.number === 2) || match.innings[0];
  const isLive = match.result.status === 'simulated_partial';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-lg hover:shadow-emerald-900/20 transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          {isLive && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>}
          {isLive ? 'Live Now' : 'Finished'}
        </span>
        <span className="text-xs text-slate-400">{match.format} • {match.venue}</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center w-1/3">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2 text-2xl font-bold text-white">
            {team1.name.substring(0, 1)}
          </div>
          <h3 className="font-bold text-lg text-white">{team1.name}</h3>
          <p className="text-slate-400 text-sm">
            {match.innings[0].total_runs}/{match.innings[0].total_wickets} <span className="text-xs">({match.innings[0].total_overs})</span>
          </p>
        </div>

        <div className="text-center w-1/3">
          <div className="text-3xl font-bold text-white mb-1">VS</div>
          <p className="text-xs text-emerald-400 font-medium">{match.result.note.split('.')[0]}</p>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2 text-2xl font-bold text-white">
            {team2.name.substring(0, 1)}
          </div>
          <h3 className="font-bold text-lg text-white">{team2.name}</h3>
          <p className="text-slate-400 text-sm">
             {currentInnings.total_runs}/{currentInnings.total_wickets} <span className="text-xs">({currentInnings.total_overs})</span>
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
        <div className="text-sm text-slate-400">
          <span className="text-slate-300 font-medium">Target:</span> {match.innings[0].target}
        </div>
        <Link 
          href={`/match/${match.match_id}`} 
          className="flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          View Full Scorecard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
