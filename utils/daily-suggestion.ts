import { getDB } from '@/db/schema';
import { getAdaptiveRecommendation } from '@/utils/scoring';

export interface DailySuggestion {
  type: 'focus' | 'boredom' | 'breathing';
  title: string;
  subtitle: string;
  duration: number; // seconds
  route: string;
}

/**
 * Generate a personalized daily session suggestion based on user history.
 */
export async function getDailySuggestion(): Promise<DailySuggestion> {
  try {
    const db = await getDB();

    // Check what the user did today
    const todaySession = await db.getFirstAsync<{ type: string }>(
      "SELECT type FROM sessions WHERE date(completed_at) = date('now') LIMIT 1"
    );

    // Get recent focus sessions for adaptive recommendation
    const focusSessions = await db.getAllAsync<{ duration_seconds: number; rating: number }>(
      "SELECT duration_seconds, rating FROM sessions WHERE type = 'focus' ORDER BY completed_at DESC LIMIT 5"
    );

    // If user already did a session today, suggest something different
    if (todaySession) {
      if (todaySession.type === 'focus') {
        return {
          type: 'breathing',
          title: 'Try Breathing',
          subtitle: "You've done focus today. Balance with a breathing session.",
          duration: 300,
          route: '/train/breathing',
        };
      }
      return {
        type: 'boredom',
        title: 'Boredom Sit',
        subtitle: 'Train your tolerance to stillness.',
        duration: 120,
        route: '/train/boredom',
      };
    }

    // No session today - suggest focus with adaptive duration
    if (focusSessions.length === 0) {
      return {
        type: 'focus',
        title: '5-min Deep Focus',
        subtitle: 'Start with a short session to build your baseline.',
        duration: 300,
        route: '/train/focus',
      };
    }

    const avgRating = focusSessions.reduce((sum, s) => sum + s.rating, 0) / focusSessions.length;
    const avgDuration = focusSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / focusSessions.length;
    const avgMinutes = Math.round(avgDuration / 60);

    let suggestedMin: number;
    if (avgRating >= 4) {
      suggestedMin = Math.min(avgMinutes + 3, 90);
    } else if (avgRating <= 2) {
      suggestedMin = Math.max(avgMinutes - 2, 5);
    } else {
      suggestedMin = avgMinutes;
    }

    return {
      type: 'focus',
      title: `${suggestedMin}-min Deep Focus`,
      subtitle: avgRating >= 4
        ? "You're crushing it. Time to level up."
        : `Keep building at ${suggestedMin} minutes.`,
      duration: suggestedMin * 60,
      route: '/train/focus',
    };
  } catch {
    return {
      type: 'focus',
      title: '5-min Deep Focus',
      subtitle: 'Start your mental workout.',
      duration: 300,
      route: '/train/focus',
    };
  }
}
