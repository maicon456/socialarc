'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Repeat, MessageSquare, X } from 'lucide-react';
import { Event } from '@/lib/events';
import { shortAddress } from '@/lib/wallet';

interface FeedProps {
  feed: Event[];
  wallet: string | null;
  onLike: (eventId: string) => void;
  onBoost: (eventId: string) => void;
  onReply: (eventId: string, text: string) => Promise<void>;
}

export default function Feed({ feed, wallet, onLike, onBoost, onReply }: FeedProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = async (eventId: string) => {
    if (!replyText.trim()) return;
    await onReply(eventId, replyText);
    setReplyText('');
    setReplyingTo(null);
  };

  // Filter out reaction and boost events from main feed, show them as interactions
  const mainEvents = feed.filter((e) => e.type !== 'reaction' && e.type !== 'boost');
  const reactions = feed.filter((e) => e.type === 'reaction');
  const boosts = feed.filter((e) => e.type === 'boost');

  // Group interactions by target event
  const eventInteractions: Record<string, { likes: number; boosts: number }> = {};
  reactions.forEach((r) => {
    const target = (r as any).target || r.id;
    if (!eventInteractions[target]) eventInteractions[target] = { likes: 0, boosts: 0 };
    eventInteractions[target].likes++;
  });
  boosts.forEach((b) => {
    const target = b.boostOf || b.id;
    if (!eventInteractions[target]) eventInteractions[target] = { likes: 0, boosts: 0 };
    eventInteractions[target].boosts++;
  });

  return (
    <div className="space-y-3">
      {mainEvents.map((event) => {
        const interactions = eventInteractions[event.id] || { likes: 0, boosts: 0 };
        const totalLikes = (event.likes || 0) + interactions.likes;
        const totalBoosts = (event.boosts || 0) + interactions.boosts;

        return (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            {event.replyTo && (
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                <MessageSquare size={12} />
                <span>Respondendo a {shortAddress(event.author)}</span>
              </div>
            )}
            {event.boostOf && (
              <div className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                <Repeat size={12} />
                <span>Boost de {shortAddress(event.author)}</span>
              </div>
            )}

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-medium flex-shrink-0">
                {(event.author || '').slice(2, 4).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">
                      {shortAddress(event.author || event.id)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(event.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  {event.ipfsUri && (
                    <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      IPFS
                    </div>
                  )}
                </div>

                {event.body && (
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {event.body}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => onLike(event.id)}
                    className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors disabled:opacity-50"
                    disabled={!wallet}
                    title="Curtir"
                  >
                    <Heart size={16} className={totalLikes > 0 ? 'fill-red-500 text-red-500' : ''} />{' '}
                    <span>{totalLikes}</span>
                  </button>
                  <button
                    onClick={() => onBoost(event.id)}
                    className="flex items-center gap-2 text-sm hover:text-blue-500 transition-colors disabled:opacity-50"
                    disabled={!wallet}
                    title="Boost"
                  >
                    <Repeat size={16} className={totalBoosts > 0 ? 'fill-blue-500 text-blue-500' : ''} />{' '}
                    <span>{totalBoosts}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === event.id ? null : event.id)}
                    className="flex items-center gap-2 text-sm hover:text-green-500 transition-colors disabled:opacity-50"
                    disabled={!wallet}
                    title="Responder"
                  >
                    <MessageSquare size={16} /> <span>{event.replies || 0}</span>
                  </button>
                </div>

                {replyingTo === event.id && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <textarea
                      className="w-full p-2 rounded border resize-none text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                      placeholder="Escreva sua resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      maxLength={280}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-slate-500">{replyText.length}/280</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="text-xs px-3 py-1 text-slate-600 hover:text-slate-800"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleReply(event.id)}
                          disabled={!replyText.trim()}
                          className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Responder
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        );
      })}

      {mainEvents.length === 0 && (
        <div className="text-center text-slate-500 py-8">
          Nenhuma publicação ainda — seja o primeiro a postar!
        </div>
      )}
    </div>
  );
}










