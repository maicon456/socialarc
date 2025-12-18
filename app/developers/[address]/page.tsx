"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Twitter, Globe, Calendar, ExternalLink, Hash, Loader2, UserPlus, UserMinus, Send, Check } from "lucide-react"
import { getProfileOnChain, type OnChainProfile } from "@/lib/profile-onchain"
import { followUser, unfollowUser, isFollowing } from "@/lib/follow-system"
import { sendPrivateMessage } from "@/lib/private-messages"
import { useWeb3 } from "@/contexts/web3-context"
import { useToast } from "@/hooks/use-toast"
import { generateAvatar } from "@/lib/web3-utils"
import { ProjectCard } from "@/components/project-card"
import { Footer } from "@/components/footer"
import { shortenAddress } from "@/lib/web3-utils"
import { ARC_LINKS } from "@/lib/web3-config"
import { Messenger } from "@/components/messenger"

export default function DeveloperProfilePage({ params }: { params: { address: string } }) {
  const [profile, setProfile] = useState<OnChainProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowingUser, setIsFollowingUser] = useState(false)
  const [isCheckingFollow, setIsCheckingFollow] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [isMessengerOpen, setIsMessengerOpen] = useState(false)
  const { account, isConnected } = useWeb3()
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
    checkFollowStatus()
  }, [params.address, account, isConnected])

  async function loadProfile() {
    setIsLoading(true)
    try {
      const profileData = await getProfileOnChain(params.address)
      setProfile(profileData)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function checkFollowStatus() {
    if (!isConnected || !account) {
      setIsCheckingFollow(false)
      return
    }

    if (account.toLowerCase() === params.address.toLowerCase()) {
      setIsCheckingFollow(false)
      return
    }

    try {
      const following = await isFollowing(params.address)
      setIsFollowingUser(following)
    } catch (error) {
      console.error("Error checking follow status:", error)
    } finally {
      setIsCheckingFollow(false)
    }
  }

  async function handleFollow() {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to follow users",
        variant: "destructive",
      })
      return
    }

    if (account.toLowerCase() === params.address.toLowerCase()) {
      return
    }

    setIsProcessing("follow")

    try {
      if (isFollowingUser) {
        await unfollowUser(params.address)
        setIsFollowingUser(false)
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${profile?.name || shortenAddress(params.address)}`,
        })
      } else {
        await followUser(params.address)
        setIsFollowingUser(true)
        toast({
          title: "Following",
          description: `You are now following ${profile?.name || shortenAddress(params.address)}. You can now send private messages!`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  async function handleSendMessage() {
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send messages",
        variant: "destructive",
      })
      return
    }

    if (!isFollowingUser) {
      toast({
        title: "Follow first",
        description: "You need to follow this user before sending messages",
        variant: "destructive",
      })
      return
    }

    setIsMessengerOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-md p-8 text-center">
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              This user hasn't created a profile yet.
            </p>
            <Button className="mt-4" asChild>
              <a href="/profile">Create Your Profile</a>
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          <main className="space-y-6">
            <Card className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={profile.avatarUrl || generateAvatar(profile.address) || "/placeholder.svg"} 
                    alt={profile.name} 
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : profile.address.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{profile.name || "Anonymous"}</h1>
                      <p className="mt-1 font-mono text-sm text-muted-foreground">
                        {shortenAddress(profile.address)}
                      </p>
                      <a
                        href={`${ARC_LINKS.explorer}/address/${profile.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        View on Explorer <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    {/* Follow and Message Buttons */}
                    {isConnected && account && account.toLowerCase() !== profile.address.toLowerCase() && (
                      <div className="flex items-center gap-2">
                        {isCheckingFollow ? (
                          <Button variant="outline" size="sm" disabled>
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant={isFollowingUser ? "default" : "outline"}
                              size="sm"
                              onClick={handleFollow}
                              disabled={!!isProcessing}
                              className="gap-2"
                            >
                              {isProcessing === "follow" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : isFollowingUser ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4" />
                                  Follow
                                </>
                              )}
                            </Button>
                            
                            {isFollowingUser && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSendMessage}
                                className="gap-2"
                              >
                                <Send className="h-4 w-4" />
                                Message
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-muted-foreground leading-relaxed">{profile.bio}</p>

                  {profile.stack.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {profile.stack.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    {profile.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {profile.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {profile.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Posts from this user will appear here</p>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Activity feed coming soon...</p>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          <aside className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 font-bold">Profile Info</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <span className="font-mono text-xs">{shortenAddress(profile.address)}</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Profile created{" "}
                      {new Date(profile.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-bold">On-Chain Profile</h3>
              <p className="text-sm text-muted-foreground mb-2">
                This profile is stored on the Arc Network blockchain and is visible to everyone.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a
                  href={`${ARC_LINKS.explorer}/address/${profile.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  View on Explorer <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </Card>
          </aside>
        </div>
      </div>
      <Footer />
      
      <Messenger 
        isOpen={isMessengerOpen} 
        onClose={() => setIsMessengerOpen(false)}
        initialAddress={profile.address}
      />
    </div>
  )
}
