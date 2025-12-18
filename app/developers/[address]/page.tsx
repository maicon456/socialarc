import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Twitter, Globe, Calendar, ExternalLink, Hash } from "lucide-react"
import { MOCK_DEVELOPERS, MOCK_PROJECTS } from "@/lib/mock-data"
import { generateAvatar } from "@/lib/web3-utils"
import { ProjectCard } from "@/components/project-card"
import { notFound } from "next/navigation"
import { ReputationLevel } from "@/components/reputation-level"
import { ReputationBadgeComponent } from "@/components/reputation-badge"

export default function DeveloperProfilePage({ params }: { params: { address: string } }) {
  const developer = MOCK_DEVELOPERS.find((d) => d.address.toLowerCase() === params.address.toLowerCase())

  if (!developer) {
    notFound()
  }

  const developerProjects = MOCK_PROJECTS.filter(
    (p) => p.authorAddress.toLowerCase() === developer.address.toLowerCase(),
  )

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          <main className="space-y-6">
            <Card className="p-8">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={generateAvatar(developer.address) || "/placeholder.svg"} alt={developer.name} />
                  <AvatarFallback className="text-2xl">{developer.name.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">{developer.name}</h1>
                      <p className="mt-1 font-mono text-sm text-muted-foreground">{developer.address}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-muted-foreground leading-relaxed">{developer.bio}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {developer.stack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    {developer.socialLinks.github && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={developer.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {developer.socialLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={developer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="mr-2 h-4 w-4" />
                          Twitter
                        </a>
                      </Button>
                    )}
                    {developer.socialLinks.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={developer.socialLinks.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="mr-2 h-4 w-4" />
                          Website
                        </a>
                      </Button>
                    )}
                    {developer.socialLinks.nostr && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://njump.me/${developer.socialLinks.nostr}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Hash className="mr-2 h-4 w-4" />
                          Nostr
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="projects">Projects ({developerProjects.length})</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="mt-6">
                {developerProjects.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No projects published yet</p>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {developerProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Activity feed coming soon...</p>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">Services coming soon...</p>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          <aside className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 font-bold">Reputation Level</h3>
              <ReputationLevel reputation={developer.reputation} showProgress={true} />
            </Card>

            {developer.badges.length > 0 && (
              <Card className="p-6">
                <h3 className="mb-4 font-bold">Badges ({developer.badges.length})</h3>
                <div className="flex flex-wrap gap-3">
                  {developer.badges.map((badge) => (
                    <ReputationBadgeComponent key={badge.id} badge={badge} size="md" />
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="mb-4 font-bold">Stats</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Projects Published</span>
                    <span className="font-semibold">{developer.projectsPublished}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Solutions Accepted</span>
                    <span className="font-semibold">{developer.solutionsAccepted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Services Completed</span>
                    <span className="font-semibold">{developer.servicesCompleted}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(developer.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-bold">IPFS Profile</h3>
              <div className="rounded-lg bg-muted p-3">
                <p className="font-mono text-xs break-all">{developer.profileHash}</p>
              </div>
              <Button variant="link" className="mt-2 h-auto p-0 text-xs" asChild>
                <a
                  href={`https://ipfs.io/ipfs/${developer.profileHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  View on IPFS
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
