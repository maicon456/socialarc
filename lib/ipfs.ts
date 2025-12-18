import { IPFS_GATEWAY, IPFS_API_URL } from './config';

export interface IPFSUploadResult {
  uri: string;
  cid?: string;
  gatewayUrl?: string;
}

/**
 * Upload content to IPFS
 * Supports real Pinata integration or mock for development
 */
// Access environment variables safely in Next.js client components
function getEnvVar(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  // @ts-ignore - Next.js injects NEXT_PUBLIC_* vars at build time
  return process.env[key];
}

export async function uploadToIPFS(text: string): Promise<IPFSUploadResult> {
  const apiKey = getEnvVar('NEXT_PUBLIC_PINATA_API_KEY');
  const secretKey = getEnvVar('NEXT_PUBLIC_PINATA_SECRET_KEY');

  // Try real Pinata upload if credentials are available
  if (apiKey && secretKey && IPFS_API_URL.includes('pinata')) {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
        body: JSON.stringify({
          pinataContent: {
            content: text,
            timestamp: Date.now(),
          },
          pinataMetadata: {
            name: `post-${Date.now()}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const cid = data.IpfsHash;
      const uri = `ipfs://${cid}`;
      const gatewayUrl = `${IPFS_GATEWAY}${cid}`;

      return { uri, cid, gatewayUrl };
    } catch (error) {
      console.warn('Pinata upload failed, falling back to mock:', error);
      // Fall through to mock implementation
    }
  }

  // Mock implementation for development
  // Generates a deterministic "CID" based on content hash
  const contentHash = await hashContent(text);
  const mockCid = 'Qm' + contentHash.slice(0, 42); // Simulated IPFS CID format
  const uri = `ipfs://${mockCid}`;
  const gatewayUrl = `${IPFS_GATEWAY}${mockCid}`;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return { uri, cid: mockCid, gatewayUrl };
}

/**
 * Hash content for mock CID generation
 */
async function hashContent(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get IPFS gateway URL from IPFS URI
 */
export function getIPFSURL(uri: string): string {
  if (!uri || !uri.startsWith('ipfs://')) return '';
  const cid = uri.replace('ipfs://', '');
  return `${IPFS_GATEWAY}${cid}`;
}

/**
 * Fetch content from IPFS
 */
export async function fetchFromIPFS(uri: string): Promise<string | null> {
  if (!uri || !uri.startsWith('ipfs://')) return null;

  try {
    const url = getIPFSURL(uri);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content || data.text || JSON.stringify(data);
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    return null;
  }
}










