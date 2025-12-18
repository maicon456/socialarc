// Arc Network Configuration
// Official Arc Testnet - https://docs.arc.network
export const ARCNET_RPC = process.env.NEXT_PUBLIC_ARCNET_RPC || 'https://rpc.testnet.arc.network';
export const MOCK_RELAY_WS = process.env.NEXT_PUBLIC_RELAY_WS || 'wss://mock-relay.example/ws';

// IPFS Configuration (when implementing real IPFS)
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
export const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://api.pinata.cloud'; // Example: Pinata

