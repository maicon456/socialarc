import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock } from "lucide-react"
import type { Service } from "@/lib/types"
import { shortenAddress, generateAvatar } from "@/lib/web3-utils"
import Link from "next/link"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const categoryColors: Record<string, string> = {
    Audit: "bg-red-500/10 text-red-500 border-red-500/20",
    Development: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Consulting: "bg-green-500/10 text-green-500 border-green-500/20",
    Integration: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }

  return (
    <Card className="p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <Badge className={`${categoryColors[service.category]} border`}>{service.category}</Badge>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-semibold">{service.rating}</span>
          <span className="text-xs text-muted-foreground">({service.completedJobs})</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">
        <Link href={`/services/${service.id}`} className="hover:text-primary transition-colors">
          {service.title}
        </Link>
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">{service.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {service.stack.slice(0, 4).map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
        {service.stack.length > 4 && (
          <Badge variant="secondary" className="text-xs">
            +{service.stack.length - 4}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Link href={`/developers/${service.providerAddress}`} className="flex items-center gap-2 hover:opacity-80">
          <Avatar className="h-8 w-8">
            <AvatarImage src={generateAvatar(service.providerAddress) || "/placeholder.svg"} alt={service.provider} />
            <AvatarFallback>{service.provider.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{service.provider}</span>
            <span className="font-mono text-xs text-muted-foreground">{shortenAddress(service.providerAddress)}</span>
          </div>
        </Link>

        <div className="text-right">
          <div className="text-lg font-bold text-primary">{service.price}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {service.duration}
          </div>
        </div>
      </div>
    </Card>
  )
}
