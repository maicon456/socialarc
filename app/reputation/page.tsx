import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BADGE_DEFINITIONS, REPUTATION_WEIGHTS } from "@/lib/reputation"
import { Trophy, Award, Users, Target, Star, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Reputation System - Arcnet DApp Marketplace",
  description: "Learn how to earn reputation and badges in the Arcnet developer community",
}

export default function ReputationPage() {
  const badgeCategories = {
    contribution: [] as any[],
    expertise: [] as any[],
    community: [] as any[],
    achievement: [] as any[],
  }

  Object.values(BADGE_DEFINITIONS).forEach((badge) => {
    badgeCategories[badge.category].push(badge)
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Reputation System</h1>
              <p className="text-muted-foreground">Build your on-chain reputation and earn badges</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <Card className="mb-8 border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              How Reputation Works
            </CardTitle>
            <CardDescription>Earn reputation points by contributing to the community</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Publish Project</span>
                <Badge variant="secondary">+{REPUTATION_WEIGHTS.PROJECT_PUBLISHED}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Share your Web3 projects with the community</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Complete Service</span>
                <Badge variant="secondary">+{REPUTATION_WEIGHTS.SERVICE_COMPLETED}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Deliver quality services to clients</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Solution Accepted</span>
                <Badge variant="secondary">+{REPUTATION_WEIGHTS.SOLUTION_ACCEPTED}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Provide helpful answers in support threads</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Upvote Received</span>
                <Badge variant="secondary">+{REPUTATION_WEIGHTS.UPVOTE_RECEIVED}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Get recognition from other developers</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Helpful Comment</span>
                <Badge variant="secondary">+{REPUTATION_WEIGHTS.COMMENT_HELPFUL}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Contribute valuable insights</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Level Up</span>
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Rewards
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Unlock perks as you reach new levels</p>
            </div>
          </CardContent>
        </Card>

        {/* Reputation Levels */}
        <Card className="mb-8 border-border bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Reputation Levels
            </CardTitle>
            <CardDescription>Progress through ranks as you earn reputation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { level: 1, title: "Beginner", points: "0-249", color: "#4B5BFF" },
              { level: 2, title: "Advanced", points: "250-999", color: "#6B7BFF" },
              { level: 3, title: "Expert", points: "1,000-2,499", color: "#9B9BFF" },
              { level: 4, title: "Master", points: "2,500-4,999", color: "#E4E4FF" },
              { level: 5, title: "Legend", points: "5,000+", color: "#FFD700" },
            ].map((rank) => (
              <div
                key={rank.level}
                className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${rank.color}40, ${rank.color}20)`,
                    color: rank.color,
                    border: `2px solid ${rank.color}`,
                  }}
                >
                  {rank.level}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{rank.title}</p>
                  <p className="text-sm text-muted-foreground">{rank.points} points</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievement Badges */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Achievement Badges
            </h2>
            <p className="text-muted-foreground">Earn special badges for your accomplishments</p>
          </div>

          <div className="grid gap-6">
            {Object.entries(badgeCategories).map(([category, badges]) => (
              <Card key={category} className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    {category === "contribution" && <Users className="w-5 h-5 text-blue-500" />}
                    {category === "expertise" && <Star className="w-5 h-5 text-purple-500" />}
                    {category === "community" && <Users className="w-5 h-5 text-green-500" />}
                    {category === "achievement" && <Trophy className="w-5 h-5 text-yellow-500" />}
                    {category} Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="p-4 rounded-lg bg-background/50 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{badge.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-8 border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Start Building Reputation</h3>
                <p className="text-muted-foreground">
                  Connect your wallet and start contributing to earn your first badge
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/projects/new">Publish Your First Project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
