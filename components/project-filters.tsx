"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

const POPULAR_TAGS = ["defi", "nft", "dao", "bridge", "identity", "arcnet", "solidity", "rust"]

const TECH_STACK = ["Solidity", "Rust", "Next.js", "React", "Vue.js", "Ethers.js", "Web3.js", "IPFS", "Hardhat"]

interface ProjectFiltersProps {
  onFilterChange?: (filters: { search: string; tags: string[]; stack: string[] }) => void
}

export function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStack, setSelectedStack] = useState<string[]>([])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange?.({ search: value, tags: selectedTags, stack: selectedStack })
  }

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    setSelectedTags(newTags)
    onFilterChange?.({ search, tags: newTags, stack: selectedStack })
  }

  const toggleStack = (tech: string) => {
    const newStack = selectedStack.includes(tech) ? selectedStack.filter((t) => t !== tech) : [...selectedStack, tech]
    setSelectedStack(newStack)
    onFilterChange?.({ search, tags: selectedTags, stack: newStack })
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedTags([])
    setSelectedStack([])
    onFilterChange?.({ search: "", tags: [], stack: [] })
  }

  const hasFilters = search || selectedTags.length > 0 || selectedStack.length > 0

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Popular Tags</h3>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-xs">
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              #{tag}
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
  )
}
