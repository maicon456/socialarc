'use client';

import { ethers } from 'ethers';
import { shortAddress } from '@/lib/wallet';

interface Profile {
  address: string;
  handle: string;
  bio: string;
}

interface SidebarProps {
  profile: Profile | null;
  wallet: string | null;
  onConnectWallet: () => Promise<void>;
}

export default function Sidebar({ profile, wallet, onConnectWallet }: SidebarProps) {
  return (
    <aside className="col-span-3">
      <div className="sticky top-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-white font-bold">
              N
            </div>
            <div>
              <div className="font-semibold">{profile ? profile.handle : 'Convidado'}</div>
              <div className="text-xs text-slate-500">
                {profile ? profile.bio : 'Conecte sua carteira'}
              </div>
            </div>
          </div>

          <div className="mt-4">
            {!wallet ? (
              <button
                onClick={onConnectWallet}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Conectar carteira
              </button>
            ) : (
              <div className="text-xs text-slate-500">Conectado: {shortAddress(wallet)}</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-600">Canais</div>
          <div className="mt-3 flex flex-col gap-2">
            {['#dev', '@arcnet', '#ipfs', '#contracts', '#nfts'].map((channel) => (
              <button
                key={channel}
                className="text-sm text-left px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}










