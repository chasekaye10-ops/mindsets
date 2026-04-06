import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure how notifications appear when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions.
 * Call this during onboarding or after first session.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule the daily morning reminder.
 * Fires every day at 8:30 AM local time.
 */
export async function scheduleMorningReminder() {
  // Cancel existing morning reminders first
  await cancelNotificationsByTag('morning');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time for your mental workout',
      body: 'A few minutes of focus training makes the whole day sharper.',
      data: { tag: 'morning' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 30,
    },
  });

  await AsyncStorage.setItem('notifications_morning', 'true');
}

/**
 * Schedule a streak-at-risk reminder.
 * Fires at 7 PM if user hasn't done a session today.
 */
export async function scheduleStreakReminder() {
  await cancelNotificationsByTag('streak');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't break your streak",
      body: "You haven't trained today. A quick session keeps your streak alive.",
      data: { tag: 'streak' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
    },
  });
}

/**
 * Schedule a trial expiring reminder.
 * Fires 20 hours after trial start (4 hours before expiry).
 */
export async function scheduleTrialExpiringReminder() {
  const trialStart = await AsyncStorage.getItem('trial_start');
  if (!trialStart) return;

  const expiryWarning = new Date(trialStart);
  expiryWarning.setHours(expiryWarning.getHours() + 20); // 4 hours before 24h expiry

  // Only schedule if the warning time is in the future
  if (expiryWarning.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your free trial ends soon',
      body: 'Unlock MindSets for $4.99 — one-time, forever.',
      data: { tag: 'trial' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: expiryWarning,
    },
  });
}

/**
 * Set up all recurring notifications.
 */
export async function setupAllNotifications() {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await scheduleMorningReminder();
  await scheduleStreakReminder();
  await scheduleTrialExpiringReminder();
}

/**
 * Cancel notifications by tag.
 */
async function cancelNotificationsByTag(tag: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.tag === tag) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}
