import { getReputationLevel, formatReputation } from "@/lib/reputation"
import { Progress } from "@/components/ui/progress"

interface ReputationLevelProps {
  reputation: number
  showProgress?: boolean
}

export function ReputationLevel({ reputation, showProgress = true }: ReputationLevelProps) {
  const { level, title, color, nextLevelPoints } = getReputationLevel(reputation)

  const progress = nextLevelPoints > 0 ? (reputation / nextLevelPoints) * 100 : 100

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg"
          style={{
            background: `linear-gradient(135deg, ${color}40, ${color}20)`,
            color: color,
            border: `2px solid ${color}`,
          }}
        >
          {level}
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{formatReputation(reputation)} points</p>
        </div>
      </div>
      {showProgress && nextLevelPoints > 0 && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {formatReputation(nextLevelPoints - reputation)} points to next level
          </p>
        </div>
      )}
    </div>
  )
}
