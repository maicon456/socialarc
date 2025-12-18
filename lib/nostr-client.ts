import type { NostrEvent, NostrRelay } from "./nostr-types"

export class NostrClient {
  private relays: Map<string, WebSocket> = new Map()
  private subscriptions: Map<string, Set<(event: NostrEvent) => void>> = new Map()

  constructor(
    private relayUrls: string[] = [
      "wss://relay.damus.io",
      "wss://relay.nostr.band",
      "wss://nos.lol",
      "wss://relay.snort.social",
    ],
  ) {}

  async connect(): Promise<void> {
    const promises = this.relayUrls.map((url) => this.connectRelay(url))
    await Promise.allSettled(promises)
  }

  private connectRelay(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(url)

        ws.onopen = () => {
          this.relays.set(url, ws)
          console.log(`[v0] Connected to relay: ${url}`)
          resolve()
        }

        ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data)
            this.handleMessage(data)
          } catch (error) {
            console.error(`[v0] Failed to parse message from ${url}:`, error)
          }
        }

        ws.onerror = (error) => {
          console.error(`[v0] Relay error ${url}:`, error)
          reject(error)
        }

        ws.onclose = () => {
          this.relays.delete(url)
          console.log(`[v0] Disconnected from relay: ${url}`)
        }

        // Timeout after 5 seconds
        setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close()
            reject(new Error(`Connection timeout: ${url}`))
          }
        }, 5000)
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(data: any) {
    if (!Array.isArray(data)) return

    const [type, subId, event] = data

    if (type === "EVENT" && event) {
      const callbacks = this.subscriptions.get(subId)
      if (callbacks) {
        callbacks.forEach((callback) => callback(event as NostrEvent))
      }
    }
  }

  subscribe(filters: Record<string, any>, callback: (event: NostrEvent) => void): string {
    const subId = Math.random().toString(36).substring(7)

    if (!this.subscriptions.has(subId)) {
      this.subscriptions.set(subId, new Set())
    }
    this.subscriptions.get(subId)!.add(callback)

    const reqMessage = JSON.stringify(["REQ", subId, filters])

    this.relays.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(reqMessage)
      }
    })

    return subId
  }

  unsubscribe(subId: string) {
    this.subscriptions.delete(subId)

    const closeMessage = JSON.stringify(["CLOSE", subId])
    this.relays.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(closeMessage)
      }
    })
  }

  async publish(event: NostrEvent): Promise<void> {
    const eventMessage = JSON.stringify(["EVENT", event])

    const promises = Array.from(this.relays.values()).map((ws) => {
      return new Promise<void>((resolve) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(eventMessage)
          resolve()
        } else {
          resolve()
        }
      })
    })

    await Promise.all(promises)
  }

  disconnect() {
    this.relays.forEach((ws) => ws.close())
    this.relays.clear()
    this.subscriptions.clear()
  }

  getRelayStatus(): NostrRelay[] {
    return this.relayUrls.map((url) => ({
      url,
      read: true,
      write: true,
      status: this.relays.has(url) ? "connected" : "disconnected",
    }))
  }
}
