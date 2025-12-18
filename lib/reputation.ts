import type { ReputationBadge, Developer } from "./types"

// Reputation calculation constants
export const REPUTATION_WEIGHTS = {
  PROJECT_PUBLISHED: 50,
  SOLUTION_ACCEPTED: 25,
  SERVICE_COMPLETED: 40,
  UPVOTE_RECEIVED: 5,
  COMMENT_HELPFUL: 10,
}

// Badge definitions
export const BADGE_DEFINITIONS = {
  PIONEER: {
    id: "pioneer",
    name: "Pioneer",
    description: "One of the first 100 developers on the platform",
    icon: "🚀",
    category: "achievement" as const,
  },
  CONTRIBUTOR: {
    id: "contributor",
    name: "Active Contributor",
    description: "Published 10+ projects",
    icon: "💎",
    category: "contribution" as const,
  },
  EXPERT: {
    id: "expert",
    name: "Expert Developer",
    description: "Reached 1000+ reputation points",
    icon: "⭐",
    category: "expertise" as const,
  },
  HELPER: {
    id: "helper",
    name: "Community Helper",
    description: "50+ solutions accepted",
    icon: "🤝",
    category: "community" as const,
  },
  SPECIALIST: {
    id: "specialist",
    name: "Service Specialist",
    description: "Completed 20+ services with 4.5+ rating",
    icon: "🎯",
    category: "expertise" as const,
  },
  MENTOR: {
    id: "mentor",
    name: "Mentor",
    description: "Helped 100+ developers",
    icon: "🧑‍🏫",
    category: "community" as const,
  },
}

// Calculate reputation level based on points
export function getReputationLevel(reputation: number): {
  level: number
  title: string
  color: string
  nextLevelPoints: number
} {
  if (reputation >= 5000) {
    return { level: 5, title: "Legend", color: "#FFD700", nextLevelPoints: 0 }
  }
  if (reputation >= 2500) {
    return { level: 4, title: "Master", color: "#E4E4FF", nextLevelPoints: 5000 }
  }
  if (reputation >= 1000) {
    return { level: 3, title: "Expert", color: "#9B9BFF", nextLevelPoints: 2500 }
  }
  if (reputation >= 250) {
    return { level: 2, title: "Advanced", color: "#6B7BFF", nextLevelPoints: 1000 }
  }
  return { level: 1, title: "Beginner", color: "#4B5BFF", nextLevelPoints: 250 }
}

// Check which badges a developer has earned
export function calculateEarnedBadges(developer: Developer): ReputationBadge[] {
  const badges: ReputationBadge[] = []
  const now = Date.now()

  // Pioneer badge - early member
  if (developer.joinedAt < Date.now() - 86400000 * 180) {
    badges.push({ ...BADGE_DEFINITIONS.PIONEER, earnedAt: developer.joinedAt })
  }

  // Contributor badge - 10+ projects
  if (developer.projectsPublished >= 10) {
    badges.push({ ...BADGE_DEFINITIONS.CONTRIBUTOR, earnedAt: now })
  }

  // Expert badge - 1000+ reputation
  if (developer.reputation >= 1000) {
    badges.push({ ...BADGE_DEFINITIONS.EXPERT, earnedAt: now })
  }

  // Helper badge - 50+ solutions
  if (developer.solutionsAccepted >= 50) {
    badges.push({ ...BADGE_DEFINITIONS.HELPER, earnedAt: now })
  }

  // Specialist badge - 20+ services
  if (developer.servicesCompleted >= 20) {
    badges.push({ ...BADGE_DEFINITIONS.SPECIALIST, earnedAt: now })
  }

  // Mentor badge - 100+ solutions
  if (developer.solutionsAccepted >= 100) {
    badges.push({ ...BADGE_DEFINITIONS.MENTOR, earnedAt: now })
  }

  return badges
}

// Format reputation with K suffix
export function formatReputation(reputation: number): string {
  if (reputation >= 1000) {
    return `${(reputation / 1000).toFixed(1)}K`
  }
  return reputation.toString()
}
