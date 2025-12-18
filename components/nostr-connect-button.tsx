"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Hash } from "lucide-react"

export function NostrConnectButton() {
  const [npub, setNpub] = useState("")
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    if (npub.startsWith("npub1")) {
      setIsConnected(true)
      localStorage.setItem("nostr_pubkey", npub)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isConnected ? "secondary" : "outline"} size="sm">
          <Hash className="w-4 h-4 mr-2" />
          {isConnected ? "Nostr Connected" : "Connect Nostr"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Nostr Identity</DialogTitle>
          <DialogDescription>
            Link your Nostr public key to enable decentralized messaging and identity verification
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="npub">Nostr Public Key (npub)</Label>
            <Input id="npub" placeholder="npub1..." value={npub} onChange={(e) => setNpub(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Your npub starts with "npub1". You can find it in your Nostr client.
            </p>
          </div>
          <Button onClick={handleConnect} className="w-full" disabled={!npub.startsWith("npub1")}>
            Connect Nostr Identity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
