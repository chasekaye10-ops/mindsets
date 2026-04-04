import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_complete').then((value) => {
      setIsComplete(value === 'true');
    });
  }, []);

  return { isOnboardingComplete: isComplete, isLoading: isComplete === null };
}
