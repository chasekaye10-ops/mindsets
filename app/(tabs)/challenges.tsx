import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  async function loadChallenges() {
    try {
      const db = await getDB();
      const rows = await db.getAllAsync<Challenge>(
        'SELECT * FROM challenges ORDER BY scheduled_start DESC LIMIT 20'
      );
      setChallenges(rows);
    } catch {
      // DB not ready yet
    }
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

  const quickOptions = [15, 30, 60, 120];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>Challenges</Text>
        <Text style={[styles.subheader, { color: colors.textMuted }]}>
          Schedule phone-free blocks and build accountability
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Quick Challenge</Text>
        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          Put your phone down right now
        </Text>
        <View style={styles.quickRow}>
          {quickOptions.map((min) => (
            <Pressable
              key={min}
              style={[styles.quickBtn, { backgroundColor: colors.primary }]}
              onPress={() => createQuickChallenge(min)}>
              <Text style={styles.quickBtnText}>
                {min >= 60 ? `${min / 60}h` : `${min}m`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary, marginTop: Spacing.xl }]}>
          Your Challenges
        </Text>
        {challenges.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No challenges yet. Start one above!
            </Text>
          </View>
        ) : (
          challenges.map((c) => (
            <View
              key={c.id}
              style={[
                styles.challengeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: c.completed ? colors.success : colors.border,
                },
              ]}>
              <View style={styles.challengeInfo}>
                <Text style={[styles.challengeTitle, { color: colors.text }]}>
                  {c.completed ? '✓ ' : ''}{c.title}
                </Text>
                <Text style={[styles.challengeTime, { color: colors.textMuted }]}>
                  {new Date(c.scheduled_start).toLocaleDateString()} — {c.duration_minutes} min
                </Text>
              </View>
              {!c.completed && (
                <Pressable
                  style={[styles.doneBtn, { backgroundColor: colors.success }]}
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
  content: { padding: Spacing.lg, paddingTop: Spacing.xl },
  header: { fontSize: 28, fontWeight: '700', marginBottom: Spacing.xs },
  subheader: { fontSize: 16, marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: Spacing.xs },
  sectionDesc: { fontSize: 14, marginBottom: Spacing.md },
  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  quickBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  emptyState: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: { fontSize: 15 },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  challengeTime: { fontSize: 13 },
  doneBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  doneBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
