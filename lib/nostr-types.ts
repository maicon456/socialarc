export interface NostrEvent {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

export interface NostrProfile {
  pubkey: string
  name?: string
  about?: string
  picture?: string
  nip05?: string
  banner?: string
  website?: string
  lud16?: string
}

export interface NostrRelay {
  url: string
  read: boolean
  write: boolean
  status: "connected" | "connecting" | "disconnected"
}

export interface NostrMessage {
  id: string
  pubkey: string
  content: string
  created_at: number
  tags: string[][]
  kind: number
}

export interface NostrIdentity {
  privateKey: string
  publicKey: string
  npub: string
  profile?: NostrProfile
}

export const EVENT_KINDS = {
  SET_METADATA: 0,
  TEXT_NOTE: 1,
  RECOMMEND_RELAY: 2,
  CONTACTS: 3,
  ENCRYPTED_DIRECT_MESSAGE: 4,
  DELETE: 5,
  REPOST: 6,
  REACTION: 7,
  CHANNEL_CREATE: 40,
  CHANNEL_METADATA: 41,
  CHANNEL_MESSAGE: 42,
  CHANNEL_HIDE_MESSAGE: 43,
  CHANNEL_MUTE_USER: 44,
} as const
