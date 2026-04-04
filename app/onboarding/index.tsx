import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

interface Slide {
  iconName: string;
  title: string;
  body: string;
}

const slides: Slide[] = [
  {
    iconName: 'brain',
    title: 'Mental Fitness',
    body: 'Your mind is a muscle. Train it like one. Build focus, calm your impulses, and sharpen your thinking.',
  },
  {
    iconName: 'trending-up',
    title: 'Four Pillars',
    body: 'Deep focus training, boredom tolerance, walking meditations, and cognitive workouts — backed by neuroscience.',
  },
  {
    iconName: 'chart-timeline-variant-shimmer',
    title: 'Track Your Growth',
    body: 'Start at 5 minutes. The app adapts to you, building your focus until you can hold attention for 90 minutes straight.',
  },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentSlide, setCurrentSlide] = useState(0);

  function next() {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/onboarding/baseline');
    }
  }

  function skip() {
    router.replace('/onboarding/baseline');
  }

  const slide = slides[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipRow}>
        <Pressable onPress={skip}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
          <MaterialCommunityIcons name={slide.iconName as any} size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{slide.body}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentSlide ? colors.primary : colors.border,
                  width: i === currentSlide ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>
        <Pressable style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={next}>
          <Text style={styles.nextBtnText}>
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipRow: { alignItems: 'flex-end', padding: Spacing.lg },
  skipText: { fontSize: 16, fontWeight: '500' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: { fontSize: 32, fontWeight: '800', marginBottom: Spacing.md, textAlign: 'center' },
  body: { fontSize: 17, textAlign: 'center', lineHeight: 26, paddingHorizontal: Spacing.md },
  footer: { padding: Spacing.xl, gap: Spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: {
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
