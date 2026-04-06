import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDB } from '@/db/schema';
import { calculateMentalFitnessScore, getAdaptiveRecommendation } from '@/utils/scoring';
import { calculateStreak, getLongestStreak } from '@/utils/streaks';
import { FocusChart } from '@/components/focus-chart';

interface Stats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  avgFocusRating: number;
  mentalFitnessScore: number;
  recommendation: string;
}

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    avgFocusRating: 0,
    mentalFitnessScore: 0,
    recommendation: 'Complete your first session to get started',
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const db = await getDB();
      const sessionCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM sessions'
      );
      const totalMins = await db.getFirstAsync<{ total: number }>(
        'SELECT COALESCE(SUM(duration_seconds), 0) / 60.0 as total FROM sessions'
      );
      const avgRating = await db.getFirstAsync<{ avg: number }>(
        "SELECT COALESCE(AVG(rating), 0) as avg FROM sessions WHERE type = 'focus'"
      );
      const challengesDone = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM challenges WHERE completed = 1'
      );
      const challengesTotal = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM challenges'
      );
      const focusSessions = await db.getAllAsync<{ duration_seconds: number; rating: number }>(
        "SELECT duration_seconds, rating FROM sessions WHERE type = 'focus' ORDER BY completed_at DESC LIMIT 10"
      );

      const score = calculateMentalFitnessScore({
        focusSessions,
        totalSessions: sessionCount?.count ?? 0,
        challengesCompleted: challengesDone?.count ?? 0,
        challengesTotal: challengesTotal?.count ?? 0,
      });

      const streak = await calculateStreak();
      const longest = await getLongestStreak();

      setStats({
        totalSessions: sessionCount?.count ?? 0,
        totalMinutes: Math.round(totalMins?.total ?? 0),
        currentStreak: streak,
        longestStreak: longest,
        avgFocusRating: Math.round((avgRating?.avg ?? 0) * 10) / 10,
        mentalFitnessScore: score,
        recommendation: getAdaptiveRecommendation(focusSessions),
      });
    } catch {
      // DB not ready
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.text }]}>Dashboard</Text>

        {/* Score Ring */}
        <View style={[styles.ringCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.ringLabel, { color: colors.textMuted }]}>MINDSET SCORE</Text>
          <View style={styles.ringContainer}>
            <View style={[styles.ringOuter, { borderColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.ringProgress,
                  {
                    borderColor: colors.primary,
                    borderTopColor: stats.mentalFitnessScore > 25 ? colors.primary : 'transparent',
                    borderRightColor: stats.mentalFitnessScore > 50 ? colors.primary : 'transparent',
                    borderBottomColor: stats.mentalFitnessScore > 75 ? colors.primary : 'transparent',
                    transform: [{ rotate: '-45deg' }],
                  },
                ]}
              />
              <Text style={[styles.ringValue, { color: colors.text }]}>
                {stats.mentalFitnessScore}%
              </Text>
            </View>
          </View>
          <Text style={[styles.nextDay, { color: colors.textMuted }]}>
            Next Day: <Text style={{ color: colors.primary }}>+1%</Text>
          </Text>
        </View>

        {/* Recommendation */}
        <View style={[styles.recCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>NEXT STEP</Text>
          <Text style={[styles.recText, { color: colors.textSecondary }]}>
            {stats.recommendation}
          </Text>
        </View>

        {/* Chart */}
        <FocusChart />

        {/* Stats */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: Spacing.lg, marginBottom: Spacing.md }]}>
          MY STATS
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>ACTIVE{'\n'}STREAK</Text>
            <Text style={[styles.statValue, { color: stats.currentStreak > 0 ? colors.primary : colors.text }]}>
              {stats.currentStreak > 0 ? `${stats.currentStreak}d` : '-'}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>LONGEST{'\n'}STREAK</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.longestStreak > 0 ? `${stats.longestStreak}d` : '-'}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>TOTAL{'\n'}SESSIONS</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalSessions > 0 ? stats.totalSessions : '-'}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>TOTAL{'\n'}MINUTES</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {stats.totalMinutes > 0 ? stats.totalMinutes : '-'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: 120 },
  header: { fontSize: 34, fontWeight: '800', marginBottom: Spacing.xl, textAlign: 'center' },
  ringCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  ringLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.xl,
  },
  ringContainer: { alignItems: 'center', marginBottom: Spacing.lg },
  ringOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringProgress: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
  },
  ringValue: { fontSize: 56, fontWeight: '800' },
  nextDay: { fontSize: 14 },
  recCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  recText: { fontSize: 16, lineHeight: 23 },
  divider: { height: 1, marginBottom: Spacing.lg },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  statValue: { fontSize: 24, fontWeight: '800' },
});
