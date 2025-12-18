"use client"

import { ExternalLink } from "lucide-react"
import { getTransactionExplorerUrl, formatTransactionHash } from "@/lib/blockchain-interactions"
import { Button } from "./ui/button"

interface TransactionHashProps {
  hash: string
  blockNumber?: bigint
  className?: string
}

export function TransactionHash({ hash, blockNumber, className = "" }: TransactionHashProps) {
  if (!hash) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {blockNumber && (
        <span className="text-xs text-muted-foreground">Block: {blockNumber.toString()}</span>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 text-xs text-primary hover:text-primary/80"
        asChild
      >
        <a
          href={getTransactionExplorerUrl(hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1"
        >
          <span className="font-mono">{formatTransactionHash(hash)}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </div>
  )
}



