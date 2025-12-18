"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { DeveloperCard } from "@/components/developer-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { MOCK_DEVELOPERS } from "@/lib/mock-data"

const TECH_STACK = ["Solidity", "Rust", "Next.js", "React", "Vue.js", "Ethers.js", "Web3.js", "IPFS", "Hardhat"]

export default function DevelopersPage() {
  const [search, setSearch] = useState("")
  const [selectedStack, setSelectedStack] = useState<string[]>([])

  const toggleStack = (tech: string) => {
    setSelectedStack((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  const filteredDevelopers = MOCK_DEVELOPERS.filter((dev) => {
    const matchesSearch =
      !search ||
      dev.name.toLowerCase().includes(search.toLowerCase()) ||
      dev.bio.toLowerCase().includes(search.toLowerCase()) ||
      dev.address.toLowerCase().includes(search.toLowerCase())

    const matchesStack = selectedStack.length === 0 || selectedStack.some((tech) => dev.stack.includes(tech))

    return matchesSearch && matchesStack
  })

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Developers</h1>
          <p className="mt-2 text-muted-foreground">Connect with Web3 developers building on Arcnet</p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search developers by name or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Filter by Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <Badge
                  key={tech}
                  variant={selectedStack.includes(tech) ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => toggleStack(tech)}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {filteredDevelopers.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium">No developers found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDevelopers.map((developer) => (
              <DeveloperCard key={developer.address} developer={developer} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
