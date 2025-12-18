import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, MessageSquare, Github } from "lucide-react"
import type { Project } from "@/lib/types"
import { shortenAddress, generateAvatar } from "@/lib/web3-utils"
import Link from "next/link"
import Image from "next/image"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      {project.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image src={project.imageUrl || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold leading-tight">
              <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                {project.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={generateAvatar(project.authorAddress) || "/placeholder.svg"} alt={project.author} />
              <AvatarFallback>{project.author.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{project.author}</span>
              <span className="font-mono text-xs text-muted-foreground">{shortenAddress(project.authorAddress)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowUp className="h-4 w-4" />
              {project.upvotes}
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              {project.commentCount}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
