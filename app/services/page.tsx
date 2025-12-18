"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ServiceCard } from "@/components/service-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { MOCK_SERVICES } from "@/lib/mock-data"
import Link from "next/link"
import { useWeb3 } from "@/contexts/web3-context"

const CATEGORIES = ["All", "Audit", "Development", "Consulting", "Integration"]
const TECH_STACK = ["Solidity", "Rust", "Next.js", "React", "Ethers.js", "Hardhat", "IPFS"]

export default function ServicesPage() {
  const { isConnected } = useWeb3()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStack, setSelectedStack] = useState<string[]>([])

  const toggleStack = (tech: string) => {
    setSelectedStack((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  const filteredServices = MOCK_SERVICES.filter((service) => {
    const matchesSearch =
      !search ||
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory

    const matchesStack = selectedStack.length === 0 || selectedStack.some((tech) => service.stack.includes(tech))

    return matchesSearch && matchesCategory && matchesStack
  })

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Services</h1>
            <p className="mt-2 text-muted-foreground">Find Web3 development services from experienced professionals</p>
          </div>
          {isConnected && (
            <Button asChild>
              <Link href="/services/new">
                <Plus className="mr-2 h-4 w-4" />
                List Service
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Category</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <Badge
                  key={tech}
                  variant={selectedStack.includes(tech) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleStack(tech)}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-medium">No services found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
