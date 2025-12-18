import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Globe, Hash } from "lucide-react"
import type { Developer } from "@/lib/types"
import { shortenAddress, generateAvatar } from "@/lib/web3-utils"
import Link from "next/link"
import { ReputationLevel } from "@/components/reputation-level"
import { ReputationBadgeComponent } from "@/components/reputation-badge"

interface DeveloperCardProps {
  developer: Developer
}

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={generateAvatar(developer.address) || "/placeholder.svg"} alt={developer.name} />
          <AvatarFallback>{developer.name.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">
                <Link href={`/developers/${developer.address}`} className="hover:text-primary transition-colors">
                  {developer.name}
                </Link>
              </h3>
              <p className="font-mono text-xs text-muted-foreground">{shortenAddress(developer.address)}</p>
            </div>
            <div className="scale-75 origin-top-right">
              <ReputationLevel reputation={developer.reputation} showProgress={false} />
            </div>
          </div>

          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{developer.bio}</p>

          {developer.badges.length > 0 && (
            <div className="mt-3 flex gap-2">
              {developer.badges.slice(0, 3).map((badge) => (
                <ReputationBadgeComponent key={badge.id} badge={badge} size="sm" />
              ))}
              {developer.badges.length > 3 && (
                <div className="w-12 h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center text-xs font-semibold">
                  +{developer.badges.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {developer.stack.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {developer.stack.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{developer.stack.length - 5}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-semibold">{developer.projectsPublished}</span>
                <span className="ml-1 text-muted-foreground">projects</span>
              </div>
              <div>
                <span className="font-semibold">{developer.solutionsAccepted}</span>
                <span className="ml-1 text-muted-foreground">solutions</span>
              </div>
              <div>
                <span className="font-semibold">{developer.servicesCompleted}</span>
                <span className="ml-1 text-muted-foreground">services</span>
              </div>
            </div>

            <div className="flex gap-2">
              {developer.socialLinks.github && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={developer.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {developer.socialLinks.twitter && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={developer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {developer.socialLinks.website && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={developer.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {developer.socialLinks.nostr && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={`https://njump.me/${developer.socialLinks.nostr}`} target="_blank" rel="noopener noreferrer">
                    <Hash className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
