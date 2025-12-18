"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, UserPlus, Shield, Zap } from "lucide-react"

// Mock data for demo
const FEATURED_USERS = [
  {
    npub: "npub1abc...xyz1",
    name: "Alice Builder",
    about: "Building the future of decentralized social on Arc Network",
    followers: 1247,
    verified: true,
  },
  {
    npub: "npub1def...xyz2",
    name: "Bob Protocol",
    about: "Nostr protocol developer and Arc enthusiast",
    followers: 892,
    verified: true,
  },
  {
    npub: "npub1ghi...xyz3",
    name: "Carol Crypto",
    about: "DeFi researcher | Web3 advocate | Building on Arc",
    followers: 2156,
    verified: false,
  },
  {
    npub: "npub1jkl...xyz4",
    name: "David Dev",
    about: "Full-stack developer exploring decentralized tech",
    followers: 543,
    verified: false,
  },
  {
    npub: "npub1mno...xyz5",
    name: "Eve Validator",
    about: "Arc Network validator | Decentralization maximalist",
    followers: 1876,
    verified: true,
  },
  {
    npub: "npub1pqr...xyz6",
    name: "Frank Finance",
    about: "Stablecoin trader | Arc DeFi protocols",
    followers: 731,
    verified: false,
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = FEATURED_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.about.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Discover Users</h1>
          <p className="text-lg text-muted-foreground">
            Find and follow interesting people on the Arc Network decentralized social platform
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8 border-primary/20 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">8,234</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,432</p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">284</p>
                <p className="text-sm text-muted-foreground">Verified Users</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{searchQuery ? "Search Results" : "Featured Users"}</h2>
          <p className="text-muted-foreground">
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.npub} className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={`/.jpg?height=48&width=48&query=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      {user.verified && <Shield className="h-4 w-4 text-primary" />}
                    </div>
                    <CardDescription className="font-mono text-xs">{user.npub}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-muted-foreground">{user.about}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{user.followers.toLocaleString()} followers</Badge>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <UserPlus className="h-3 w-3" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No users found matching your search</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
