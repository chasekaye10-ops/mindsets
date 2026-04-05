import { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { saveSession } from '@/db/schema';
import { walkingMeditations, cognitiveWorkouts } from '@/data/protocols';

export default function AudioSession() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { id } = useLocalSearchParams<{ id: string }>();
  const player = useAudioPlayer();

  const allProtocols = [...walkingMeditations, ...cognitiveWorkouts];
  const protocol = allProtocols.find((p) => p.id === id);

  useEffect(() => {
    if (protocol?.audio) {
      player.load(protocol.audio);
    }
    return () => {
      player.unload();
    };
  }, []);

  async function handleFinish() {
    await player.unload();
    if (protocol) {
      await saveSession('walk', protocol.duration * 60, 5);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function formatMs(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const progress = player.durationMs > 0 ? player.positionMs / player.durationMs : 0;

  if (!protocol) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>
          Protocol not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.backBtn} onPress={() => { player.unload(); router.back(); }}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary} />
        <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
      </Pressable>

      <View style={styles.centered}>
        <Text style={[styles.duration, { color: colors.primary }]}>
          {protocol.duration} MIN
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>{protocol.name}</Text>
        <Text style={[styles.instructions, { color: colors.textMuted }]}>
          {protocol.instructions}
        </Text>

        {/* Progress ring */}
        <View style={[styles.ring, { borderColor: colors.surfaceAlt }]}>
          <View
            style={[styles.ringProgress, {
              borderColor: colors.primary,
              borderTopColor: progress > 0.25 ? colors.primary : 'transparent',
              borderRightColor: progress > 0.5 ? colors.primary : 'transparent',
              borderBottomColor: progress > 0.75 ? colors.primary : 'transparent',
              transform: [{ rotate: '-45deg' }],
            }]}
          />
          <Text style={[styles.time, { color: colors.text }]}>
            {formatMs(player.positionMs)}
          </Text>
          <Text style={[styles.timeTotal, { color: colors.textMuted }]}>
            / {formatMs(player.durationMs)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
            onPress={() => player.togglePlayPause()}>
            <MaterialCommunityIcons
              name={player.isPlaying ? 'pause' : 'play'}
              size={36}
              color="#fff"
            />
          </Pressable>
        </View>

        <Pressable style={[styles.finishBtn, { borderColor: colors.border }]} onPress={handleFinish}>
          <Text style={[styles.finishText, { color: colors.textMuted }]}>End Session</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, paddingBottom: 0, gap: Spacing.xs },
  backText: { fontSize: 16, fontWeight: '500' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  duration: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: Spacing.xs },
  title: { fontSize: 28, fontWeight: '800', marginBottom: Spacing.sm, textAlign: 'center' },
  instructions: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl, paddingHorizontal: Spacing.md },
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  ringProgress: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
  },
  time: { fontSize: 36, fontWeight: '800' },
  timeTotal: { fontSize: 14 },
  controls: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.xl },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  finishText: { fontSize: 14, fontWeight: '500' },
});
