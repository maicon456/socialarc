"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { getProfileOnChain, type OnChainProfile } from "@/lib/profile-onchain"
import { getMediaFromURL } from "@/lib/media-storage"
import { Reply, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { OnChainComment } from "@/lib/blockchain-social"

interface CommentItemProps {
  comment: OnChainComment
  onReply: (commentId: string, replyText: string) => void
  isReplying: boolean
  onToggleReply: () => void
  replyText: string
  onReplyTextChange: (text: string) => void
  isProcessing: boolean
  isConnected: boolean
}

export function CommentItem({
  comment,
  onReply,
  isReplying,
  onToggleReply,
  replyText,
  onReplyTextChange,
  isProcessing,
  isConnected,
}: CommentItemProps) {
  const [commentProfile, setCommentProfile] = useState<OnChainProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    getProfileOnChain(comment.commenter)
      .then((profile) => {
        // Ensure profile is a proper object, not a string
        if (profile && typeof profile === 'object' && 'name' in profile) {
          setCommentProfile(profile)
        } else if (profile && typeof profile === 'string') {
          try {
            const parsed = JSON.parse(profile)
            if (parsed && typeof parsed === 'object' && 'name' in parsed) {
              setCommentProfile(parsed)
            }
          } catch {
            setCommentProfile(null)
          }
        } else {
          setCommentProfile(null)
        }
      })
      .catch(() => setCommentProfile(null))
      .finally(() => setIsLoadingProfile(false))
  }, [comment.commenter])

  const commentTime = new Date(comment.timestamp)
  
  // Get author name - ensure it's a string, not JSON
  let authorName = `${comment.commenter.slice(0, 6)}...${comment.commenter.slice(-4)}`
  if (commentProfile && typeof commentProfile === 'object' && commentProfile !== null) {
    if (typeof commentProfile.name === 'string' && commentProfile.name.trim()) {
      authorName = commentProfile.name.trim()
    }
  }
  
  // Get author avatar - convert arcnet:// URLs to data URLs
  let authorAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${comment.commenter}`
  if (commentProfile && typeof commentProfile === 'object' && commentProfile !== null) {
    const avatarUrl = commentProfile.avatarUrl || ''
    if (avatarUrl && typeof avatarUrl === 'string') {
      // Convert arcnet:// URLs to data URLs
      const convertedUrl = getMediaFromURL(avatarUrl)
      authorAvatar = convertedUrl || avatarUrl || authorAvatar
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 p-2 rounded-lg bg-muted/50">
        <Avatar className="h-8 w-8">
          <AvatarImage src={authorAvatar} />
          <AvatarFallback>
            {commentProfile?.name ? commentProfile.name.slice(0, 2).toUpperCase() : comment.commenter.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{authorName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(commentTime, { addSuffix: true })}
              </span>
            </div>
            {isConnected && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={onToggleReply}
              >
                <Reply className="h-3 w-3 mr-1" />
                {isReplying ? "Cancel" : "Reply"}
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
        </div>
      </div>
      
      {/* Reply Input */}
      {isReplying && (
        <div className="ml-10 flex gap-2">
          <Input
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onReply(comment.id, replyText)
              }
            }}
            disabled={isProcessing}
            className="text-sm"
          />
          <Button 
            size="sm" 
            onClick={() => onReply(comment.id, replyText)}
            disabled={!replyText.trim() || isProcessing}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
          </Button>
        </div>
      )}
    </div>
  )
}
