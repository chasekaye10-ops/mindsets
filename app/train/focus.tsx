import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { saveSession } from '@/db/schema';
import { focusProtocols } from '@/data/protocols';

type Phase = 'select' | 'prep' | 'active' | 'rating' | 'done';

export default function FocusSession() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [timeLeft, setTimeLeft] = useState(0);
  const [rating, setRating] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const durations = [
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '25 min', seconds: 1500 },
    { label: '45 min', seconds: 2700 },
    { label: '90 min', seconds: 5400 },
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startPrep() {
    setPhase('prep');
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          startSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function startSession() {
    setPhase('active');
    setTimeLeft(selectedDuration);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setPhase('rating');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function endEarly() {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setSelectedDuration(elapsed);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('rating');
  }

  async function submitRating(r: number) {
    setRating(r);
    await saveSession('focus', selectedDuration, r);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('done');
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
        <View style={styles.centered}>
          <Text style={[styles.title, { color: colors.text }]}>Deep Focus</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {focusProtocols[0].instructions}
          </Text>
          <Text style={[styles.pickLabel, { color: colors.textMuted }]}>Choose duration:</Text>
          <View style={styles.durationGrid}>
            {durations.map((d) => (
              <Pressable
                key={d.seconds}
                style={[
                  styles.durationBtn,
                  {
                    backgroundColor: selectedDuration === d.seconds ? colors.primary : colors.surface,
                    borderColor: selectedDuration === d.seconds ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedDuration(d.seconds)}>
                <Text
                  style={[
                    styles.durationText,
                    { color: selectedDuration === d.seconds ? '#fff' : colors.text },
                  ]}>
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={[styles.startBtn, { backgroundColor: colors.primary }]} onPress={startPrep}>
            <Text style={styles.startBtnText}>Begin Session</Text>
          </Pressable>
        </View>
      )}

      {phase === 'prep' && (
        <View style={styles.centered}>
          <Text style={[styles.prepTitle, { color: colors.accent }]}>Breathe</Text>
          <Text style={[styles.prepInstructions, { color: colors.textMuted }]}>
            Double inhale through nose... long exhale through mouth
          </Text>
          <Text style={[styles.timerText, { color: colors.primary }]}>{timeLeft}</Text>
        </View>
      )}

      {phase === 'active' && (
        <View style={styles.centered}>
          <Text style={[styles.activeLabel, { color: colors.textMuted }]}>Focus</Text>
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
        <View style={styles.centered}>
          <Text style={[styles.title, { color: colors.text }]}>Session Complete</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>How focused were you?</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((r) => (
              <Pressable
                key={r}
                style={[
                  styles.ratingBtn,
                  {
                    backgroundColor: rating === r ? colors.primary : colors.surface,
                    borderColor: rating === r ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => submitRating(r)}>
                <Text style={[styles.ratingText, { color: rating === r ? '#fff' : colors.text }]}>
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {phase === 'done' && (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="check-circle-outline" size={56} color={colors.success} />
          <Text style={[styles.title, { color: colors.text, marginTop: Spacing.md }]}>Well Done</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {formatTime(selectedDuration)} of deep focus. Rated {rating}/5.
          </Text>
          <Pressable style={[styles.startBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.startBtnText}>Back to Training</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, paddingBottom: 0, gap: Spacing.xs },
  backText: { fontSize: 16, fontWeight: '500' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  title: { fontSize: 28, fontWeight: '700', marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: Spacing.xl, paddingHorizontal: Spacing.lg },
  pickLabel: { fontSize: 14, marginBottom: Spacing.md },
  durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.xl },
  durationBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1 },
  durationText: { fontSize: 16, fontWeight: '600' },
  startBtn: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.full },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  prepTitle: { fontSize: 32, fontWeight: '700', marginBottom: Spacing.md },
  prepInstructions: { fontSize: 16, textAlign: 'center', marginBottom: Spacing.xl },
  activeLabel: { fontSize: 16, fontWeight: '500', marginBottom: Spacing.lg },
  timerCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  timerText: { fontSize: 48, fontWeight: '800' },
  stopBtn: { marginTop: Spacing.xl, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1 },
  stopText: { fontSize: 14, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', gap: Spacing.md },
  ratingBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  ratingText: { fontSize: 20, fontWeight: '700' },
});
