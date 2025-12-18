"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SUPPORTED_WALLETS, type WalletProvider } from "@/lib/wallet-providers"
import { ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"

interface WalletSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletSelect: (providerId: WalletProvider) => Promise<void>
  isConnecting: boolean
}

export function WalletSelectionModal({ open, onOpenChange, onWalletSelect, isConnecting }: WalletSelectionModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>("")

  const handleWalletClick = async (providerId: WalletProvider) => {
    setSelectedWallet(providerId)
    setConnectionStatus("Connecting wallet...")

    try {
      await onWalletSelect(providerId)
      setConnectionStatus("Connected! Switching to Arc Network...")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onOpenChange(false)
    } catch (error: any) {
      console.error("Connection error:", error)
      setConnectionStatus("")
    } finally {
      setSelectedWallet(null)
      setConnectionStatus("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            {connectionStatus || "Choose your preferred wallet to connect to Arc Network"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {SUPPORTED_WALLETS.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="h-auto justify-start gap-4 p-4 hover:bg-accent bg-transparent"
              onClick={() => handleWalletClick(wallet.id)}
              disabled={isConnecting && selectedWallet !== wallet.id}
            >
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={wallet.icon || "/placeholder.svg"}
                  alt={wallet.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="flex flex-1 flex-col items-start text-left">
                <div className="font-semibold">{wallet.name}</div>
                <div className="text-xs text-muted-foreground">{wallet.description}</div>
              </div>

              {isConnecting && selectedWallet === wallet.id && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </Button>
          ))}
        </div>

        <div className="border-t pt-4 text-center text-sm text-muted-foreground">
          <p>New to Ethereum wallets?</p>
          <a
            href="https://ethereum.org/en/wallets/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Learn more about wallets
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
