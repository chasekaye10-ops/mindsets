import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremium } from '@/hooks/use-premium';

interface PremiumGateProps {
  children: React.ReactNode;
  /** Features available for free (1 basic focus session per day) */
  isFreeFeature?: boolean;
}

/**
 * Wraps content that requires premium access.
 * Shows a locked overlay with upgrade CTA when trial has expired.
 */
export function PremiumGate({ children, isFreeFeature }: PremiumGateProps) {
  const { isPremium, isTrialActive, isLoading } = usePremium();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // While loading, show nothing (prevents flash)
  if (isLoading) return null;

  // Premium users and active trial users pass through
  if (isPremium) return <>{children}</>;

  // Free features always pass through
  if (isFreeFeature) return <>{children}</>;

  // Locked state - show upgrade overlay
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.centered}>
        <View style={[styles.iconCircle, { backgroundColor: colors.surfaceAlt }]}>
          <MaterialCommunityIcons name="lock-outline" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Premium Feature</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Your free trial has ended. Unlock everything for a one-time payment.
        </Text>
        <Pressable
          style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/paywall' as any)}>
          <Text style={styles.upgradeBtnText}>Unlock for $4.99</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Small lock badge to show on cards that are premium-only.
 */
export function PremiumBadge() {
  const { isPremium } = usePremium();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (isPremium) return null;

  return (
    <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
      <MaterialCommunityIcons name="lock-outline" size={14} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: Spacing.sm },
  body: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  upgradeBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.full,
  },
  upgradeBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
