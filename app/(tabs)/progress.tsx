import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDB } from '@/db/schema';
import { calculateMentalFitnessScore, getAdaptiveRecommendation } from '@/utils/scoring';

interface Stats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
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
    avgFocusRating: 0,
    mentalFitnessScore: 0,
    recommendation: 'Complete your first session to get started!',
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

      const recommendation = getAdaptiveRecommendation(focusSessions);

      setStats({
        totalSessions: sessionCount?.count ?? 0,
        totalMinutes: Math.round(totalMins?.total ?? 0),
        currentStreak: 0, // TODO: calculate from consecutive days
        avgFocusRating: Math.round((avgRating?.avg ?? 0) * 10) / 10,
        mentalFitnessScore: score,
        recommendation,
      });
    } catch {
      // DB not ready
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>Your Progress</Text>

        {/* Mental Fitness Score */}
        <View style={[styles.scoreCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.scoreLabel}>Mental Fitness Score</Text>
          <Text style={styles.scoreValue}>{stats.mentalFitnessScore}</Text>
          <Text style={styles.scoreMax}>/ 100</Text>
        </View>

        {/* Recommendation */}
        <View style={[styles.recCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
          <Text style={[styles.recLabel, { color: colors.accent }]}>Next Step</Text>
          <Text style={[styles.recText, { color: colors.text }]}>{stats.recommendation}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox
            label="Sessions"
            value={String(stats.totalSessions)}
            colors={colors}
          />
          <StatBox
            label="Minutes"
            value={String(stats.totalMinutes)}
            colors={colors}
          />
          <StatBox
            label="Avg Rating"
            value={stats.avgFocusRating > 0 ? `${stats.avgFocusRating}/5` : '—'}
            colors={colors}
          />
          <StatBox
            label="Streak"
            value={stats.currentStreak > 0 ? `${stats.currentStreak}d` : '—'}
            colors={colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={[statStyles.box, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[statStyles.value, { color: colors.primary }]}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingTop: Spacing.xl },
  header: { fontSize: 28, fontWeight: '700', marginBottom: Spacing.lg },
  scoreCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  scoreValue: { color: '#fff', fontSize: 64, fontWeight: '800', marginVertical: Spacing.xs },
  scoreMax: { color: 'rgba(255,255,255,0.6)', fontSize: 18 },
  recCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    marginBottom: Spacing.lg,
  },
  recLabel: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  recText: { fontSize: 15 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});

const statStyles = StyleSheet.create({
  box: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    flexGrow: 1,
  },
  value: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  label: { fontSize: 13 },
});
