"use client"

import { useState, useEffect } from "react"
import { Card } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useWeb3 } from "@/contexts/web3-context"
import { useToast } from "@/hooks/use-toast"
import { likePostOnChain, unlikePostOnChain, commentOnChain, sharePostOnChain, hasUserLikedPost, GAS_FEES } from "@/lib/blockchain-social"
import { getTransactionExplorerUrl, formatTransactionHash } from "@/lib/blockchain-interactions"
import { getMediaFromURL } from "@/lib/media-storage"
import { Heart, MessageCircle, Share2, Loader2, ExternalLink, Play } from "lucide-react"
import type { OnChainPost } from "@/lib/blockchain-social"
import { formatDistanceToNow } from "date-fns"
import { ARC_LINKS } from "@/lib/web3-config"

interface PostCardProps {
  post: OnChainPost
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [comments, setComments] = useState(post.comments)
  const [shares, setShares] = useState(post.shares)
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const { account, isConnected } = useWeb3()
  const { toast } = useToast()

  // Check if user has liked this post
  useEffect(() => {
    if (account && post.id) {
      hasUserLikedPost(post.id, account).then(setIsLiked).catch(console.error)
    }
  }, [account, post.id])

  const timestamp = new Date(post.timestamp)
  const shortAddress = `${post.author.slice(0, 6)}...${post.author.slice(-4)}`

  async function handleLike() {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to interact",
        variant: "destructive",
      })
      return
    }

    setIsProcessing("like")

    try {
      if (isLiked) {
        toast({
          title: "Removing like",
          description: `Transaction fee: ~${GAS_FEES.likePost} USDC`,
        })
        
        const txHash = await unlikePostOnChain(post.id)
        setLikes((prev) => prev - 1)
        setIsLiked(false)
        
        toast({
          title: "Post unliked!",
          description: (
            <div className="space-y-1">
              <a
                href={getTransactionExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary underline text-sm"
              >
                View transaction {formatTransactionHash(txHash)} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ),
        })
      } else {
        toast({
          title: "Processing like",
          description: `Transaction fee: ~${GAS_FEES.likePost} USDC`,
        })
        
        const txHash = await likePostOnChain(post.id)
        setLikes((prev) => prev + 1)
        setIsLiked(true)
        
        toast({
          title: "Post liked!",
          description: (
            <div className="space-y-1">
              <a
                href={getTransactionExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary underline text-sm"
              >
                View transaction {formatTransactionHash(txHash)} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ),
        })
      }
      
      // Refresh posts to get updated counts
      window.dispatchEvent(new Event('posts-refresh'))
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  async function handleComment() {
    if (!commentText.trim() || !isConnected) return

    setIsProcessing("comment")

    try {
      toast({
        title: "Adding comment",
        description: `Transaction fee: ~${GAS_FEES.comment} USDC`,
      })

      const txHash = await commentOnChain(post.id, commentText)
      setComments((prev) => prev + 1)
      setCommentText("")

      toast({
        title: "Comment added!",
        description: (
          <div className="space-y-1">
            <a
              href={getTransactionExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary underline text-sm"
            >
              View transaction {formatTransactionHash(txHash)} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      })
      
      // Refresh posts to get updated counts
      window.dispatchEvent(new Event('posts-refresh'))
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  async function handleShare() {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to interact",
        variant: "destructive",
      })
      return
    }

    setIsProcessing("share")

    try {
      toast({
        title: "Sharing post",
        description: `Transaction fee: ~${GAS_FEES.share} USDC`,
      })

      const txHash = await sharePostOnChain(post.id)
      setShares((prev) => prev + 1)

      toast({
        title: "Post shared!",
        description: (
          <div className="space-y-1">
            <a
              href={getTransactionExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary underline text-sm"
            >
              View transaction {formatTransactionHash(txHash)} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ),
      })
      
      // Refresh posts to get updated counts
      window.dispatchEvent(new Event('posts-refresh'))
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <Card className="overflow-hidden transition-colors hover:bg-card/80">
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${post.author}`} />
            <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{shortAddress}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {formatDistanceToNow(timestamp, { addSuffix: true })}
                </span>
              </div>
              {post.txHash && (
                <a
                  href={`${ARC_LINKS.explorer}/tx/${post.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {post.content && (
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {post.content}
              </p>
            )}

            {/* Media - Twitter/X style */}
            {post.mediaUrls.length > 0 && (
              <div className={`mt-3 grid gap-2 ${
                post.mediaUrls.length === 1 
                  ? 'grid-cols-1' 
                  : post.mediaUrls.length === 2 
                    ? 'grid-cols-2' 
                    : 'grid-cols-2'
              }`}>
                {post.mediaUrls.map((url, index) => {
                  const mediaUrl = getMediaFromURL(url) || url
                  // Detect video: check contentType, URL, or file extension
                  const isVideo = 
                    post.contentType === "video" || 
                    post.contentType === "mixed" ||
                    url.includes('video') || 
                    mediaUrl.includes('video') ||
                    url.match(/\.(mp4|webm|ogg|mov|avi)$/i) !== null ||
                    mediaUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i) !== null
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative overflow-hidden rounded-xl bg-muted ${
                        post.mediaUrls.length === 1 ? 'max-h-[500px]' : 'h-60'
                      }`}
                    >
                      {isVideo ? (
                        <div className="relative h-full w-full">
                          <video 
                            src={mediaUrl} 
                            className="h-full w-full object-cover" 
                            controls
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-12 w-12 text-white opacity-80" />
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={mediaUrl || "/placeholder.svg"} 
                          alt={`Post media ${index + 1}`} 
                          className="h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            // Open in full screen view
                            window.open(mediaUrl, '_blank')
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Interaction Buttons */}
            <div className="mt-3 flex items-center gap-1 border-t pt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                onClick={handleLike}
                disabled={!!isProcessing}
              >
                {isProcessing === "like" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                )}
                <span className="text-xs">{likes}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-blue-500"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{comments}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-green-500"
                onClick={handleShare}
                disabled={!!isProcessing}
              >
                {isProcessing === "share" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                <span className="text-xs">{shares}</span>
              </Button>
            </div>

            {/* Comment Input */}
            {showComments && (
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Add a comment (on-chain)"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={!isConnected || !!isProcessing}
                  className="text-sm"
                />
                <Button size="sm" onClick={handleComment} disabled={!commentText.trim() || !!isProcessing}>
                  {isProcessing === "comment" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
