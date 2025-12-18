import { ethers } from 'ethers'
import { SOCIAL_CONTRACT_ADDRESS, SOCIAL_CONTRACT_ABI } from './social-contract'
import { callContractFunction } from './transaction'
import { uploadMediaToStorage } from './media-storage'
import { ARCNET_CONFIG } from './web3-config'

export interface OnChainProfile {
  address: string
  name: string
  bio: string
  avatarUrl: string
  github?: string
  twitter?: string
  website?: string
  stack: string[]
  timestamp: number
}

// Store profile data on-chain using a special post format
// This allows all users to see profiles
export async function createProfileOnChain(
  name: string,
  bio: string,
  avatarFile: File | null,
  github?: string,
  twitter?: string,
  website?: string,
  stack: string[] = []
): Promise<{ txHash: string }> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contrato não configurado. Por favor, configure o endereço do contrato.")
  }

  try {
    console.log("[Profile] Criando perfil on-chain...")
    
    // Upload avatar if provided - this ensures it's saved permanently
    let avatarUrl = ""
    if (avatarFile) {
      console.log("[Profile] Fazendo upload do avatar...")
      try {
        const mediaUrls = await uploadMediaToStorage([avatarFile])
        avatarUrl = mediaUrls[0] || ""
        console.log("[Profile] Avatar URL:", avatarUrl)
        console.log("[Profile] Avatar saved permanently for all users to see")
      } catch (error) {
        console.error("[Profile] Error uploading avatar:", error)
        throw new Error("Failed to upload avatar image")
      }
    }

    // Create profile data JSON
    const profileData = {
      name,
      bio,
      avatarUrl,
      github: github || "",
      twitter: twitter || "",
      website: website || "",
      stack,
      timestamp: Date.now(),
    }

    // Store profile as a special content type "profile"
    // Format: JSON string with profile data
    const profileContent = JSON.stringify(profileData)
    
    console.log("[Profile] Criando transação on-chain...")
    console.log("[Profile] Taxa estimada: ~0.01 USDC")

    // Call contract function to store profile
    const result = await callContractFunction(
      SOCIAL_CONTRACT_ADDRESS,
      SOCIAL_CONTRACT_ABI,
      "createPost",
      [profileContent, "profile", avatarUrl ? [avatarUrl] : []],
      0n
    )

    console.log("[Profile] Perfil criado! Hash da transação:", result.hash)
    
    // Also store in localStorage for quick access
    if (typeof window !== 'undefined') {
      const { address } = await getProviderAndSigner()
      const profiles = getStoredProfiles()
      const profileToStore: OnChainProfile = {
        address: address.toLowerCase(),
        name: (profileData.name || "").trim(),
        bio: (profileData.bio || "").trim(),
        avatarUrl: avatarUrl,
        github: (profileData.github || "").trim(),
        twitter: (profileData.twitter || "").trim(),
        website: (profileData.website || "").trim(),
        stack: Array.isArray(profileData.stack) ? profileData.stack : [],
        timestamp: profileData.timestamp || Date.now(),
      }
      
      // Ensure it's stored as an object, not a string
      profiles[address.toLowerCase()] = profileToStore
      localStorage.setItem('arcnet_profiles', JSON.stringify(profiles))
      
      // Avatar is already stored in storeMediaFiles, so it's persisted
    }

    return { txHash: result.hash }
  } catch (error: any) {
    console.error("[Profile] Falha ao criar perfil:", error)
    throw new Error(error.message || "Falha ao criar perfil na blockchain")
  }
}

