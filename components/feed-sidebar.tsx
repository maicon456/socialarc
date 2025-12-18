"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { useWeb3 } from "@/contexts/web3-context"
import { getProfileOnChain, type OnChainProfile } from "@/lib/profile-onchain"
import { getFollowing, getFollowers } from "@/lib/follow-system"
import { getAllPostsFromChain } from "@/lib/blockchain-social"
import { getMediaFromURL } from "@/lib/media-storage"
import { UserPlus, Users, FileText, Loader2 } from "lucide-react"
import { shortenAddress } from "@/lib/web3-utils"
import { useRouter } from "next/navigation"

export function FeedSidebar() {
  const { account, isConnected, balance } = useWeb3()
  const [profile, setProfile] = useState<OnChainProfile | null>(null)
  const [followingCount, setFollowingCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [postsCount, setPostsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isConnected && account) {
      loadProfileData()
    } else {
      setIsLoading(false)
    }
  }, [account, isConnected])

  async function loadProfileData() {
    if (!account) return
    
    setIsLoading(true)
    try {
      // Load profile
      const profileData = await getProfileOnChain(account)
      setProfile(profileData)

      // Load stats
      const [following, followers, allPosts] = await Promise.all([
        getFollowing(),
        getFollowers(account),
        getAllPostsFromChain(),
      ])
      
      setFollowingCount(following.length)
      setFollowersCount(followers.length)
      setPostsCount(allPosts.filter(p => p.author.toLowerCase() === account.toLowerCase()).length)
    } catch (error) {
      console.error("Error loading profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected || !account) {
    return (
      <aside className="w-80 space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Connect Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Connect your wallet to see your profile and stats
          </p>
        </Card>
      </aside>
    )
  }

  const profileName = profile?.name || shortenAddress(account)
  const profileAvatar = profile?.avatarUrl 
    ? (getMediaFromURL(profile.avatarUrl) || profile.avatarUrl)
    : `https://api.dicebear.com/7.x/shapes/svg?seed=${account}`

  return (
    <aside className="w-80 space-y-4">
      {/* Profile Card */}
      <Card className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileAvatar} />
                <AvatarFallback>
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : account.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{profileName}</h3>
                <p className="text-xs text-muted-foreground truncate">{shortenAddress(account)}</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mb-4"
              onClick={() => router.push('/profile')}
            >
              Edit Profile
            </Button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center border-t pt-4">
              <div>
                <div className="font-semibold text-lg">{postsCount}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{followingCount}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
              <div>
                <div className="font-semibold text-lg">{followersCount}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => router.push('/users')}
          >
            <UserPlus className="h-4 w-4" />
            Find People
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={() => router.push(`/developers/${account}`)}
          >
            <FileText className="h-4 w-4" />
            My Profile
          </Button>
        </div>
      </Card>

      {/* Balance Card */}
      {balance !== null && (
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Wallet Balance</h3>
          <div className="text-2xl font-bold text-primary">
            {parseFloat(balance).toFixed(4)} USDC
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Arc Network Testnet
          </p>
        </Card>
      )}
    </aside>
  )
}

