import { SOCIAL_CONTRACT_ADDRESS, GAS_FEES, SOCIAL_CONTRACT_ABI } from "./social-contract"
import { callContractFunction } from "./transaction"
import { ethers } from "ethers"
import { ARC_LINKS, ARCNET_CONFIG } from "./web3-config"

export { GAS_FEES, ARC_LINKS }

export interface OnChainPost {
  id: string
  author: string
  content: string
  contentType: "text" | "image" | "video" | "mixed"
  mediaUrls: string[]
  timestamp: number
  likes: number
  comments: number
  shares: number
  txHash?: string
}

export interface PostInteraction {
  postId: string
  user: string
  type: "like" | "comment" | "share"
  timestamp: number
  txHash: string
}

// Note: Content is now stored directly in the contract's contentHash field
// No need for localStorage - all users can read content from the blockchain
// This ensures posts are visible to everyone, not just the creator

// Create a post on the blockchain
export async function createPostOnChain(
  content: string,
  mediaUrls: string[],
  contentType: string,
): Promise<{ postId: string; txHash: string }> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contrato não configurado. Por favor, configure o endereço do contrato.")
  }

  try {
    console.log("[Blockchain] Criando post na blockchain Arc...")
    console.log("[Blockchain] Conteúdo:", content.substring(0, 50) + "...")
    console.log("[Blockchain] Tipo de conteúdo:", contentType)
    console.log("[Blockchain] Media URLs:", mediaUrls.length)
    console.log("[Blockchain] Taxa estimada:", GAS_FEES.createPost, "USDC")

    // Store content DIRECTLY in contract's contentHash field
    // This ensures ALL users can see the content, not just the creator
    // Format: content text (media URLs are stored separately in mediaUrls array)
    const contentHash = content.trim() // Store content directly, not a hash
    
    // Call contract function
    // The contract stores: contentHash (content text), contentType, and mediaUrls array
    // This way, all users can read the full post from the blockchain
    const result = await callContractFunction(
      SOCIAL_CONTRACT_ADDRESS,
      SOCIAL_CONTRACT_ABI,
      "createPost",
      [contentHash, contentType, mediaUrls], // Store content directly in contract
      0n // No value sent
    )

    console.log("[Blockchain] Post criado! Hash da transação:", result.hash)
    console.log("[Blockchain] Bloco:", result.receipt.blockNumber)

    // Extract postId from event
    let postId = timestamp.toString() // Fallback
    
    // Try to get postId from event logs
    if (result.receipt.logs) {
      const contract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, SOCIAL_CONTRACT_ABI, result.receipt)
      const iface = contract.interface
      
      for (const log of result.receipt.logs) {
        try {
          const parsedLog = iface.parseLog(log)
          if (parsedLog && parsedLog.name === "PostCreated") {
            postId = parsedLog.args.postId.toString()
            console.log("[Blockchain] PostId from event:", postId)
            break
          }
        } catch (e) {
          // Not the event we're looking for
        }
      }
    }

    return { postId, txHash: result.hash }
  } catch (error: any) {
    console.error("[Blockchain] Falha ao criar post:", error)
    throw new Error(error.message || "Falha ao criar post na blockchain")
  }
}

// Content is now stored directly in the contract
// Use getAllPostsFromChain() or getPost() to retrieve content
// This ensures all users can see all posts

// Like a post on the blockchain
export async function likePostOnChain(postId: string): Promise<string> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contrato não configurado. Por favor, configure o endereço do contrato.")
  }

  try {
    const postIdBigInt = BigInt(postId)

    console.log("[Blockchain] Curtindo post na blockchain...")
    console.log("[Blockchain] Post ID:", postId)
    console.log("[Blockchain] Taxa estimada:", GAS_FEES.likePost, "USDC")

    const result = await callContractFunction(
      SOCIAL_CONTRACT_ADDRESS,
      SOCIAL_CONTRACT_ABI,
      "likePost",
      [postIdBigInt],
      0n
    )

    console.log("[Blockchain] Post curtido! Hash da transação:", result.hash)
    return result.hash
  } catch (error: any) {
    console.error("[Blockchain] Falha ao curtir post:", error)
    throw new Error(error.message || "Falha ao curtir post")
  }
}

// Unlike a post on the blockchain
export async function unlikePostOnChain(postId: string): Promise<string> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contrato não configurado. Por favor, configure o endereço do contrato.")
  }

  try {
    const postIdBigInt = BigInt(postId)

    console.log("[Blockchain] Descurtindo post na blockchain...")
    console.log("[Blockchain] Post ID:", postId)

    const result = await callContractFunction(
      SOCIAL_CONTRACT_ADDRESS,
      SOCIAL_CONTRACT_ABI,
      "unlikePost",
      [postIdBigInt],
      0n
    )

    console.log("[Blockchain] Post descurtido! Hash da transação:", result.hash)
    return result.hash
  } catch (error: any) {
    console.error("[Blockchain] Falha ao descurtir post:", error)
    throw new Error(error.message || "Falha ao descurtir post")
  }
}

// Add a comment on the blockchain
export async function commentOnChain(postId: string, content: string): Promise<string> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contrato não configurado. Por favor, configure o endereço do contrato.")
  }

  try {
    const postIdBigInt = BigInt(postId)

    console.log("[Blockchain] Adicionando comentário na blockchain...")
    console.log("[Blockchain] Post ID:", postId)
    console.log("[Blockchain] Taxa estimada:", GAS_FEES.comment, "USDC")

    const result = await callContractFunction(
      SOCIAL_CONTRACT_ADDRESS,
      SOCIAL_CONTRACT_ABI,
      "addComment",
      [postIdBigInt, content],
      0n
    )

    console.log("[Blockchain] Comentário adicionado! Hash da transação:", result.hash)
    return result.hash
  } catch (error: any) {
    console.error("[Blockchain] Falha ao adicionar comentário:", error)
    throw new Error(error.message || "Falha ao adicionar comentário")
  }
}

