import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremium } from '@/hooks/use-premium';

const features = [
  { icon: 'infinity', text: 'Unlimited sessions' },
  { icon: 'book-open-variant', text: 'Full protocol library' },
  { icon: 'headphones', text: 'Audio walking meditations' },
  { icon: 'chart-timeline-variant-shimmer', text: 'Adaptive AI progression' },
  { icon: 'trophy-outline', text: 'Unlimited challenges' },
  { icon: 'chart-bar', text: 'Full progress analytics' },
];

export default function PaywallScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { unlock } = usePremium();

  async function handlePurchase() {
    // In production: RevenueCat purchase flow
    // For now: simulate purchase
    await unlock();
    router.back();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
      </Pressable>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
          <MaterialCommunityIcons name="lock-open-outline" size={40} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Unlock Everything</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          One-time purchase. No subscriptions. Yours forever.
        </Text>

        <View style={styles.featureList}>
          {features.map((f) => (
            <View key={f.text} style={styles.featureRow}>
              <MaterialCommunityIcons name={f.icon as any} size={22} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceBox}>
          <Text style={[styles.price, { color: colors.primary }]}>$4.99</Text>
          <Text style={[styles.priceLabel, { color: colors.textMuted }]}>one-time</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.purchaseBtn, { backgroundColor: colors.primary }]} onPress={handlePurchase}>
          <Text style={styles.purchaseBtnText}>Unlock Full Access</Text>
        </Pressable>
        <Text style={[styles.terms, { color: colors.textMuted }]}>
          Restore purchase  |  Terms  |  Privacy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeBtn: { alignSelf: 'flex-end', padding: Spacing.lg },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.xl },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: { fontSize: 28, fontWeight: '800', marginBottom: Spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: Spacing.xl },
  featureList: { width: '100%', gap: Spacing.md, marginBottom: Spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureText: { fontSize: 16, fontWeight: '500' },
  priceBox: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.xs },
  price: { fontSize: 48, fontWeight: '800' },
  priceLabel: { fontSize: 18, fontWeight: '500' },
  footer: { padding: Spacing.xl, gap: Spacing.md },
  purchaseBtn: {
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  purchaseBtnText: { color: '#fff', fontSize: 19, fontWeight: '700' },
  terms: { fontSize: 12, textAlign: 'center' },
});
