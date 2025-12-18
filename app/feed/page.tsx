"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { NetworkStatusBadge } from "@/components/network-status-badge"
import { useWeb3 } from "@/contexts/web3-context"
import { getAllPostsFromChain, type OnChainPost } from "@/lib/blockchain-social"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeedPage() {
  const [posts, setPosts] = useState<OnChainPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isConnected } = useWeb3()

  async function loadPosts() {
    try {
      setIsRefreshing(true)
      const blockchainPosts = await getAllPostsFromChain()
      setPosts(blockchainPosts)
    } catch (error) {
      console.error("[Feed] Error loading posts:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Load posts on mount and when connection status changes
    // Posts are visible to everyone, even without wallet connection
    loadPosts()
  }, [isConnected])

  // Auto-refresh posts every 30 seconds to show new posts
  useEffect(() => {
    const interval = setInterval(() => {
      loadPosts()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      loadPosts()
    }
    
    window.addEventListener('posts-refresh', handleRefresh)
    return () => window.removeEventListener('posts-refresh', handleRefresh)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-2xl flex-1 px-4 py-8">
        <div className="space-y-6">
          {/* Network Status */}
          <NetworkStatusBadge />

          {/* Create Post */}
          <CreatePost />

          {/* Feed Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">On-Chain Feed</h2>
              <span className="text-sm text-muted-foreground">All interactions cost gas in USDC</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPosts}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to publish on-chain!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
