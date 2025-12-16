import { IPFS_GATEWAY } from './config';

/**
 * Mock IPFS upload function
 * Replace this with real IPFS/Pinata/Arweave upload in production
 */
export async function uploadToIPFS(text: string): Promise<{ uri: string }> {
  // TODO: Replace with real IPFS implementation
  // Example with Pinata:
  // const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
  //     'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
  //   },
  //   body: JSON.stringify({ content: text }),
  // });
  // const data = await response.json();
  // return { uri: `ipfs://${data.IpfsHash}` };

  // Mock implementation
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ uri: 'ipfs://mocked-cid/' + btoa(text).slice(0, 8) }),
      600
    )
  );
}

export function getIPFSURL(uri: string): string {
  if (!uri || !uri.startsWith('ipfs://')) return '';
  const cid = uri.replace('ipfs://', '');
  return `${IPFS_GATEWAY}${cid}`;
}










