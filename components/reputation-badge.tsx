import type { ReputationBadge } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface ReputationBadgeProps {
  badge: ReputationBadge
  size?: "sm" | "md" | "lg"
}

export function ReputationBadgeComponent({ badge, size = "md" }: ReputationBadgeProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const containerSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "contribution":
        return "from-blue-500/20 to-blue-600/20 border-blue-500/50"
      case "expertise":
        return "from-purple-500/20 to-purple-600/20 border-purple-500/50"
      case "community":
        return "from-green-500/20 to-green-600/20 border-green-500/50"
      case "achievement":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50"
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/50"
    }
  }

  return (
    <div className="group relative">
      <div
        className={`${containerSizes[size]} rounded-full bg-gradient-to-br ${getCategoryColor(
          badge.category,
        )} border-2 flex items-center justify-center transition-transform group-hover:scale-110`}
      >
        <span className={sizeClasses[size]}>{badge.icon}</span>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <Card className="p-3 w-48 bg-card/95 backdrop-blur-sm border-border">
          <p className="font-semibold text-sm text-foreground">{badge.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
          <p className="text-xs text-muted-foreground mt-2">Earned {new Date(badge.earnedAt).toLocaleDateString()}</p>
        </Card>
      </div>
    </div>
  )
}
