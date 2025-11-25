
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Music, Zap } from 'lucide-react';
import { apiClient } from '../lib/api-client';

interface PersonalizedCommentaryProps {
  event: any;
  userPreferences?: {
    favoriteHero?: string;
    musicGenre?: string;
    style?: string;
  };
}

export default function PersonalizedCommentary({ event, userPreferences }: PersonalizedCommentaryProps) {
  const [commentary, setCommentary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCommentary = async () => {
    if (!event) return;
    
    setIsGenerating(true);
    
    try {
      const response = await apiClient.generateCommentary(event, userPreferences || {});
      setCommentary(response.commentary || 'No commentary generated');
    } catch (error) {
      console.error('Error generating commentary:', error);
      setCommentary('Failed to generate personalized commentary. Backend service may be unavailable.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (event) {
      generateCommentary();
    }
  }, [event, userPreferences]);

  if (!event) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border-2 border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Personalized Commentary
        </h3>
        <div className="flex items-center gap-2 text-xs text-purple-400">
          <Zap className="w-4 h-4" />
          <span>AI-Generated</span>
        </div>
      </div>
      
      {isGenerating ? (
        <div className="flex items-center gap-3 text-slate-400">
          <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          <span>Crafting your personalized commentary...</span>
        </div>
      ) : (
        <p className="text-white text-lg leading-relaxed">
          {commentary}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center gap-4 text-sm">
        <div className="text-slate-400">
          <span className="text-purple-400 font-medium">Your vibe:</span>{' '}
          {userPreferences?.favoriteHero || 'Default'} × {userPreferences?.musicGenre || 'Default'}
        </div>
        <button 
          onClick={generateCommentary}
          disabled={isGenerating}
          className="ml-auto px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-xs disabled:opacity-50"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
