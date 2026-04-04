import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function usePremium() {
  const [isPremium, setIsPremium] = useState(true); // default to true until loaded
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      const purchased = await AsyncStorage.getItem('is_premium');
      if (purchased === 'true') {
        setIsPremium(true);
        setIsTrialActive(false);
        setIsLoading(false);
        return;
      }

      const trialStart = await AsyncStorage.getItem('trial_start');
      if (trialStart) {
        const elapsed = Date.now() - new Date(trialStart).getTime();
        if (elapsed < TRIAL_DURATION_MS) {
          setIsPremium(true);
          setIsTrialActive(true);
        } else {
          setIsPremium(false);
          setIsTrialActive(false);
        }
      } else {
        // No trial started yet — onboarding will set it
        setIsPremium(true);
        setIsTrialActive(true);
      }
    } catch {
      setIsPremium(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function unlock() {
    // In production, this would be called after RevenueCat confirms purchase
    await AsyncStorage.setItem('is_premium', 'true');
    setIsPremium(true);
    setIsTrialActive(false);
  }

  return { isPremium, isTrialActive, isLoading, unlock };
}
