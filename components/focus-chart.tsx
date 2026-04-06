import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDB } from '@/db/schema';

interface DayData {
  date: string;
  minutes: number;
}

/**
 * Simple bar chart showing focus session duration over the last 7 days.
 * No external chart library needed - pure RN views.
 */
export function FocusChart() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [data, setData] = useState<DayData[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const db = await getDB();
      const rows = await db.getAllAsync<{ day: string; total_min: number }>(
        `SELECT date(completed_at) as day,
                SUM(duration_seconds) / 60.0 as total_min
         FROM sessions
         WHERE completed_at >= date('now', '-6 days')
         GROUP BY day
         ORDER BY day ASC`
      );

      // Build a full 7-day array (fill gaps with 0)
      const last7: DayData[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const found = rows.find((r) => r.day === dateStr);
        last7.push({
          date: dateStr,
          minutes: Math.round(found?.total_min ?? 0),
        });
      }
      setData(last7);
    } catch {
      // DB not ready
    }
  }

  const maxMin = Math.max(...data.map((d) => d.minutes), 1);
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  if (data.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.textMuted }]}>LAST 7 DAYS</Text>
      <View style={styles.chart}>
        {data.map((day, i) => {
          const height = day.minutes > 0 ? Math.max((day.minutes / maxMin) * 100, 8) : 4;
          const dayOfWeek = new Date(day.date + 'T00:00:00').getDay();
          const dayLabel = dayLabels[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
          const isToday = i === data.length - 1;

          return (
            <View key={day.date} style={styles.barCol}>
              {day.minutes > 0 && (
                <Text style={[styles.barValue, { color: colors.textMuted }]}>
                  {day.minutes}
                </Text>
              )}
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: day.minutes > 0 ? colors.primary : colors.surfaceAlt,
                    opacity: isToday ? 1 : 0.6,
                  },
                ]}
              />
              <Text
                style={[
                  styles.dayLabel,
                  { color: isToday ? colors.primary : colors.textMuted, fontWeight: isToday ? '700' : '500' },
                ]}>
                {dayLabel}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: Spacing.lg,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: Spacing.sm,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 12,
  },
});
