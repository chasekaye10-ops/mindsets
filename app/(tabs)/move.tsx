import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProtocolIcon } from '@/components/protocol-icon';
import { walkingMeditations, cognitiveWorkouts } from '@/data/protocols';

export default function MoveScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>Move Your Body</Text>
        <Text style={[styles.subheader, { color: colors.textMuted }]}>
          Physical training that sharpens your mind
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Walking Meditations
        </Text>
        {walkingMeditations.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ProtocolIcon name={item.iconName} />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {item.duration} min — {item.description}
              </Text>
            </View>
          </Pressable>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.primary, marginTop: Spacing.lg }]}>
          Cognitive Workouts
        </Text>
        <Text style={[styles.sectionDesc, { color: colors.textMuted }]}>
          Exercises proven to boost brain function
        </Text>
        {cognitiveWorkouts.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ProtocolIcon name={item.iconName} />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {item.description}
              </Text>
              <Text style={[styles.whyText, { color: colors.accent }]}>
                Brain benefit: {item.brainBenefit}
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
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: Spacing.sm },
  sectionDesc: { fontSize: 14, marginBottom: Spacing.md },
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
  whyText: { fontSize: 13, fontWeight: '500' },
});
