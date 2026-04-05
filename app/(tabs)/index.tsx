import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProtocolIcon } from '@/components/protocol-icon';

interface TrainCard {
  title: string;
  subtitle: string;
  iconName: string;
  route: string;
  duration: string;
}

const trainCards: TrainCard[] = [
  {
    title: 'Deep Focus',
    subtitle: 'Train your attention with visual focus drills',
    iconName: 'crosshairs-gps',
    route: '/train/focus',
    duration: '5 – 90 MIN',
  },
  {
    title: 'Boredom Sit',
    subtitle: 'Build tolerance to stillness and silence',
    iconName: 'meditation',
    route: '/train/boredom',
    duration: '2 – 20 MIN',
  },
  {
    title: 'Breathing',
    subtitle: 'Physiological sighs, box breathing, and more',
    iconName: 'weather-windy',
    route: '/train/breathing',
    duration: '2 – 10 MIN',
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.dateLabel, { color: colors.textMuted }]}>{getDateLabel()}</Text>
        <Text style={[styles.dayName, { color: colors.text }]}>{getDayName()}</Text>

        <View style={styles.cardList}>
          {trainCards.map((card) => (
            <Pressable
              key={card.title}
              style={[styles.card, { backgroundColor: colors.surface }]}
              onPress={() => router.push(card.route as any)}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardDuration, { color: colors.primary }]}>
                  {card.duration}
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {card.subtitle}
              </Text>
              <View style={[styles.cardIconRow, { backgroundColor: colors.background }]}>
                <ProtocolIcon name={card.iconName} />
              </View>
            </Pressable>
          ))}
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
  dayName: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: Spacing.xl,
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
    marginBottom: Spacing.sm,
  },
  cardDuration: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
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
