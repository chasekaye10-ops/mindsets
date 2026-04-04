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
}

const trainCards: TrainCard[] = [
  {
    title: 'Deep Focus',
    subtitle: 'Train your attention with visual focus drills',
    iconName: 'crosshairs-gps',
    route: '/train/focus',
  },
  {
    title: 'Boredom Sit',
    subtitle: 'Build tolerance to stillness and silence',
    iconName: 'meditation',
    route: '/train/boredom',
  },
  {
    title: 'Breathing',
    subtitle: 'Physiological sighs, box breathing, and more',
    iconName: 'weather-windy',
    route: '/train/breathing',
  },
];

export default function TrainScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>Train Your Mind</Text>
        <Text style={[styles.subheader, { color: colors.textMuted }]}>
          Choose a mental exercise to begin
        </Text>

        {trainCards.map((card) => (
          <Pressable
            key={card.title}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => router.push(card.route as any)}>
            <ProtocolIcon name={card.iconName} />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {card.subtitle}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.lg, paddingTop: Spacing.xl },
  header: { fontSize: 28, fontWeight: '700', marginBottom: Spacing.xs },
  subheader: { fontSize: 16, marginBottom: Spacing.xl },
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
  cardSubtitle: { fontSize: 14 },
});