// Get profile from blockchain
export async function getProfileOnChain(address: string): Promise<OnChainProfile | null> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return null
  }

  try {
    // First check localStorage for quick access
    if (typeof window !== 'undefined') {
      const profiles = getStoredProfiles()
      const cached = profiles[address.toLowerCase()]
      if (cached) {
        // Ensure it's a proper object, not a string
        if (typeof cached === 'object' && cached !== null && 'name' in cached) {
          return cached
        }
      }
    }

    // Get from blockchain - search user's posts for profile type
    let provider: ethers.BrowserProvider | ethers.JsonRpcProvider
    
    if (typeof window !== 'undefined' && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum, 'any')
    } else {
      provider = new ethers.JsonRpcProvider(ARCNET_CONFIG.rpcUrls[0])
    }
    
    const contract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, SOCIAL_CONTRACT_ABI, provider)
    
    // Get user's posts - with error handling
    let userPostIds: bigint[] = []
    try {
      userPostIds = await contract.getUserPosts(address)
    } catch (error: any) {
      // If getUserPosts fails, try to get all posts and filter by author
      console.warn("[Profile] getUserPosts failed, trying alternative method:", error.message)
      try {
        const allPostIds = await contract.getAllPosts()
        // Filter posts by author (this is less efficient but works as fallback)
        const filteredPosts: bigint[] = []
        for (const postId of allPostIds) {
          try {
            const post = await contract.getPost(postId)
            if (post.author.toLowerCase() === address.toLowerCase()) {
              filteredPosts.push(postId)
            }
          } catch {
            // Skip posts that fail to fetch
            continue
          }
        }
        userPostIds = filteredPosts
      } catch (fallbackError) {
        console.error("[Profile] Failed to get user posts:", fallbackError)
        return null
      }
    }
    
    if (userPostIds.length === 0) {
      return null
    }

    // Find the most recent profile post
    let latestProfile: OnChainProfile | null = null
    let latestTimestamp = 0

    for (const postId of userPostIds) {
      try {
        const post = await contract.getPost(postId)
        
        // Check if this is a profile post
        if (post.contentType === "profile") {
          const timestamp = Number(post.timestamp) * 1000
          
          if (timestamp > latestTimestamp) {
            try {
              // Parse profile data from contentHash
              let profileData: any = {}
              try {
                profileData = typeof post.contentHash === 'string' 
                  ? JSON.parse(post.contentHash) 
                  : post.contentHash
              } catch (e) {
                // If parsing fails, try to extract from string
                if (typeof post.contentHash === 'string' && post.contentHash.includes('name')) {
                  profileData = JSON.parse(post.contentHash)
                } else {
                  console.error("[Profile] Invalid profile data format:", post.contentHash)
                  continue
                }
              }
              
              latestProfile = {
                address: address.toLowerCase(),
                name: profileData.name || "",
                bio: profileData.bio || "",
                avatarUrl: profileData.avatarUrl || post.mediaUrls[0] || "",
                github: profileData.github || "",
                twitter: profileData.twitter || "",
                website: profileData.website || "",
                stack: profileData.stack || [],
                timestamp: timestamp,
              }
              latestTimestamp = timestamp
            } catch (e) {
              console.error("[Profile] Error parsing profile data:", e)
            }
          }
        }
      } catch (error) {
        console.error(`[Profile] Error fetching post ${postId}:`, error)
      }
    }

    // Cache in localStorage - ensure it's a proper object
    if (latestProfile && typeof window !== 'undefined') {
      const profiles = getStoredProfiles()
      // Ensure latestProfile is a proper object
      if (latestProfile && typeof latestProfile === 'object' && 'name' in latestProfile) {
        profiles[address.toLowerCase()] = latestProfile
        localStorage.setItem('arcnet_profiles', JSON.stringify(profiles))
      }
    }

    return latestProfile
  } catch (error: any) {
    console.error("[Profile] Error fetching profile:", error)
    return null
  }
}

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

function getStoredProfiles(): Record<string, OnChainProfile> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const stored = localStorage.getItem('arcnet_profiles')
    if (!stored) return {}
    
    const parsed = JSON.parse(stored)
    // Clean up any corrupted data - ensure all values are objects, not strings
    const cleaned: Record<string, OnChainProfile> = {}
    for (const key in parsed) {
      const value = parsed[key]
      if (typeof value === 'string') {
        try {
          const parsedValue = JSON.parse(value)
          if (parsedValue && typeof parsedValue === 'object' && 'name' in parsedValue) {
            cleaned[key] = parsedValue as OnChainProfile
          }
        } catch {
          // Skip corrupted entries
          continue
        }
      } else if (value && typeof value === 'object' && value !== null && 'name' in value) {
        // Ensure it's a proper OnChainProfile object
        if (typeof value.name === 'string') {
          cleaned[key] = value as OnChainProfile
        }
      }
    }
    return cleaned
  } catch {
    return {}
  }
}

