"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { ProjectFilters } from "@/components/project-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MOCK_PROJECTS } from "@/lib/mock-data"
import Link from "next/link"
import { useWeb3 } from "@/contexts/web3-context"

export default function ProjectsPage() {
  const { isConnected } = useWeb3()
  const [filters, setFilters] = useState({ search: "", tags: [] as string[], stack: [] as string[] })

  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    const matchesSearch =
      !filters.search ||
      project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesTags = filters.tags.length === 0 || filters.tags.some((tag) => project.tags.includes(tag))

    const matchesStack = filters.stack.length === 0 || filters.stack.some((tech) => project.stack.includes(tech))

    return matchesSearch && matchesTags && matchesStack
  })

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Projects</h1>
            <p className="mt-2 text-muted-foreground">Discover Web3 projects built by the Arcnet developer community</p>
          </div>
          {isConnected && (
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Publish Project
              </Link>
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
          <aside className="space-y-6">
            <ProjectFilters onFilterChange={setFilters} />
          </aside>

          <main>
            {filteredProjects.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <p className="text-lg font-medium">No projects found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
