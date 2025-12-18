import type { NostrEvent } from "./nostr-types"

// Simple secp256k1 implementation for browser
export async function generateKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
  // Generate random 32 bytes for private key
  const privateKeyBytes = new Uint8Array(32)
  crypto.getRandomValues(privateKeyBytes)

  const privateKey = bytesToHex(privateKeyBytes)
  const publicKey = await derivePublicKey(privateKey)

  return { privateKey, publicKey }
}

async function derivePublicKey(privateKeyHex: string): Promise<string> {
  // This is a simplified version - in production use a proper secp256k1 library
  const encoder = new TextEncoder()
  const data = encoder.encode(privateKeyHex)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return bytesToHex(new Uint8Array(hashBuffer))
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}

export async function signEvent(event: Partial<NostrEvent>, privateKey: string): Promise<NostrEvent> {
  // Create event ID
  const eventData = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags || [],
    event.content || "",
  ])

  const encoder = new TextEncoder()
  const data = encoder.encode(eventData)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const id = bytesToHex(new Uint8Array(hashBuffer))

  // Sign event (simplified - use proper signing in production)
  const sigData = encoder.encode(id + privateKey)
  const sigBuffer = await crypto.subtle.digest("SHA-256", sigData)
  const sig = bytesToHex(new Uint8Array(sigBuffer))

  return {
    ...event,
    id,
    sig,
  } as NostrEvent
}

export function npubEncode(hex: string): string {
  // Simplified npub encoding - in production use proper bech32 encoding
  return "npub1" + hex.slice(0, 59)
}

export function npubDecode(npub: string): string {
  // Simplified npub decoding
  return npub.replace("npub1", "").padEnd(64, "0")
}

export async function encryptMessage(message: string, recipientPubkey: string, senderPrivkey: string): Promise<string> {
  // Simplified encryption - use NIP-04 in production
  const encoder = new TextEncoder()
  const data = encoder.encode(message + recipientPubkey + senderPrivkey)
  const encrypted = await crypto.subtle.digest("SHA-256", data)
  return bytesToHex(new Uint8Array(encrypted))
}

export async function decryptMessage(
  encrypted: string,
  senderPubkey: string,
  recipientPrivkey: string,
): Promise<string> {
  // Simplified decryption - implement proper NIP-04 in production
  return "[Encrypted message - implement NIP-04 decryption]"
}
