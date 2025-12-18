"use client"

import { Card } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Heart, MessageCircle, Repeat2, Share2 } from "lucide-react"
import type { NostrEvent } from "@/lib/nostr-types"
import { formatDistanceToNow } from "date-fns"

interface NoteCardProps {
  event: NostrEvent
}

export function NoteCard({ event }: NoteCardProps) {
  const timestamp = new Date(event.created_at * 1000)
  const shortPubkey = `${event.pubkey.slice(0, 8)}...${event.pubkey.slice(-4)}`

  return (
    <Card className="p-4 transition-colors hover:bg-card/80">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${event.pubkey}`} />
          <AvatarFallback>{event.pubkey.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{shortPubkey}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                {formatDistanceToNow(timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed">{event.content}</p>

          <div className="flex items-center gap-4 pt-2">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Heart className="h-4 w-4" />
              <span className="text-xs">0</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-accent">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">0</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-green-500">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">0</span>
            </Button>

            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
