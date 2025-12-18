// Arc Testnet Network Configuration
// Official Arc Network Testnet - https://docs.arc.network

export interface NetworkConfig {
  chainId: string; // Hex format: 0x...
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}

// Arc Testnet Configuration
// Official values from https://docs.arc.network/arc/references/connect-to-arc
export const ARCNET_TESTNET: NetworkConfig = {
  chainId: '0x4D0A2', // 5042002 in decimal - Official Arc Testnet Chain ID
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18, // USDC on Arc uses 18 decimals (native token for gas)
  },
  rpcUrls: [
    'https://rpc.testnet.arc.network', // Official Arc Testnet RPC endpoint
  ],
  blockExplorerUrls: [
    'https://testnet.arcscan.app', // Official Arc Testnet Block Explorer
  ],
};

/**
 * Add Arcnet Testnet to MetaMask
 */
export async function addArcnetToMetaMask(): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('MetaMask não está instalado');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [ARCNET_TESTNET],
    });
    return true;
  } catch (error: any) {
    // If the chain is already added, that's fine
    if (error.code === 4902) {
      // Chain not added, but we tried
      return false;
    }
    // User rejected the request
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a adição da rede');
    }
    throw error;
  }
}

/**
 * Switch to Arcnet Testnet network
 */
export async function switchToArcnet(): Promise<boolean> {
  if (!window.ethereum) {
    throw new Error('MetaMask não está instalado');
  }

  try {
    // First check current chain
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainIdLower = currentChainId.toLowerCase();
    
    // If already on Arcnet (check both possible chain IDs), return success
    if (currentChainIdLower === ARCNET_TESTNET.chainId.toLowerCase() || 
        currentChainIdLower === '0x4cef52') {
      console.log('[Network] Already on Arc Network');
      return true;
    }

    // Try to switch to the official chain ID first
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARCNET_TESTNET.chainId }],
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (switchError: any) {
      // If switch fails, try the alternative chain ID (0x4cef52)
      if (switchError.code === 4902 || switchError.message?.includes('not added')) {
        console.log('[Network] Trying alternative Arc Network chain ID...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4cef52' }],
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('[Network] Successfully switched to Arc Network (alternative chain ID)');
          return true;
        } catch (altError: any) {
          if (altError.code === 4902) {
            throw switchError; // Throw original error to trigger add network
          }
          throw altError;
        }
      } else {
        throw switchError;
      }
    }
  } catch (error: any) {
    // If the chain is not added, try to add it first
    if (error.code === 4902 || error.message?.includes('not added')) {
      try {
        return await addArcnetToMetaMask();
      } catch (addError: any) {
        // If adding fails because network already exists with different chain ID
        if (addError.message?.includes('same RPC endpoint') || 
            addError.message?.includes('existing network')) {
          console.warn('[Network] Network already exists with different chain ID');
          // Try to switch to the existing network
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x4cef52' }],
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('[Network] Switched to existing Arc Network');
            return true;
          } catch (finalError: any) {
            throw new Error('Por favor, remova a rede Arc Network Testnet existente no MetaMask e tente novamente, ou mude manualmente para a rede Arc Network.');
          }
        }
        throw addError;
      }
    }
    // User rejected the request
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a troca de rede');
    }
    // If it's the RPC endpoint conflict error, provide helpful message
    if (error.message?.includes('same RPC endpoint') || 
        error.message?.includes('existing network')) {
      throw new Error('Já existe uma rede Arc Network no MetaMask com Chain ID diferente. Por favor, remova a rede antiga nas configurações do MetaMask ou mude manualmente para a rede Arc Network.');
    }
    throw error;
  }
}

/**
 * Get current network chain ID
 */
export async function getCurrentChainId(): Promise<string | null> {
  if (!window.ethereum) {
    return null;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId as string;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return null;
  }
}

/**
 * Check if connected to Arcnet Testnet
 * Accepts both official chain ID (0x4D0A2) and alternative (0x4cef52)
 */
export async function isArcnetNetwork(): Promise<boolean> {
  const currentChainId = await getCurrentChainId();
  if (!currentChainId) return false;
  
  const currentChainIdLower = currentChainId.toLowerCase();
  // Accept both chain IDs as valid Arc Network
  return currentChainIdLower === ARCNET_TESTNET.chainId.toLowerCase() || 
         currentChainIdLower === '0x4cef52';
}










