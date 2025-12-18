"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWeb3 } from "@/contexts/web3-context"

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const { isConnected, avatar, account } = useWeb3()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Connect your wallet to participate in the discussion</p>
      </Card>
    )
  }

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(content)
      setContent("")
    } catch (error) {
      console.error("Failed to post comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar || "/placeholder.svg"} alt="Your avatar" />
          <AvatarFallback>{account?.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Ask a question or share your experience..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
