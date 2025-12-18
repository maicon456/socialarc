"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArcLogo } from "./arc-logo"
import { Button } from "./ui/button"
import { Hash, Users, Zap, User, BookOpen, MessageCircle } from "lucide-react"
import { useNostr } from "@/contexts/nostr-context"
import { useWeb3 } from "@/contexts/web3-context"
import { WalletConnectButton } from "./wallet-connect-button"
import { Messenger } from "./messenger"
import { getUnreadCount } from "@/lib/private-messages"

export function Navbar() {
  const { identity } = useNostr()
  const { isConnected } = useWeb3()
  const [isMessengerOpen, setIsMessengerOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isConnected) {
      loadUnreadCount()
      
      // Listen for new messages
      const handleNewMessage = () => {
        loadUnreadCount()
      }
      
      window.addEventListener('new-message', handleNewMessage)
      const interval = setInterval(loadUnreadCount, 10000) // Check every 10 seconds
      
      return () => {
        window.removeEventListener('new-message', handleNewMessage)
        clearInterval(interval)
      }
    }
  }, [isConnected])

  async function loadUnreadCount() {
    if (!isConnected) return
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error("Error loading unread count:", error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <ArcLogo />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/feed"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Hash className="h-4 w-4" />
              Feed
            </Link>
            <Link
              href="/relays"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Zap className="h-4 w-4" />
              Relays
            </Link>
            <Link
              href="/users"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {identity && (
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{identity.npub.slice(0, 12)}...</span>
              </Button>
            </Link>
          )}

          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setIsMessengerOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          )}

          <WalletConnectButton />
        </div>
      </div>

      <Messenger isOpen={isMessengerOpen} onClose={() => setIsMessengerOpen(false)} />
    </nav>
  )
}
