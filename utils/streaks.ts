import { getDB } from '@/db/schema';

/**
 * Calculate consecutive days with at least one session.
 * Returns the current streak count.
 */
export async function calculateStreak(): Promise<number> {
  const db = await getDB();

  // Get distinct dates with sessions, ordered most recent first
  const rows = await db.getAllAsync<{ session_date: string }>(
    `SELECT DISTINCT date(completed_at) as session_date
     FROM sessions
     ORDER BY session_date DESC
     LIMIT 90`
  );

  if (rows.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecentDate = new Date(rows[0].session_date + 'T00:00:00');

  // Streak only counts if most recent session was today or yesterday
  if (mostRecentDate < yesterday) return 0;

  let streak = 0;
  let expectedDate = mostRecentDate;

  for (const row of rows) {
    const sessionDate = new Date(row.session_date + 'T00:00:00');

    if (sessionDate.getTime() === expectedDate.getTime()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break; // Gap found, streak ends
    }
  }

  return streak;
}

/**
 * Get the longest streak ever achieved.
 */
export async function getLongestStreak(): Promise<number> {
  const db = await getDB();

  const rows = await db.getAllAsync<{ session_date: string }>(
    `SELECT DISTINCT date(completed_at) as session_date
     FROM sessions
     ORDER BY session_date ASC`
  );

  if (rows.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < rows.length; i++) {
    const prev = new Date(rows[i - 1].session_date + 'T00:00:00');
    const curr = new Date(rows[i].session_date + 'T00:00:00');
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}
