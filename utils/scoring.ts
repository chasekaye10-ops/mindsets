interface FocusSession {
  duration_seconds: number;
  rating: number;
}

interface ScoreInput {
  focusSessions: FocusSession[];
  totalSessions: number;
  challengesCompleted: number;
  challengesTotal: number;
}

const ULTRADIAN_GOAL = 90 * 60; // 90 minutes in seconds
const SESSIONS_PER_WEEK_GOAL = 7;

export function calculateMentalFitnessScore(input: ScoreInput): number {
  const { focusSessions, totalSessions, challengesCompleted, challengesTotal } = input;

  if (totalSessions === 0) return 0;

  // 30% - Focus duration progress (best session vs 90-min goal)
  const bestFocusDuration = focusSessions.length > 0
    ? Math.max(...focusSessions.map((s) => s.duration_seconds))
    : 0;
  const focusProgress = Math.min(bestFocusDuration / ULTRADIAN_GOAL, 1) * 30;

  // 25% - Boredom tolerance (using average rating as proxy)
  const avgRating = focusSessions.length > 0
    ? focusSessions.reduce((sum, s) => sum + s.rating, 0) / focusSessions.length
    : 0;
  const ratingScore = (avgRating / 5) * 25;

  // 25% - Session consistency (total sessions, capped at weekly goal)
  const consistencyScore = Math.min(totalSessions / SESSIONS_PER_WEEK_GOAL, 1) * 25;

  // 20% - Challenge completion rate
  const challengeRate = challengesTotal > 0 ? challengesCompleted / challengesTotal : 0;
  const challengeScore = challengeRate * 20;

  return Math.round(focusProgress + ratingScore + consistencyScore + challengeScore);
}

export function getAdaptiveRecommendation(recentFocusSessions: FocusSession[]): string {
  if (recentFocusSessions.length === 0) {
    return 'Complete your first focus session to get started!';
  }

  if (recentFocusSessions.length < 3) {
    return 'Keep going! Complete a few more sessions so I can learn your patterns.';
  }

  const avgRating =
    recentFocusSessions.reduce((sum, s) => sum + s.rating, 0) / recentFocusSessions.length;
  const avgDuration =
    recentFocusSessions.reduce((sum, s) => sum + s.duration_seconds, 0) /
    recentFocusSessions.length;
  const avgMinutes = Math.round(avgDuration / 60);

  // High performance - suggest increasing
  if (avgRating >= 4) {
    const nextDuration = Math.min(avgMinutes + 3, 90);
    if (nextDuration >= 90) {
      return "You're ready for the full 90-minute ultradian cycle. This is the ultimate goal!";
    }
    return `Great focus! Try increasing to ${nextDuration}-minute sessions.`;
  }

  // Struggling - suggest staying or dropping
  if (avgRating <= 2) {
    const lowerDuration = Math.max(avgMinutes - 2, 3);
    return `Focus is building. Try ${lowerDuration}-minute sessions and work your way up.`;
  }

  // Middle ground - keep at current level
  return `You're making progress at ${avgMinutes} minutes. Keep practicing at this level.`;
}
