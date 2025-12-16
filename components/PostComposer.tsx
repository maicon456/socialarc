'use client';

import { Send } from 'lucide-react';
import { shortAddress } from '@/lib/wallet';

interface Profile {
  address: string;
  handle: string;
  bio: string;
}

interface PostComposerProps {
  profile: Profile | null;
  input: string;
  sending: boolean;
  onInputChange: (value: string) => void;
  onPost: () => Promise<void>;
}

export default function PostComposer({
  profile,
  input,
  sending,
  onInputChange,
  onPost,
}: PostComposerProps) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-medium">
          {profile ? profile.handle.slice(0, 2).toUpperCase() : 'G'}
        </div>
        <div className="flex-1">
          <textarea
            className="w-full p-3 rounded-lg border resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="O que está acontecendo no seu projeto Web3?"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            maxLength={280}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500">{input.length}/280</div>
            <div className="flex items-center gap-2">
              <button
                onClick={onPost}
                disabled={sending || !input.trim()}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} /> <span>{sending ? 'Postando...' : 'Postar no Web3'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










