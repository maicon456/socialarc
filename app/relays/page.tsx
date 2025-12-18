"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Globe, Activity, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { useNostr } from "@/contexts/nostr-context"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"

const DEFAULT_RELAYS = [
  { url: "wss://relay.damus.io", region: "Global", description: "Popular general-purpose relay" },
  { url: "wss://relay.nostr.band", region: "Global", description: "High-performance relay with search" },
  { url: "wss://nos.lol", region: "US", description: "Community-run relay" },
  { url: "wss://relay.snort.social", region: "EU", description: "Snort social relay" },
  { url: "wss://nostr.wine", region: "Global", description: "Paid relay for quality content" },
  { url: "wss://relay.nostr.info", region: "Global", description: "Open relay with filtering" },
]

export default function RelaysPage() {
  const { relayStatus, isConnected } = useNostr()
  const [customRelay, setCustomRelay] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/10 text-green-500"
      case "connecting":
        return "bg-yellow-500/10 text-yellow-500"
      case "disconnected":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="h-4 w-4" />
      case "connecting":
        return <Activity className="h-4 w-4 animate-pulse" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleAddRelay = () => {
    if (customRelay.startsWith("wss://") || customRelay.startsWith("ws://")) {
      // In production, actually add to relay pool
      console.log("[v0] Adding relay:", customRelay)
      setCustomRelay("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Nostr Relays</h1>
          <p className="text-lg text-muted-foreground">
            Relays are servers that store and distribute Nostr events. Connect to multiple relays for redundancy.
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Connection Status
            </CardTitle>
            <CardDescription>{isConnected ? "Connected to Nostr network" : "Connecting to relays..."}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {relayStatus.length > 0 ? (
                relayStatus.map((relay) => (
                  <div
                    key={relay.url}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">{relay.url}</span>
                    </div>
                    <Badge className={getStatusColor(relay.status)} variant="secondary">
                      <span className="mr-1">{getStatusIcon(relay.status)}</span>
                      {relay.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">No active connections</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Custom Relay */}
        <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add Custom Relay
            </CardTitle>
            <CardDescription>Connect to additional relays by entering their WebSocket URL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="wss://relay.example.com"
                value={customRelay}
                onChange={(e) => setCustomRelay(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleAddRelay} disabled={!customRelay}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Relays */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Recommended Relays</h2>
          <p className="text-muted-foreground">Popular public relays for getting started</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {DEFAULT_RELAYS.map((relay) => (
            <Card key={relay.url} className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-4 w-4 text-primary" />
                  {relay.url.replace("wss://", "")}
                </CardTitle>
                <CardDescription>{relay.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{relay.region}</Badge>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>About Nostr Relays</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Relays are simple servers that accept connections from clients and store/forward Nostr events. They don't
              talk to each other directly - your client publishes to multiple relays for redundancy.
            </p>
            <p>
              Anyone can run a relay. Some are free and open, others require payment or authentication. Choose relays
              based on reliability, speed, and content policies.
            </p>
            <p>
              Your messages are cryptographically signed with your private key, so even compromised relays cannot forge
              content from you.
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
