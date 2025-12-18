import { ethers } from 'ethers'

// Helper function to get provider and signer
async function getProviderAndSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask ou carteira EVM não detectada')
  }

  const provider = new ethers.BrowserProvider(window.ethereum, 'any')
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return { provider, signer, address }
}

// Follow system using localStorage (can be upgraded to on-chain later)
// For now, we'll use a simple localStorage-based system

export interface FollowRelation {
  follower: string
  following: string
  timestamp: number
}

const FOLLOW_STORAGE_KEY = 'arcnet_follows'

/**
 * Follow a user
 */
export async function followUser(userAddress: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Must be called from browser')
  }

  const { address } = await getProviderAndSigner()
  
  if (address.toLowerCase() === userAddress.toLowerCase()) {
    throw new Error('Cannot follow yourself')
  }

  const follows = getFollows()
  const followKey = `${address.toLowerCase()}-${userAddress.toLowerCase()}`
  
  if (follows[followKey]) {
    throw new Error('Already following this user')
  }

  follows[followKey] = {
    follower: address.toLowerCase(),
    following: userAddress.toLowerCase(),
    timestamp: Date.now(),
  }

  localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(follows))
}

/**
 * Unfollow a user
 */
export async function unfollowUser(userAddress: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Must be called from browser')
  }

  const { address } = await getProviderAndSigner()
  const follows = getFollows()
  const followKey = `${address.toLowerCase()}-${userAddress.toLowerCase()}`
  
  if (!follows[followKey]) {
    throw new Error('Not following this user')
  }

  delete follows[followKey]
  localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(follows))
}

/**
 * Check if current user is following another user
 */
export async function isFollowing(userAddress: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    const { address } = await getProviderAndSigner()
    const follows = getFollows()
    const followKey = `${address.toLowerCase()}-${userAddress.toLowerCase()}`
    return !!follows[followKey]
  } catch {
    return false
  }
}

/**
 * Get all users that current user is following
 */
export async function getFollowing(): Promise<string[]> {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const { address } = await getProviderAndSigner()
    const follows = getFollows()
    const following: string[] = []
    
    for (const key in follows) {
      if (follows[key].follower.toLowerCase() === address.toLowerCase()) {
        following.push(follows[key].following)
      }
    }
    
    return following
  } catch {
    return []
  }
}

/**
 * Get all followers of a user
 */
export async function getFollowers(userAddress: string): Promise<string[]> {
  if (typeof window === 'undefined') {
    return []
  }

  const follows = getFollows()
  const followers: string[] = []
  
  for (const key in follows) {
    if (follows[key].following.toLowerCase() === userAddress.toLowerCase()) {
      followers.push(follows[key].follower)
    }
  }
  
  return followers
}

function getFollows(): Record<string, FollowRelation> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = localStorage.getItem(FOLLOW_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

