import { ArcLogo } from "./arc-logo"
import { ExternalLink, Twitter, Github, MessageCircle, Globe } from "lucide-react"
import { ARC_LINKS } from "@/lib/web3-config"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ArcLogo className="h-6" />
              <span className="text-lg font-bold">Arc Social</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized social platform built on Arc Network with Nostr protocol.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Arc Network</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={ARC_LINKS.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
                Official Website
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={ARC_LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Documentation
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={ARC_LINKS.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Block Explorer
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={ARC_LINKS.faucet}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Faucet
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={ARC_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter / X
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={ARC_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={ARC_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Discord
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <ArcLogo className="h-5" />
              <span>Network</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Built on Arc Network Testnet • All interactions are on-chain
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
