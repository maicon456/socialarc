'use client';

import { motion } from 'framer-motion';
import { Heart, Repeat, MessageSquare } from 'lucide-react';
import { Event } from '@/lib/events';
import { shortAddress } from '@/lib/wallet';

interface FeedProps {
  feed: Event[];
  wallet: string | null;
  onLike: (eventId: string) => void;
}

export default function Feed({ feed, wallet, onLike }: FeedProps) {
  return (
    <div className="space-y-3">
      {feed.map((event) => (
        <motion.article
          key={event.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-medium">
              {(event.author || '').slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-sm">
                    {shortAddress(event.author || event.id)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(event.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="text-xs text-slate-400">{event.ipfsUri ? 'IPFS' : '—'}</div>
              </div>

              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{event.body}</p>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => onLike(event.id)}
                  className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
                  disabled={!wallet}
                >
                  <Heart size={14} /> <span>{event.likes || 0}</span>
                </button>
                <button className="flex items-center gap-2 text-sm hover:text-blue-500 transition-colors">
                  <Repeat size={14} /> <span>Boost</span>
                </button>
                <button className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors">
                  <MessageSquare size={14} /> <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      ))}

      {feed.length === 0 && (
        <div className="text-center text-slate-500 py-8">
          Nenhuma publicação ainda — seja o primeiro a postar!
        </div>
      )}
    </div>
  );
}










