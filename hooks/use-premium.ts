import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const ENTITLEMENT_ID = 'lifetime'; // matches RevenueCat entitlement
const PRODUCT_ID = 'com.mindsets.app.lifetime'; // matches App Store Connect IAP

let configured = false;

/**
 * Configure RevenueCat. Call once at app startup.
 */
export async function configurePurchases() {
  if (configured) return;
  const apiKey = Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '',
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '',
  });
  if (!apiKey) {
    console.warn('RevenueCat API key not set');
    return;
  }
  await Purchases.configure({ apiKey });
  configured = true;
}

export function usePremium() {
  const [isPremium, setIsPremium] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasePackage, setPurchasePackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    try {
      // First check RevenueCat for active entitlement
      await configurePurchases();
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
          await AsyncStorage.setItem('is_premium', 'true');
          setIsPremium(true);
          setIsTrialActive(false);
          setIsLoading(false);
          return;
        }
      } catch {
        // RevenueCat not available (Expo Go), fall through to local check
      }

      // Local premium flag (set after purchase)
      const purchased = await AsyncStorage.getItem('is_premium');
      if (purchased === 'true') {
        setIsPremium(true);
        setIsTrialActive(false);
        setIsLoading(false);
        return;
      }

      // Trial logic
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
        setIsPremium(true);
        setIsTrialActive(true);
      }

      // Load the purchase package for the paywall
      try {
        const offerings = await Purchases.getOfferings();
        const pkg = offerings.current?.availablePackages?.find(
          (p) => p.product.identifier === PRODUCT_ID
        ) ?? offerings.current?.availablePackages?.[0];
        if (pkg) setPurchasePackage(pkg);
      } catch {
        // Offerings not available
      }
    } catch {
      setIsPremium(true);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Make a real purchase via RevenueCat / Apple StoreKit.
   * Returns true if successful.
   */
  async function purchase(): Promise<boolean> {
    if (!purchasePackage) {
      console.warn('No purchase package available');
      return false;
    }
    try {
      const { customerInfo } = await Purchases.purchasePackage(purchasePackage);
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        await AsyncStorage.setItem('is_premium', 'true');
        setIsPremium(true);
        setIsTrialActive(false);
        return true;
      }
      return false;
    } catch (err: any) {
      if (!err.userCancelled) {
        console.error('Purchase failed:', err);
      }
      return false;
    }
  }

  /**
   * Restore previous purchase (for users on new devices).
   */
  async function restore(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        await AsyncStorage.setItem('is_premium', 'true');
        setIsPremium(true);
        setIsTrialActive(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Restore failed:', err);
      return false;
    }
  }

  return {
    isPremium,
    isTrialActive,
    isLoading,
    price: purchasePackage?.product.priceString ?? '$4.99',
    purchase,
    restore,
  };
}
