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
    
    // Upload avatar if provided
    let avatarUrl = ""
    if (avatarFile) {
      console.log("[Profile] Fazendo upload do avatar...")
      const mediaUrls = await uploadMediaToStorage([avatarFile])
      avatarUrl = mediaUrls[0] || ""
      console.log("[Profile] Avatar URL:", avatarUrl)
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
      profiles[address.toLowerCase()] = {
        ...profileData,
        address: address.toLowerCase(),
        txHash: result.hash,
      }
      localStorage.setItem('arcnet_profiles', JSON.stringify(profiles))
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
        return cached
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
    
    // Get user's posts
    const userPostIds = await contract.getUserPosts(address)
    
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
              const profileData = JSON.parse(post.contentHash)
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

    // Cache in localStorage
    if (latestProfile && typeof window !== 'undefined') {
      const profiles = getStoredProfiles()
      profiles[address.toLowerCase()] = latestProfile
      localStorage.setItem('arcnet_profiles', JSON.stringify(profiles))
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
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

