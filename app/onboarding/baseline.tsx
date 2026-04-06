import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupAllNotifications } from '@/utils/notifications';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Phase = 'intro' | 'running' | 'result';

export default function BaselineTest() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [phase, setPhase] = useState<Phase>('intro');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTest() {
    setPhase('running');
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }

  async function stopTest() {
    if (timerRef.current) clearInterval(timerRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('result');
  }

  async function finishOnboarding() {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    await AsyncStorage.setItem('baseline_focus_seconds', String(elapsed));
    await AsyncStorage.setItem('trial_start', new Date().toISOString());
    // Set up push notifications (morning reminder, streak alert, trial expiry)
    await setupAllNotifications();
    router.replace('/(tabs)');
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getResultMessage(): string {
    if (elapsed < 60) return 'Great starting point. Most people begin here.';
    if (elapsed < 180) return 'Solid baseline. You have a foundation to build on.';
    if (elapsed < 600) return 'Impressive. Your focus is already above average.';
    return 'Exceptional. You have strong natural focus.';
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {phase === 'intro' && (
        <View style={styles.centered}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accent + '10' }]}>
            <MaterialCommunityIcons name="timer-outline" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Baseline Test</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>
            Focus on a single point in front of you. Tap the button when your mind wanders for the first time. This measures your starting focus capacity.
          </Text>
          <Pressable style={[styles.startBtn, { backgroundColor: colors.accent }]} onPress={startTest}>
            <Text style={styles.startBtnText}>Start Test</Text>
          </Pressable>
        </View>
      )}

      {phase === 'running' && (
        <View style={styles.centered}>
          <Text style={[styles.runningLabel, { color: colors.textMuted }]}>
            Focus on one point...
          </Text>
          <View style={[styles.timerCircle, { borderColor: colors.accent }]}>
            <Text style={[styles.timerText, { color: colors.accent }]}>{formatTime(elapsed)}</Text>
          </View>
          <Pressable style={[styles.lostFocusBtn, { backgroundColor: colors.primary }]} onPress={stopTest}>
            <Text style={styles.lostFocusBtnText}>I Lost Focus</Text>
          </Pressable>
        </View>
      )}

      {phase === 'result' && (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="check-circle-outline" size={56} color={colors.success} />
          <Text style={[styles.title, { color: colors.text, marginTop: Spacing.md }]}>
            {formatTime(elapsed)}
          </Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>{getResultMessage()}</Text>
          <Text style={[styles.bodySmall, { color: colors.textMuted }]}>
            We'll use this as your starting point and adapt as you improve.
          </Text>
          <Pressable style={[styles.startBtn, { backgroundColor: colors.primary }]} onPress={finishOnboarding}>
            <Text style={styles.startBtnText}>Start Training</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: { fontSize: 32, fontWeight: '800', marginBottom: Spacing.md, textAlign: 'center' },
  body: { fontSize: 17, textAlign: 'center', lineHeight: 26, paddingHorizontal: Spacing.md, marginBottom: Spacing.xl },
  bodySmall: { fontSize: 14, textAlign: 'center', marginBottom: Spacing.xl, paddingHorizontal: Spacing.lg },
  startBtn: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  runningLabel: { fontSize: 18, fontWeight: '500', marginBottom: Spacing.xl, fontStyle: 'italic' },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  timerText: { fontSize: 52, fontWeight: '800' },
  lostFocusBtn: {
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  lostFocusBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
