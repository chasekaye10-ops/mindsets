import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveSession } from '@/db/schema';
import { breathingProtocols, Protocol } from '@/data/protocols';
import { ProtocolIcon } from '@/components/protocol-icon';

import { SessionRating } from '@/components/session-rating';

type Phase = 'select' | 'active' | 'rating' | 'done';

export default function BreathingSession() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [phase, setPhase] = useState<Phase>('select');
  const [selected, setSelected] = useState<Protocol | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startProtocol(protocol: Protocol) {
    setSelected(protocol);
    setPhase('active');
    const durationSeconds = protocol.duration * 60;
    setTimeLeft(durationSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          completeSession(protocol, durationSeconds);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function completeSession(protocol: Protocol, duration: number) {
    setPhase('rating');
  }

  function endEarly() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('rating');
  }

  async function handleRate(rating: number) {
    if (selected) {
      const duration = selected.duration * 60 - Math.max(timeLeft, 0);
      await saveSession('breathing', duration, rating);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('done');
    setTimeout(() => router.back(), 800);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
      </Pressable>

      {phase === 'select' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>Breathing Protocols</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Science-backed breathing techniques for focus and calm
          </Text>

          {breathingProtocols.map((protocol) => (
            <Pressable
              key={protocol.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => startProtocol(protocol)}>
              <ProtocolIcon name={protocol.iconName} />
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{protocol.name}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  {protocol.description}
                </Text>
                <Text style={[styles.duration, { color: colors.primary }]}>
                  {protocol.duration} min
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {phase === 'active' && selected && (
        <View style={styles.centered}>
          <Text style={[styles.activeTitle, { color: colors.primary }]}>{selected.name}</Text>
          <Text style={[styles.instructions, { color: colors.textMuted }]}>
            {selected.instructions}
          </Text>
          <View style={[styles.timerCircle, { borderColor: colors.primaryLight }]}>
            <Text style={[styles.timerText, { color: colors.primary }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Pressable style={[styles.stopBtn, { borderColor: colors.border }]} onPress={endEarly}>
            <Text style={[styles.stopText, { color: colors.textMuted }]}>End Early</Text>
          </Pressable>
        </View>
      )}

      {phase === 'rating' && (
        <SessionRating
          title="Breathing Complete"
          subtitle={selected?.name ?? 'Session finished'}
          question="How do you feel?"
          onRate={handleRate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, paddingBottom: 0, gap: Spacing.xs },
  backText: { fontSize: 16, fontWeight: '500' },
  scrollContent: { padding: Spacing.lg, paddingTop: Spacing.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  title: { fontSize: 28, fontWeight: '700', marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: Spacing.xl, paddingHorizontal: Spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  cardSubtitle: { fontSize: 14, marginBottom: 4 },
  duration: { fontSize: 13, fontWeight: '600' },
  activeTitle: { fontSize: 24, fontWeight: '700', marginBottom: Spacing.md },
  instructions: { fontSize: 15, textAlign: 'center', marginBottom: Spacing.xl, paddingHorizontal: Spacing.md, lineHeight: 22 },
  timerCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  timerText: { fontSize: 48, fontWeight: '800' },
  stopBtn: { marginTop: Spacing.xl, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1 },
  stopText: { fontSize: 14, fontWeight: '500' },
  startBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.full },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
