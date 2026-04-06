import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremium } from '@/hooks/use-premium';
import { ProtocolIcon } from '@/components/protocol-icon';
import { getDailySuggestion, DailySuggestion } from '@/utils/daily-suggestion';
import { calculateStreak } from '@/utils/streaks';

interface TrainCard {
  title: string;
  subtitle: string;
  iconName: string;
  route: string;
  duration: string;
  isFree: boolean;
}

const trainCards: TrainCard[] = [
  {
    title: 'Deep Focus',
    subtitle: 'Train your attention with visual focus drills',
    iconName: 'crosshairs-gps',
    route: '/train/focus',
    duration: '5 – 90 MIN',
    isFree: true, // basic focus is always free
  },
  {
    title: 'Boredom Sit',
    subtitle: 'Build tolerance to stillness and silence',
    iconName: 'meditation',
    route: '/train/boredom',
    duration: '2 – 20 MIN',
    isFree: false,
  },
  {
    title: 'Breathing',
    subtitle: 'Physiological sighs, box breathing, and more',
    iconName: 'weather-windy',
    route: '/train/breathing',
    duration: '2 – 10 MIN',
    isFree: false,
  },
];

function getDayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

function getDateLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase();
}

export default function TrainScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isPremium } = usePremium();
  const [suggestion, setSuggestion] = useState<DailySuggestion | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getDailySuggestion().then(setSuggestion);
    calculateStreak().then(setStreak);
  }, []);

  function handleCardPress(card: TrainCard) {
    if (!card.isFree && !isPremium) {
      router.push('/paywall' as any);
    } else {
      router.push(card.route as any);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.dateLabel, { color: colors.textMuted }]}>{getDateLabel()}</Text>
        <View style={styles.headerRow}>
          <Text style={[styles.dayName, { color: colors.text }]}>{getDayName()}</Text>
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: colors.surface }]}>
              <MaterialCommunityIcons name="fire" size={18} color={colors.warm} />
              <Text style={[styles.streakText, { color: colors.text }]}>{streak}</Text>
            </View>
          )}
        </View>

        {/* Daily Suggestion */}
        {suggestion && (
          <Pressable
            style={[styles.suggestionCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push(suggestion.route as any)}>
            <Text style={styles.suggestionLabel}>TODAY</Text>
            <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
            <Text style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>
          </Pressable>
        )}

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ALL EXERCISES</Text>

        <View style={styles.cardList}>
          {trainCards.map((card) => {
            const locked = !card.isFree && !isPremium;
            return (
              <Pressable
                key={card.title}
                style={[styles.card, { backgroundColor: colors.surface }]}
                onPress={() => handleCardPress(card)}>
                <View style={styles.cardTop}>
                  <Text style={[styles.cardDuration, { color: colors.primary }]}>
                    {card.duration}
                  </Text>
                  {locked && (
                    <View style={[styles.lockBadge, { backgroundColor: colors.surfaceAlt }]}>
                      <MaterialCommunityIcons name="lock-outline" size={14} color={colors.primary} />
                    </View>
                  )}
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                  {card.subtitle}
                </Text>
                <View style={[styles.cardIconRow, { backgroundColor: colors.background }]}>
                  <ProtocolIcon name={card.iconName} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: 100 },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dayName: {
    fontSize: 34,
    fontWeight: '800',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  streakText: { fontSize: 16, fontWeight: '800' },
  suggestionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  suggestionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  suggestionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  cardList: { gap: Spacing.md },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardDuration: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },
  cardIconRow: {
    alignSelf: 'flex-start',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
  },
});
