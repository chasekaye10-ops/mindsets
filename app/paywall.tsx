import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
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
  const { purchase, restore, price } = usePremium();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  async function handlePurchase() {
    setPurchasing(true);
    try {
      const success = await purchase();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      }
    } catch {
      Alert.alert('Purchase failed', 'Please try again.');
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const success = await restore();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Restored', 'Your purchase has been restored.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('No purchase found', 'No previous purchase was found on this Apple ID.');
      }
    } catch {
      Alert.alert('Restore failed', 'Please try again.');
    } finally {
      setRestoring(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <MaterialCommunityIcons name="close" size={24} color={colors.textMuted} />
      </Pressable>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
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
          <Text style={[styles.price, { color: colors.primary }]}>{price}</Text>
          <Text style={[styles.priceLabel, { color: colors.textMuted }]}>one-time</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.purchaseBtn, { backgroundColor: colors.primary, opacity: purchasing ? 0.7 : 1 }]}
          onPress={handlePurchase}
          disabled={purchasing}>
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseBtnText}>Unlock Full Access</Text>
          )}
        </Pressable>
        <Pressable onPress={handleRestore} disabled={restoring}>
          <Text style={[styles.restoreText, { color: colors.textMuted }]}>
            {restoring ? 'Restoring...' : 'Restore purchase'}
          </Text>
        </Pressable>
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
    justifyContent: 'center',
    minHeight: 60,
  },
  purchaseBtnText: { color: '#fff', fontSize: 19, fontWeight: '700' },
  restoreText: { fontSize: 14, textAlign: 'center', fontWeight: '500' },
});
