import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface SessionRatingProps {
  title: string;
  subtitle: string;
  question: string;
  onRate: (rating: number) => void;
}

/**
 * Reusable post-session rating screen.
 * Shows for ALL session types (focus, boredom, breathing, audio).
 */
export function SessionRating({ title, subtitle, question, onRate }: SessionRatingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selected, setSelected] = useState(0);

  function handleRate(rating: number) {
    setSelected(rating);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Small delay so user sees their selection before transitioning
    setTimeout(() => onRate(rating), 300);
  }

  const labels = ['', 'Rough', 'Hard', 'Okay', 'Good', 'Great'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MaterialCommunityIcons name="check-circle-outline" size={56} color={colors.success} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      <Text style={[styles.question, { color: colors.textSecondary }]}>{question}</Text>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((r) => (
          <Pressable
            key={r}
            style={[
              styles.ratingBtn,
              {
                backgroundColor: selected === r ? colors.primary : colors.surface,
                borderColor: selected === r ? colors.primary : colors.border,
              },
            ]}
            onPress={() => handleRate(r)}>
            <Text
              style={[
                styles.ratingText,
                { color: selected === r ? '#fff' : colors.text },
              ]}>
              {r}
            </Text>
          </Pressable>
        ))}
      </View>
      {selected > 0 && (
        <Text style={[styles.ratingLabel, { color: colors.primary }]}>
          {labels[selected]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: { fontSize: 24, fontWeight: '800', marginTop: Spacing.md, marginBottom: Spacing.xs },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: Spacing.xl },
  question: { fontSize: 16, fontWeight: '600', marginBottom: Spacing.lg },
  ratingRow: { flexDirection: 'row', gap: Spacing.md },
  ratingBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: { fontSize: 20, fontWeight: '700' },
  ratingLabel: { marginTop: Spacing.sm, fontSize: 15, fontWeight: '600' },
});
