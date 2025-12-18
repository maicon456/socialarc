"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { NostrClient } from "@/lib/nostr-client"
import type { NostrEvent, NostrIdentity, NostrProfile } from "@/lib/nostr-types"
import { generateKeyPair, npubEncode, signEvent } from "@/lib/nostr-crypto"

interface NostrContextType {
  identity: NostrIdentity | null
  profile: NostrProfile | null
  isConnected: boolean
  relayStatus: Array<{ url: string; status: string }>
  createIdentity: () => Promise<void>
  importIdentity: (privateKey: string) => Promise<void>
  updateProfile: (profile: Partial<NostrProfile>) => Promise<void>
  publishNote: (content: string) => Promise<void>
  subscribeToFeed: (callback: (event: NostrEvent) => void) => () => void
}

const NostrContext = createContext<NostrContextType | undefined>(undefined)

export function NostrProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<NostrIdentity | null>(null)
  const [profile, setProfile] = useState<NostrProfile | null>(null)
  const [client] = useState(() => {
    // Only create client on client side
    if (typeof window === "undefined") return null
    return new NostrClient()
  })
  const [isConnected, setIsConnected] = useState(false)
  const [relayStatus, setRelayStatus] = useState<Array<{ url: string; status: string }>>([])

  useEffect(() => {
    if (!client) return

    // Load identity from localStorage
    if (typeof window !== "undefined") {
      const savedIdentity = localStorage.getItem("nostr_identity")
      if (savedIdentity) {
        try {
          const parsed = JSON.parse(savedIdentity)
          setIdentity(parsed)
        } catch (error) {
          console.error("Failed to parse saved identity:", error)
        }
      }
    }

    // Connect to relays
    connectToRelays()

    return () => {
      client.disconnect()
    }
  }, [client])

  async function connectToRelays() {
    if (!client) return
    try {
      await client.connect()
      setIsConnected(true)
      updateRelayStatus()
    } catch (error) {
      console.error("[v0] Failed to connect to relays:", error)
    }
  }

  function updateRelayStatus() {
    if (!client) return
    const status = client.getRelayStatus()
    setRelayStatus(status)
  }

  const createIdentity = useCallback(async () => {
    const { privateKey, publicKey } = await generateKeyPair()
    const npub = npubEncode(publicKey)

    const newIdentity: NostrIdentity = {
      privateKey,
      publicKey,
      npub,
    }

    setIdentity(newIdentity)
    if (typeof window !== "undefined") {
      localStorage.setItem("nostr_identity", JSON.stringify(newIdentity))
    }
  }, [])

  const importIdentity = useCallback(async (privateKey: string) => {
    // In production, derive public key properly
    const publicKey = privateKey // Simplified
    const npub = npubEncode(publicKey)

    const newIdentity: NostrIdentity = {
      privateKey,
      publicKey,
      npub,
    }

    setIdentity(newIdentity)
    if (typeof window !== "undefined") {
      localStorage.setItem("nostr_identity", JSON.stringify(newIdentity))
    }
  }, [])

  const updateProfile = useCallback(
    async (profileData: Partial<NostrProfile>) => {
      if (!identity || !client) return

      const newProfile: NostrProfile = {
        pubkey: identity.publicKey,
        ...profile,
        ...profileData,
      }

      const event = await signEvent(
        {
          pubkey: identity.publicKey,
          created_at: Math.floor(Date.now() / 1000),
          kind: 0,
          tags: [],
          content: JSON.stringify(newProfile),
        },
        identity.privateKey,
      )

      await client.publish(event)
      setProfile(newProfile)
    },
    [identity, profile, client],
  )

  const publishNote = useCallback(
    async (content: string) => {
      if (!identity || !client) return

      const event = await signEvent(
        {
          pubkey: identity.publicKey,
          created_at: Math.floor(Date.now() / 1000),
          kind: 1,
          tags: [],
          content,
        },
        identity.privateKey,
      )

      await client.publish(event)
    },
    [identity, client],
  )

  const subscribeToFeed = useCallback(
    (callback: (event: NostrEvent) => void) => {
      if (!client) return () => {}
      const subId = client.subscribe(
        {
          kinds: [1],
          limit: 50,
        },
        callback,
      )

      return () => client.unsubscribe(subId)
    },
    [client],
  )

  return (
    <NostrContext.Provider
      value={{
        identity,
        profile,
        isConnected,
        relayStatus,
        createIdentity,
        importIdentity,
        updateProfile,
        publishNote,
        subscribeToFeed,
      }}
    >
      {children}
    </NostrContext.Provider>
  )
}

export function useNostr() {
  const context = useContext(NostrContext)
  if (context === undefined) {
    throw new Error("useNostr must be used within a NostrProvider")
  }
  return context
}
