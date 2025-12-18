import { ethers } from 'ethers';
import { switchToArcnet, isArcnetNetwork, ARCNET_TESTNET } from './network';
import { EventPayload } from './events';

/**
 * Sign event payload with Ethereum wallet
 * This mocks Nostr-style signing using Ethereum's personal_sign
 * Works with Arcnet testnet (EVM compatible)
 */
export async function signEventWithEthereumMessage(
  provider: ethers.BrowserProvider,
  address: string,
  payload: EventPayload
): Promise<string> {
  const signer = await provider.getSigner();
  const message = JSON.stringify(payload, Object.keys(payload).sort());
  const sig = await signer.signMessage(
    '\x19Ethereum Signed Message:\n' + message.length + message
  );
  return sig;
}

/**
 * Verify event signature
 */
export async function verifyEventSignature(
  address: string,
  payload: EventPayload,
  signature: string
): Promise<boolean> {
  try {
    const message = JSON.stringify(payload, Object.keys(payload).sort());
    const recoveredAddress = ethers.verifyMessage(
      '\x19Ethereum Signed Message:\n' + message.length + message,
      signature
    );
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Get balance of connected wallet
 */
export async function getWalletBalance(
  provider: ethers.BrowserProvider,
  address: string
): Promise<string> {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
}

/**
 * Connect wallet and ensure Arcnet network
 */
export async function connectWalletWithArcnet(): Promise<{
  provider: ethers.BrowserProvider;
  address: string;
}> {
  if (!window.ethereum) {
    throw new Error('Instale MetaMask ou uma carteira compatível');
  }

  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Check if already on Arcnet, if not, switch
  const isArcnet = await isArcnetNetwork();
  if (!isArcnet) {
    try {
      await switchToArcnet();
    } catch (error: any) {
      console.warn('Could not switch to Arcnet:', error.message);
      // Continue anyway - user might want to use a different network
    }
  }

  // Create provider
  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, address };
}

export function shortAddress(address: string): string {
  if (!address) return '';
  return address.slice(0, 6) + '…' + address.slice(-4);
}

