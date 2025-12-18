export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  githubUrl: string
  imageUrl?: string
  tags: string[]
  ipfsHash: string
  author: string
  authorAddress: string
  createdAt: number
  upvotes: number
  commentCount: number
}

export interface Comment {
  id: string
  projectId: string
  author: string
  authorAddress: string
  content: string
  createdAt: number
  upvotes: number
  isAcceptedSolution: boolean
  replies: Comment[]
}

export interface Service {
  id: string
  title: string
  description: string
  category: string
  price: string
  duration: string
  stack: string[]
  provider: string
  providerAddress: string
  createdAt: number
  rating: number
  completedJobs: number
}

export interface Developer {
  address: string
  name: string
  bio: string
  stack: string[]
  socialLinks: {
    github?: string
    twitter?: string
    website?: string
    nostr?: string
  }
  profileHash: string
  reputation: number
  projectsPublished: number
  solutionsAccepted: number
  servicesCompleted: number
  joinedAt: number
  badges: ReputationBadge[]
}

export interface ReputationBadge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: number
  category: "contribution" | "expertise" | "community" | "achievement"
}

export interface NostrProfile {
  pubkey: string
  name?: string
  about?: string
  picture?: string
  nip05?: string
}

export interface NostrMessage {
  id: string
  pubkey: string
  content: string
  created_at: number
  tags: string[][]
}
