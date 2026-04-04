// Web fallback - in-memory storage (expo-sqlite requires native WASM on web)
// Real SQLite is used on iOS/Android via schema.ts

const webSessions: any[] = [];
const webChallenges: any[] = [];
let webIdCounter = 1;

const webDB = {
  execAsync: async () => {},
  runAsync: async (sql: string, params: any[] = []) => {
    if (sql.includes('INSERT INTO sessions')) {
      webSessions.push({
        id: webIdCounter++,
        type: params[0],
        duration_seconds: params[1],
        rating: params[2],
        completed_at: new Date().toISOString(),
      });
    } else if (sql.includes('INSERT INTO challenges')) {
      webChallenges.push({
        id: webIdCounter++,
        title: params[0],
        scheduled_start: params[1],
        scheduled_end: params[2],
        duration_minutes: params[3],
        completed: !!params[4],
        created_at: new Date().toISOString(),
      });
    } else if (sql.includes('UPDATE challenges SET completed')) {
      const c = webChallenges.find((ch) => ch.id === params[0]);
      if (c) c.completed = true;
    }
  },
  getAllAsync: async (sql: string, params: any[] = []) => {
    if (sql.includes('FROM sessions')) {
      const type = params[0];
      const limit = params[1] ?? 20;
      return webSessions
        .filter((s) => (type ? s.type === type : true))
        .slice(-limit)
        .reverse();
    }
    if (sql.includes('FROM challenges')) {
      return [...webChallenges].reverse().slice(0, 20);
    }
    return [];
  },
  getFirstAsync: async (sql: string) => {
    if (sql.includes('COUNT') && sql.includes('sessions')) return { count: webSessions.length };
    if (sql.includes('SUM') && sql.includes('duration')) {
      const total = webSessions.reduce((s: number, r: any) => s + r.duration_seconds, 0);
      return { total: total / 60 };
    }
    if (sql.includes('AVG') && sql.includes('rating')) {
      const focus = webSessions.filter((s) => s.type === 'focus');
      if (focus.length === 0) return { avg: 0 };
      return { avg: focus.reduce((s: number, r: any) => s + r.rating, 0) / focus.length };
    }
    if (sql.includes('COUNT') && sql.includes('completed = 1')) {
      return { count: webChallenges.filter((c) => c.completed).length };
    }
    if (sql.includes('COUNT') && sql.includes('challenges')) {
      return { count: webChallenges.length };
    }
    return null;
  },
};

export async function getDB() {
  return webDB;
}

export async function saveSession(
  type: 'focus' | 'boredom' | 'breathing' | 'walk',
  durationSeconds: number,
  rating: number
) {
  const database = await getDB();
  await database.runAsync(
    'INSERT INTO sessions (type, duration_seconds, rating) VALUES (?, ?, ?)',
    [type, durationSeconds, rating]
  );
}

export async function getRecentSessions(type: string, limit: number = 5) {
  const database = await getDB();
  return database.getAllAsync(
    'SELECT * FROM sessions WHERE type = ? ORDER BY completed_at DESC LIMIT ?',
    [type, limit]
  );
}
