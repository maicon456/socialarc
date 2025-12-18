import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, CheckCircle2, MessageSquare } from "lucide-react"
import { MOCK_SERVICES } from "@/lib/mock-data"
import { shortenAddress, generateAvatar } from "@/lib/web3-utils"
import { notFound } from "next/navigation"
import Link from "next/link"

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = MOCK_SERVICES.find((s) => s.id === params.id)

  if (!service) {
    notFound()
  }

  const categoryColors: Record<string, string> = {
    Audit: "bg-red-500/10 text-red-500 border-red-500/20",
    Development: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Consulting: "bg-green-500/10 text-green-500 border-green-500/20",
    Integration: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,350px]">
          <main className="space-y-6">
            <Card className="p-8">
              <Badge className={`${categoryColors[service.category]} border mb-4`}>{service.category}</Badge>

              <h1 className="text-4xl font-bold leading-tight mb-4">{service.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="text-lg font-semibold">{service.rating}</span>
                  <span className="text-sm text-muted-foreground">({service.completedJobs} completed)</span>
                </div>
              </div>

              <p className="text-lg leading-relaxed mb-8">{service.description}</p>

              <div className="border-t border-border pt-6">
                <h2 className="text-xl font-bold mb-4">What's Included</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Detailed project scope and requirements analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Regular progress updates and communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Complete documentation and code comments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Post-delivery support and maintenance guidance</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {service.stack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Reviews coming soon...</p>
              </div>
            </Card>
          </main>

          <aside className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center border-b border-border pb-4">
                  <div className="text-3xl font-bold text-primary mb-1">{service.price}</div>
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Request Service
                </Button>

                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Provider
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-bold">Service Provider</h3>
              <Link
                href={`/developers/${service.providerAddress}`}
                className="flex items-start gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={generateAvatar(service.providerAddress) || "/placeholder.svg"}
                    alt={service.provider}
                  />
                  <AvatarFallback>{service.provider.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-lg">{service.provider}</div>
                  <p className="font-mono text-xs text-muted-foreground mb-2">
                    {shortenAddress(service.providerAddress)}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{service.rating}</span>
                    <span className="text-muted-foreground">({service.completedJobs} jobs)</span>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 font-bold">Service Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed Jobs</span>
                  <span className="font-semibold">{service.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <span className="font-semibold">{service.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="font-semibold">Within 24h</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
