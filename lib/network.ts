// Arcnet Testnet Network Configuration
// Circle Arc Testnet - Update these values with official documentation

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

// Arcnet Testnet Configuration
// NOTE: Update these values with official Circle Arc testnet documentation
export const ARCNET_TESTNET: NetworkConfig = {
  chainId: '0x1A4', // 420 in decimal - Update with actual chain ID
  chainName: 'Circle Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6, // USDC uses 6 decimals
  },
  rpcUrls: [
    'https://testnet.arc.xyz/rpc', // Update with actual RPC URL
    // Add backup RPC URLs if available
  ],
  blockExplorerUrls: [
    'https://testnet-explorer.arc.xyz', // Update with actual explorer URL
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
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ARCNET_TESTNET.chainId }],
    });
    return true;
  } catch (error: any) {
    // If the chain is not added, add it first
    if (error.code === 4902) {
      return await addArcnetToMetaMask();
    }
    // User rejected the request
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a troca de rede');
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
 */
export async function isArcnetNetwork(): Promise<boolean> {
  const currentChainId = await getCurrentChainId();
  return currentChainId?.toLowerCase() === ARCNET_TESTNET.chainId.toLowerCase();
}










