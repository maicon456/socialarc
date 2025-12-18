"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useNostr } from "@/contexts/nostr-context"
import { Send, Loader2 } from "lucide-react"

export function ComposeNote() {
  const [content, setContent] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const { publishNote, identity } = useNostr()

  async function handlePublish() {
    if (!content.trim() || !identity) return

    setIsPublishing(true)
    try {
      await publishNote(content)
      setContent("")
    } catch (error) {
      console.error("[v0] Failed to publish note:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  if (!identity) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Connect your Nostr identity to publish notes</p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <Textarea
        placeholder="What's happening on Arc Network?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-0 focus-visible:ring-0"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{content.length} characters</span>
        <Button onClick={handlePublish} disabled={!content.trim() || isPublishing} size="sm" className="gap-2">
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Publish
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