// Share a post on the blockchain
export async function sharePostOnChain(postId: string): Promise<string> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    throw new Error("Contrato não configurado. Por favor, configure o endereço do contrato.")
  }

  try {
    const postIdBigInt = BigInt(postId)

    console.log("[Blockchain] Compartilhando post na blockchain...")
    console.log("[Blockchain] Post ID:", postId)
    console.log("[Blockchain] Taxa estimada:", GAS_FEES.share, "USDC")

    const result = await callContractFunction(
      SOCIAL_CONTRACT_ADDRESS,
      SOCIAL_CONTRACT_ABI,
      "sharePost",
      [postIdBigInt],
      0n
    )

    console.log("[Blockchain] Post compartilhado! Hash da transação:", result.hash)
    return result.hash
  } catch (error: any) {
    console.error("[Blockchain] Falha ao compartilhar post:", error)
    throw new Error(error.message || "Falha ao compartilhar post")
  }
}

// These functions are no longer needed as we use callContractFunction
// Keeping for backwards compatibility if needed

// Check if user has liked a post
export async function hasUserLikedPost(postId: string, userAddress: string): Promise<boolean> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return false
  }

  try {
    const { provider } = await getProviderAndSigner()
    const contract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, SOCIAL_CONTRACT_ABI, provider)
    const postIdBigInt = BigInt(postId)
    const hasLiked = await contract.hasLiked(postIdBigInt, userAddress)
    return hasLiked
  } catch (error) {
    console.error("[Blockchain] Error checking like status:", error)
    return false
  }
}

// Get all posts from the blockchain
// This function works even without wallet connection - uses read-only provider
export async function getAllPostsFromChain(): Promise<OnChainPost[]> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.warn("[Blockchain] Contract not configured, returning empty posts")
    return []
  }

  try {
    // Use read-only provider - works even without wallet connection
    // This ensures ALL users can see posts, not just those with connected wallets
    let provider: ethers.BrowserProvider | ethers.JsonRpcProvider
    
    if (typeof window !== 'undefined' && window.ethereum) {
      // Use browser provider if available
      provider = new ethers.BrowserProvider(window.ethereum, 'any')
    } else {
      // Use public RPC as fallback (read-only)
      provider = new ethers.JsonRpcProvider(ARCNET_CONFIG.rpcUrls[0])
    }
    
    const contract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, SOCIAL_CONTRACT_ABI, provider)
    
    // Get all post IDs
    const postIds = await contract.getAllPosts()
    
    if (postIds.length === 0) {
      return []
    }

    // Fetch all posts in parallel
    const postsPromises = postIds.map(async (postId: bigint) => {
      try {
        const post = await contract.getPost(postId)
        
        // Convert BigInt to number for timestamp
        const timestamp = Number(post.timestamp) * 1000 // Convert to milliseconds
        
        // Content is stored directly in contentHash field
        // Media URLs are stored separately in mediaUrls array
        // This ensures ALL users can see the full post content
        const displayContent = post.contentHash || ""
        const displayMediaUrls = post.mediaUrls || []
        
        return {
          id: postId.toString(),
          author: post.author,
          content: displayContent, // Content is directly readable from contract
          contentType: post.contentType as "text" | "image" | "video" | "mixed",
          mediaUrls: displayMediaUrls, // Media URLs from contract
          timestamp: timestamp,
          likes: Number(post.likes),
          comments: Number(post.comments),
          shares: Number(post.shares),
          txHash: undefined, // Can be added if needed
        } as OnChainPost
      } catch (error) {
        console.error(`[Blockchain] Error fetching post ${postId}:`, error)
        return null
      }
    })

    const posts = await Promise.all(postsPromises)
    
    // Filter out null posts and sort by timestamp (newest first)
    const validPosts = posts.filter((post): post is OnChainPost => post !== null)
    validPosts.sort((a, b) => b.timestamp - a.timestamp)
    
    console.log(`[Blockchain] Fetched ${validPosts.length} posts from blockchain`)
    return validPosts
  } catch (error: any) {
    console.error("[Blockchain] Error fetching posts:", error)
    // Return empty array on error instead of throwing
    return []
  }
}

// Get comments for a post
export interface OnChainComment {
  id: string
  postId: string
  commenter: string
  content: string
  timestamp: number
}

export async function getPostComments(postId: string): Promise<OnChainComment[]> {
  if (SOCIAL_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return []
  }

  try {
    // Use read-only provider - works even without wallet connection
    let provider: ethers.BrowserProvider | ethers.JsonRpcProvider
    
    if (typeof window !== 'undefined' && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum, 'any')
    } else {
      provider = new ethers.JsonRpcProvider(ARCNET_CONFIG.rpcUrls[0])
    }
    
    const contract = new ethers.Contract(SOCIAL_CONTRACT_ADDRESS, SOCIAL_CONTRACT_ABI, provider)
    const postIdBigInt = BigInt(postId)
    
    const comments = await contract.getPostComments(postIdBigInt)
    
    return comments.map((comment: any) => ({
      id: comment.id.toString(),
      postId: postId,
      commenter: comment.commenter,
      content: comment.content,
      timestamp: Number(comment.timestamp) * 1000, // Convert to milliseconds
    }))
  } catch (error) {
    console.error("[Blockchain] Error fetching comments:", error)
    return []
  }
}

// Helper function to get provider and signer (reuse from transaction.ts)
async function getProviderAndSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask ou carteira EVM não detectada')
  }

  const provider = new ethers.BrowserProvider(window.ethereum, 'any')
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return { provider, signer, address }
}

