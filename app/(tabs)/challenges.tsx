import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDB } from '@/db/schema';

interface Challenge {
  id: number;
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  duration_minutes: number;
  completed: boolean;
}

export default function ChallengesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => { loadChallenges(); }, []);

  async function loadChallenges() {
    try {
      const db = await getDB();
      const rows = await db.getAllAsync<Challenge>(
        'SELECT * FROM challenges ORDER BY scheduled_start DESC LIMIT 20'
      );
      setChallenges(rows);
    } catch {}
  }

  async function createQuickChallenge(minutes: number) {
    const db = await getDB();
    const now = new Date();
    const end = new Date(now.getTime() + minutes * 60000);
    await db.runAsync(
      'INSERT INTO challenges (title, scheduled_start, scheduled_end, duration_minutes, completed) VALUES (?, ?, ?, ?, ?)',
      [`${minutes}-min Phone Free`, now.toISOString(), end.toISOString(), minutes, 0]
    );
    loadChallenges();
  }

  async function completeChallenge(id: number) {
    const db = await getDB();
    await db.runAsync('UPDATE challenges SET completed = 1 WHERE id = ?', [id]);
    loadChallenges();
  }

  const quickOptions = [
    { min: 15, label: '15m' },
    { min: 30, label: '30m' },
    { min: 60, label: '1h' },
    { min: 120, label: '2h' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.text }]}>Challenges</Text>
        <Text style={[styles.subheader, { color: colors.textMuted }]}>
          Put your phone down and build accountability
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>QUICK CHALLENGE</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.quickGrid}>
          {quickOptions.map((opt) => (
            <Pressable
              key={opt.min}
              style={[styles.quickCard, { backgroundColor: colors.surface }]}
              onPress={() => createQuickChallenge(opt.min)}>
              <Text style={[styles.quickValue, { color: colors.primary }]}>{opt.label}</Text>
              <Text style={[styles.quickLabel, { color: colors.textMuted }]}>PHONE FREE</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: Spacing.xl }]}>
          HISTORY
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {challenges.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No challenges yet. Start one above.
            </Text>
          </View>
        ) : (
          challenges.map((c) => (
            <View
              key={c.id}
              style={[styles.historyCard, { backgroundColor: colors.surface }]}>
              <View style={styles.historyInfo}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>{c.title}</Text>
                <Text style={[styles.historyDate, { color: colors.textMuted }]}>
                  {new Date(c.scheduled_start).toLocaleDateString()}
                </Text>
              </View>
              {c.completed ? (
                <MaterialCommunityIcons name="check-circle" size={28} color={colors.success} />
              ) : (
                <Pressable
                  style={[styles.doneBtn, { backgroundColor: colors.primary }]}
                  onPress={() => completeChallenge(c.id)}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </Pressable>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: 120 },
  header: { fontSize: 34, fontWeight: '800', marginBottom: Spacing.xs },
  subheader: { fontSize: 15, marginBottom: Spacing.xl },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  divider: { height: 1, marginBottom: Spacing.lg },
  quickGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  quickValue: { fontSize: 24, fontWeight: '800', marginBottom: 2 },
  quickLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  emptyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyText: { fontSize: 15 },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  historyDate: { fontSize: 13 },
  doneBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  doneBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
