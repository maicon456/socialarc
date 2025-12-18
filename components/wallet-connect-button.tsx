"use client"

import { useState } from "react"
import { useWeb3 } from "@/contexts/web3-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletSelectionModal } from "./wallet-selection-modal"
import { shortenAddress } from "@/lib/web3-utils"
import { Wallet, LogOut, User, Copy, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import type { WalletProvider } from "@/lib/wallet-providers"
import { ARCNET_CONFIG } from "@/lib/web3-config"

export function WalletConnectButton() {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { account, isConnected, isConnecting, avatar, connectWallet, disconnectWallet, connectedProvider, balance, refreshBalance } = useWeb3()

  const handleWalletSelect = async (providerId: WalletProvider) => {
    await connectWallet(providerId)
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account)
    }
  }

  const viewOnExplorer = () => {
    if (account) {
      window.open(`${ARCNET_CONFIG.blockExplorerUrls[0]}/address/${account}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setShowWalletModal(true)} disabled={isConnecting} className="gap-2">
          <Wallet className="h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>

        <WalletSelectionModal
          open={showWalletModal}
          onOpenChange={setShowWalletModal}
          onWalletSelect={handleWalletSelect}
          isConnecting={isConnecting}
        />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar || ""} alt="Wallet avatar" />
            <AvatarFallback>{account?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="font-mono text-xs">{shortenAddress(account || "")}</span>
            {balance !== null && (
              <span className="text-xs text-muted-foreground">{balance} USDC</span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar || ""} alt="Wallet avatar" />
                <AvatarFallback>{account?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">Wallet Connected</div>
                {connectedProvider && (
                  <div className="text-xs text-muted-foreground capitalize">
                    {connectedProvider === "injected" ? "Browser Wallet" : connectedProvider}
                  </div>
                )}
              </div>
            </div>
            
            {/* Address */}
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-border/50 bg-muted/30 p-2">
                <div className="text-xs text-muted-foreground mb-1">Address</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs break-all">{account}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyAddress()
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Balance */}
              <div className="rounded-lg border border-border/50 bg-muted/30 p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Balance</div>
                    <div className="text-lg font-bold">
                      {balance !== null ? `${balance} USDC` : "Loading..."}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      refreshBalance()
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={viewOnExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
