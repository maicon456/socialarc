export const SOCIAL_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "contentHash", type: "string" },
      { internalType: "string", name: "contentType", type: "string" },
      { internalType: "string[]", name: "mediaUrls", type: "string[]" },
    ],
    name: "createPost",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "postId", type: "uint256" }],
    name: "likePost",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "postId", type: "uint256" }],
    name: "unlikePost",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "postId", type: "uint256" },
      { internalType: "string", name: "content", type: "string" },
    ],
    name: "addComment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "postId", type: "uint256" }],
    name: "sharePost",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "postId", type: "uint256" }],
    name: "getPost",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "author", type: "address" },
          { internalType: "string", name: "contentHash", type: "string" },
          { internalType: "string", name: "contentType", type: "string" },
          { internalType: "string[]", name: "mediaUrls", type: "string[]" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint256", name: "likes", type: "uint256" },
          { internalType: "uint256", name: "comments", type: "uint256" },
          { internalType: "uint256", name: "shares", type: "uint256" },
        ],
        internalType: "struct SocialFeed.Post",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPosts",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "postId", type: "uint256" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "hasLiked",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "postId", type: "uint256" }],
    name: "getPostComments",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "postId", type: "uint256" },
          { internalType: "address", name: "commenter", type: "address" },
          { internalType: "string", name: "content", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct SocialFeed.Comment[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserPosts",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "postId", type: "uint256" },
      { indexed: true, internalType: "address", name: "author", type: "address" },
      { indexed: false, internalType: "string", name: "contentHash", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "PostCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "postId", type: "uint256" },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "PostLiked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "postId", type: "uint256" },
      { indexed: true, internalType: "address", name: "commenter", type: "address" },
      { indexed: false, internalType: "string", name: "content", type: "string" },
    ],
    name: "CommentAdded",
    type: "event",
  },
] as const

// Social Feed Contract Address - deployed on Arc Network Testnet
// Set via NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS environment variable
export const SOCIAL_CONTRACT_ADDRESS = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS) || 
  "0xB48AF341BceF5573D9FBDf13e13309ED85450375" // Fallback to deployed address

// Gas fees in USDC (Arc Network uses USDC as gas token)
export const GAS_FEES = {
  createPost: "0.01", // 0.01 USDC
  likePost: "0.001", // 0.001 USDC
  comment: "0.005", // 0.005 USDC
  share: "0.002", // 0.002 USDC
}
