'use client';

import { useEffect, useState } from 'react';
import { isArcnetNetwork, switchToArcnet, ARCNET_TESTNET } from '@/lib/network';

interface NetworkStatusProps {
  wallet: string | null;
}

export default function NetworkStatus({ wallet }: NetworkStatusProps) {
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!wallet) {
      setIsCorrectNetwork(null);
      return;
    }

    checkNetwork();
    
    // Listen for network changes
    if (window.ethereum) {
      const handleChainChanged = () => {
        checkNetwork();
      };
      
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [wallet]);

  async function checkNetwork() {
    if (!window.ethereum) return;
    
    setIsChecking(true);
    try {
      const isArcnet = await isArcnetNetwork();
      setIsCorrectNetwork(isArcnet);
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleSwitchNetwork() {
    try {
      setIsChecking(true);
      await switchToArcnet();
      await checkNetwork();
    } catch (error: any) {
      alert('Erro ao trocar de rede: ' + (error.message || error));
    } finally {
      setIsChecking(false);
    }
  }

  if (!wallet || isCorrectNetwork === null) {
    return null;
  }

  if (isCorrectNetwork) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-green-700">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Conectado à Circle Arc Testnet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-yellow-700">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Você não está na rede Arcnet testnet</span>
        </div>
        <button
          onClick={handleSwitchNetwork}
          disabled={isChecking}
          className="text-xs px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
        >
          {isChecking ? 'Trocando...' : 'Trocar para Arcnet'}
        </button>
      </div>
    </div>
  );
}

