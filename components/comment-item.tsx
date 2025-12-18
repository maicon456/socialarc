"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, MessageSquare, CheckCircle2 } from "lucide-react"
import type { Comment } from "@/lib/types"
import { generateAvatar } from "@/lib/web3-utils"
import Link from "next/link"

interface CommentItemProps {
  comment: Comment
  onReply?: (commentId: string, content: string) => void
  onUpvote?: (commentId: string) => void
  onAcceptSolution?: (commentId: string) => void
  isProjectAuthor?: boolean
  depth?: number
}

export function CommentItem({
  comment,
  onReply,
  onUpvote,
  onAcceptSolution,
  isProjectAuthor = false,
  depth = 0,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)
    await onReply?.(comment.id, replyContent)
    setReplyContent("")
    setShowReplyForm(false)
    setIsSubmitting(false)
  }

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className={depth > 0 ? "ml-12" : ""}>
      <Card className={`p-4 ${comment.isAcceptedSolution ? "border-primary" : ""}`}>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto flex-col gap-0 px-2 py-1"
              onClick={() => onUpvote?.(comment.id)}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-xs">{comment.upvotes}</span>
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={generateAvatar(comment.authorAddress) || "/placeholder.svg"} alt={comment.author} />
                  <AvatarFallback>{comment.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/developers/${comment.authorAddress}`}
                    className="font-medium hover:text-primary text-sm"
                  >
                    {comment.author}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                </div>
              </div>

              {comment.isAcceptedSolution && (
                <Badge variant="default" className="gap-1 bg-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Accepted Solution
                </Badge>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed">{comment.content}</p>

            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageSquare className="mr-1 h-3 w-3" />
                Reply
              </Button>

              {isProjectAuthor && !comment.isAcceptedSolution && depth > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-primary"
                  onClick={() => onAcceptSolution?.(comment.id)}
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Mark as Solution
                </Button>
              )}
            </div>

            {showReplyForm && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleReply} disabled={isSubmitting || !replyContent.trim()}>
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowReplyForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onUpvote={onUpvote}
              onAcceptSolution={onAcceptSolution}
              isProjectAuthor={isProjectAuthor}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
