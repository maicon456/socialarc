"use client"

import Link from "next/link"
import { ArcLogo } from "./arc-logo"
import { Button } from "./ui/button"
import { Hash, Users, Zap, User, BookOpen } from "lucide-react"
import { useNostr } from "@/contexts/nostr-context"
import { WalletConnectButton } from "./wallet-connect-button"

export function Navbar() {
  const { identity } = useNostr()

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

          <WalletConnectButton />
        </div>
      </div>
    </nav>
  )
}
