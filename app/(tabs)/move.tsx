import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProtocolIcon } from '@/components/protocol-icon';
import { walkingMeditations, cognitiveWorkouts, Protocol } from '@/data/protocols';

export default function MoveScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.text }]}>Move</Text>
        <Text style={[styles.subheader, { color: colors.textMuted }]}>
          Physical training that sharpens your mind
        </Text>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>WALKING MEDITATIONS</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {walkingMeditations.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => item.audio
              ? router.push({ pathname: '/session/audio', params: { id: item.id } } as any)
              : null
            }>
            <ProtocolIcon name={item.iconName} />
            <View style={styles.cardText}>
              <View style={styles.cardTopRow}>
                <Text style={[styles.cardDuration, { color: colors.primary }]}>
                  {item.duration} MIN
                </Text>
                {item.audio && (
                  <MaterialCommunityIcons name="headphones" size={16} color={colors.primary} />
                )}
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {item.description}
              </Text>
            </View>
          </Pressable>
        ))}

        <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: Spacing.xl }]}>
          COGNITIVE WORKOUTS
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {cognitiveWorkouts.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => item.audio
              ? router.push({ pathname: '/session/audio', params: { id: item.id } } as any)
              : null
            }>
            <ProtocolIcon name={item.iconName} />
            <View style={styles.cardText}>
              <View style={styles.cardTopRow}>
                <Text style={[styles.cardDuration, { color: colors.primary }]}>
                  {item.duration} MIN
                </Text>
                {item.audio && (
                  <MaterialCommunityIcons name="headphones" size={16} color={colors.primary} />
                )}
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
                {item.description}
              </Text>
              <Text style={[styles.benefit, { color: colors.textSecondary }]}>
                {item.brainBenefit}
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
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardText: { flex: 1 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  cardDuration: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  benefit: { fontSize: 13, fontStyle: 'italic', lineHeight: 19 },
});
