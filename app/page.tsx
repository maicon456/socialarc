'use client';

import { useEffect, useState, useRef } from 'react';
import { ethers } from 'ethers';
import Sidebar from '@/components/Sidebar';
import PostComposer from '@/components/PostComposer';
import Feed from '@/components/Feed';
import RightSidebar from '@/components/RightSidebar';
import NetworkStatus from '@/components/NetworkStatus';
import { MockRelay } from '@/lib/relay';
import { makeEvent, Event, sampleRemoteText } from '@/lib/events';
import { uploadToIPFS } from '@/lib/ipfs';
import {
  signEventWithEthereumMessage,
  shortAddress,
  connectWalletWithArcnet,
} from '@/lib/wallet';
import { switchToArcnet, isArcnetNetwork } from '@/lib/network';
import { MOCK_RELAY_WS } from '@/lib/config';

interface Profile {
  address: string;
  handle: string;
  bio: string;
}

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [feed, setFeed] = useState<Event[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const relayRef = useRef<MockRelay | null>(null);
  const feedRef = useRef<Event[]>([]);

  useEffect(() => {
    // Initialize relay
    const relay = new MockRelay(MOCK_RELAY_WS);
    relay.onMessage(handleRelayMessage);
    relayRef.current = relay;

    // Load cached feed if any
    const cached = localStorage.getItem('arcnet_nostr_feed_v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setFeed(parsed);
        feedRef.current = parsed;
      } catch (e) {
        console.error('Error loading cached feed:', e);
      }
    }

    // Load cached profile
    const cachedProfile = localStorage.getItem('arcnet_nostr_profile');
    if (cachedProfile) {
      try {
        const parsed = JSON.parse(cachedProfile);
        setProfile(parsed);
        if (parsed.address) {
          setWallet(parsed.address);
        }
      } catch (e) {
        console.error('Error loading cached profile:', e);
      }
    }

    return () => {
      relay.disconnect();
    };
  }, []);

  function handleRelayMessage(msg: { type: string; payload?: Event }) {
    if (msg.type === 'event' && msg.payload) {
      feedRef.current = [msg.payload, ...feedRef.current].slice(0, 200); // keep max 200
      setFeed([...feedRef.current]);
      localStorage.setItem('arcnet_nostr_feed_v1', JSON.stringify(feedRef.current));
    }
  }

  async function connectWallet() {
    try {
      // Connect wallet and switch to Arcnet testnet
      const { provider, address } = await connectWalletWithArcnet();

      setProvider(provider);
      setWallet(address);

      // Verify network
      const isArcnet = await isArcnetNetwork();
      if (!isArcnet) {
        console.warn('Não está conectado à rede Arcnet testnet');
      }

      // Set default profile
      const pObj: Profile = {
        address,
        handle: shortAddress(address),
        bio: 'Dev on Arcnet testnet',
      };
      setProfile(pObj);
      localStorage.setItem('arcnet_nostr_profile', JSON.stringify(pObj));
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      alert('Erro conectando a carteira: ' + (err.message || err));
    }
  }

  async function post() {
    if (!provider || !wallet) {
      alert('Conecte sua carteira');
      return;
    }
    if (!input.trim()) return;
    setSending(true);
    try {
      // 1) Upload to IPFS (body only)
      const ipfs = await uploadToIPFS(input.trim());

      // 2) Build event payload (like nostr)
      const payload = {
        author: wallet,
        body: input.trim(),
        ipfs: ipfs.uri,
        ts: Date.now(),
      };

      // 3) Sign payload with wallet
      const signature = await signEventWithEthereumMessage(provider, wallet, payload);

      // 4) Create event object and publish to relay
      const event = makeEvent(wallet, input.trim(), ipfs.uri, signature);
      relayRef.current?.publish(event);

      // 5) Optionally write on-chain (store hash) — not implemented, placeholder here
      // await writeEventOnChain(event.id, ipfs.uri);

      // Clear input and optimistic update
      setInput('');
    } catch (err: any) {
      console.error(err);
      alert('Erro ao postar: ' + (err.message || err));
    } finally {
      setSending(false);
    }
  }

  function like(eventId: string) {
    if (!wallet) {
      alert('Conecte sua carteira para curtir');
      return;
    }
    // For Nostr-style, likes are another signed event (reaction). Here we just update local state and publish a reaction event.
    const reaction = {
      type: 'reaction',
      target: eventId,
      author: wallet,
      ts: Date.now(),
    };
    // Sign reaction (omitted for brevity)
    // Publish to relay so other clients see it
    relayRef.current?.publish({
      ...reaction,
      id: 'r-' + Math.random().toString(36).slice(2, 9),
      body: '',
      ipfsUri: null,
      signature: null,
      timestamp: new Date().toISOString(),
    });
    // Optimistic local update: increment likes counter on feed items
    feedRef.current = feedRef.current.map((f) =>
      f.id === eventId ? { ...f, likes: (f.likes || 0) + 1 } : f
    );
    setFeed([...feedRef.current]);
  }

  // Simple realtime ticker to simulate other people posting
  useEffect(() => {
    const t = setInterval(() => {
      // 8% chance to emit a mock remote post
      if (Math.random() < 0.08) {
        const remote = makeEvent(
          '0x' + Math.random().toString(16).slice(2, 10),
          'Remote tip: ' + sampleRemoteText(),
          null,
          null
        );
        relayRef.current?._emit({ type: 'event', payload: remote });
      }
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-12 gap-4 p-4">
        <Sidebar profile={profile} wallet={wallet} onConnectWallet={connectWallet} />

        <main className="col-span-6">
          <NetworkStatus wallet={wallet} />
          
          <PostComposer
            profile={profile}
            input={input}
            sending={sending}
            onInputChange={setInput}
            onPost={post}
          />

          <Feed feed={feed} wallet={wallet} onLike={like} />
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}

