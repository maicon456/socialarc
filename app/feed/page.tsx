"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { NetworkStatusBadge } from "@/components/network-status-badge"
import { useWeb3 } from "@/contexts/web3-context"
import { getAllPostsFromChain, type OnChainPost } from "@/lib/blockchain-social"
import { getFollowing } from "@/lib/follow-system"
import { FeedSidebar } from "@/components/feed-sidebar"
import { cleanCorruptedProfiles } from "@/lib/clean-profiles"
import { Loader2, RefreshCw, Home, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FeedFilter = "all" | "following"

export default function FeedPage() {
  const [posts, setPosts] = useState<OnChainPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<OnChainPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all")
  const [followingList, setFollowingList] = useState<string[]>([])
  const { isConnected, account } = useWeb3()

  async function loadPosts() {
    try {
      setIsRefreshing(true)
      const blockchainPosts = await getAllPostsFromChain()
      setPosts(blockchainPosts)
      filterPosts(blockchainPosts, feedFilter)
    } catch (error) {
      console.error("[Feed] Error loading posts:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  async function loadFollowing() {
    if (isConnected && account) {
      try {
        const following = await getFollowing()
        setFollowingList(following)
      } catch (error) {
        console.error("[Feed] Error loading following:", error)
      }
    }
  }

  function filterPosts(allPosts: OnChainPost[], filter: FeedFilter) {
    if (filter === "following") {
      if (followingList.length === 0) {
        setFilteredPosts([])
        return
      }
      const followingLower = followingList.map(addr => addr.toLowerCase())
      const filtered = allPosts.filter(post => 
        followingLower.includes(post.author.toLowerCase())
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(allPosts)
    }
  }

  useEffect(() => {
    // Clean corrupted profiles on mount and on every load
    if (typeof window !== 'undefined') {
      cleanCorruptedProfiles()
      // Also clear any profile data stored as strings
      try {
        const stored = localStorage.getItem('arcnet_profiles')
        if (stored) {
          const parsed = JSON.parse(stored)
          const cleaned: Record<string, any> = {}
          for (const key in parsed) {
            const value = parsed[key]
            if (typeof value === 'object' && value !== null && typeof value.name === 'string') {
              cleaned[key] = value
            }
          }
          localStorage.setItem('arcnet_profiles', JSON.stringify(cleaned))
        }
      } catch (e) {
        console.error('Error cleaning profiles:', e)
      }
    }
    loadPosts()
    loadFollowing()
  }, [isConnected, account])

  useEffect(() => {
    filterPosts(posts, feedFilter)
  }, [feedFilter, followingList, posts])

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

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
          {/* Network Status */}
          <NetworkStatusBadge />

          {/* Create Post */}
          <CreatePost />

          {/* Feed Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Feed</h2>
                <span className="text-sm text-muted-foreground">All interactions are on-chain</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loadPosts()
                  loadFollowing()
                }}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Feed Filter Tabs */}
            <Tabs value={feedFilter} onValueChange={(value) => setFeedFilter(value as FeedFilter)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all" className="gap-2">
                  <Home className="h-4 w-4" />
                  All Posts
                </TabsTrigger>
                <TabsTrigger value="following" className="gap-2" disabled={!isConnected}>
                  <Users className="h-4 w-4" />
                  Following
                  {followingList.length > 0 && (
                    <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      {followingList.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              {feedFilter === "following" ? (
                <>
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground font-medium">No posts from people you follow</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {followingList.length === 0 
                      ? "Start following people to see their posts here!" 
                      : "They haven't posted anything yet."}
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">No posts yet. Be the first to publish on-chain!</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <FeedSidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
