// Nostr relay URLs
export const NOSTR_RELAYS = [
  "wss://relay.damus.io",
  "wss://relay.nostr.band",
  "wss://nos.lol",
  "wss://relay.snort.social",
]

// Simple websocket manager for Nostr
export class NostrClient {
  private relays: WebSocket[] = []
  private subscriptions: Map<string, (event: any) => void> = new Map()

  async connect(relayUrls: string[] = NOSTR_RELAYS) {
    for (const url of relayUrls) {
      try {
        const ws = new WebSocket(url)
        ws.onopen = () => console.log(`[v0] Connected to Nostr relay: ${url}`)
        ws.onmessage = (msg) => this.handleMessage(msg)
        ws.onerror = (err) => console.error(`[v0] Nostr relay error: ${url}`, err)
        this.relays.push(ws)
      } catch (error) {
        console.error(`[v0] Failed to connect to ${url}:`, error)
      }
    }
  }

  private handleMessage(msg: MessageEvent) {
    try {
      const data = JSON.parse(msg.data)
      const [type, subId, event] = data

      if (type === "EVENT" && event) {
        const callback = this.subscriptions.get(subId)
        if (callback) callback(event)
      }
    } catch (error) {
      console.error("[v0] Error parsing Nostr message:", error)
    }
  }

  subscribe(filters: any[], callback: (event: any) => void): string {
    const subId = Math.random().toString(36).substring(7)
    this.subscriptions.set(subId, callback)

    const subscriptionMsg = JSON.stringify(["REQ", subId, ...filters])
    this.relays.forEach((relay) => {
      if (relay.readyState === WebSocket.OPEN) {
        relay.send(subscriptionMsg)
      }
    })

    return subId
  }

  unsubscribe(subId: string) {
    this.subscriptions.delete(subId)
    const closeMsg = JSON.stringify(["CLOSE", subId])
    this.relays.forEach((relay) => {
      if (relay.readyState === WebSocket.OPEN) {
        relay.send(closeMsg)
      }
    })
  }

  async publish(event: any) {
    const publishMsg = JSON.stringify(["EVENT", event])
    this.relays.forEach((relay) => {
      if (relay.readyState === WebSocket.OPEN) {
        relay.send(publishMsg)
      }
    })
  }

  disconnect() {
    this.relays.forEach((relay) => relay.close())
    this.relays = []
    this.subscriptions.clear()
  }
}

// Create Nostr event
export function createNostrEvent(pubkey: string, kind: number, content: string, tags: string[][] = []): any {
  return {
    pubkey,
    created_at: Math.floor(Date.now() / 1000),
    kind,
    tags,
    content,
  }
}

// Decode Nostr public key
export function decodeNpub(npub: string): string | null {
  try {
    // Simple validation - in production use proper nostr-tools library
    if (!npub.startsWith("npub1")) return null
    return npub // Simplified for demo
  } catch {
    return null
  }
}

// Format Nostr pubkey
export function formatPubkey(pubkey: string): string {
  if (pubkey.length < 16) return pubkey
  return `${pubkey.slice(0, 8)}...${pubkey.slice(-8)}`
}
