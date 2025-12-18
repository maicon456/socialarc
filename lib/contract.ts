import { ethers } from 'ethers';

// Simple ABI for ArcnetNostr contract
export const ARCNET_NOSTR_ABI = [
  'function registerEvent(string memory eventId, string memory ipfsUri) external',
  'function getEvent(string memory eventId) external view returns (tuple(string eventId, address author, string ipfsUri, uint256 timestamp, bool exists))',
  'function getUserEvents(address user) external view returns (string[] memory)',
  'function eventExists(string memory eventId) external view returns (bool)',
  'event EventRegistered(string indexed eventId, address indexed author, string ipfsUri, uint256 timestamp)',
] as const;

// Contract address - deployed on Arc Network Testnet
// Access environment variables safely in Next.js
export const ARCNET_NOSTR_ADDRESS = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) || 
  '0xe22C09345E1c8DF663143B5e931AcaCFd814182B'; // Fallback to deployed address

/**
 * Get contract instance
 */
export function getContract(provider: ethers.BrowserProvider) {
  if (!ARCNET_NOSTR_ADDRESS) {
    throw new Error('Contract address not configured');
  }
  return new ethers.Contract(ARCNET_NOSTR_ADDRESS, ARCNET_NOSTR_ABI, provider);
}

/**
 * Register event on-chain
 */
export async function registerEventOnChain(
  provider: ethers.BrowserProvider,
  eventId: string,
  ipfsUri: string
): Promise<string> {
  try {
    const contract = getContract(provider);
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.registerEvent(eventId, ipfsUri);
    const receipt = await tx.wait();

    return receipt.hash;
  } catch (error: any) {
    console.error('Error registering event on-chain:', error);
    throw new Error(`Failed to register event: ${error.message || error}`);
  }
}

/**
 * Check if event is registered on-chain
 */
export async function isEventRegistered(
  provider: ethers.BrowserProvider,
  eventId: string
): Promise<boolean> {
  try {
    if (!ARCNET_NOSTR_ADDRESS) return false;
    const contract = getContract(provider);
    return await contract.eventExists(eventId);
  } catch (error) {
    console.error('Error checking event registration:', error);
    return false;
  }
}

/**
 * Get user's registered events
 */
export async function getUserRegisteredEvents(
  provider: ethers.BrowserProvider,
  userAddress: string
): Promise<string[]> {
  try {
    if (!ARCNET_NOSTR_ADDRESS) return [];
    const contract = getContract(provider);
    return await contract.getUserEvents(userAddress);
  } catch (error) {
    console.error('Error getting user events:', error);
    return [];
  }
}

