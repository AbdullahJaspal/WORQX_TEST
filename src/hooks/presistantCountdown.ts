import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownOptions } from './types';


export const usePersistentCountdown = ({
  duration,
  key,
  autoStart = false,
}: CountdownOptions) => {
  const [countdown, setCountdown] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const mountedRef = useRef<boolean>(false);
  const keyRef = useRef<string>(key);
  const instanceIdRef = useRef<string>(`${key}_${Date.now()}`);

  const calculateTimeRemaining = (expiry: number): number => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
    return remaining;
  };
  const resetCountdown = useCallback(async () => {
    setExpiryTime(null);
    setCountdown(0);
    setIsActive(false);

    try {
      await AsyncStorage.removeItem(`countdown_${key}`);
    } catch (error) {
      console.error(`Failed to remove expiry time for ${key}:`, error);
    }
  }, [key]);


  useEffect(() => {
    if (mountedRef.current && keyRef.current !== key) {
      resetCountdown();
      keyRef.current = key;
      instanceIdRef.current = `${key}_${Date.now()}`;
    }

    if (!mountedRef.current) {
      mountedRef.current = true;
      keyRef.current = key;
    }
  }, [key, resetCountdown]);

  const startCountdown = useCallback(async () => {
    const newExpiryTime = Date.now() + duration * 1000;
    setExpiryTime(newExpiryTime);
    setCountdown(duration);
    setIsActive(true);

    try {
      await AsyncStorage.setItem(
        `countdown_${key}`,
        JSON.stringify({
          expiryTime: newExpiryTime,
          instanceId: instanceIdRef.current,
        }),
      );
    } catch (error) {
      console.error(`Failed to save expiry time for ${key}:`, error);
    }
  }, [duration, key]);


  useEffect(() => {
    const loadExpiryTime = async () => {
      try {
        const savedData = await AsyncStorage.getItem(`countdown_${key}`);

        if (savedData) {
          const { expiryTime: savedExpiryTime, instanceId } =
            JSON.parse(savedData);

          if (!autoStart || instanceId === instanceIdRef.current) {
            const remaining = calculateTimeRemaining(savedExpiryTime);

            if (remaining > 0) {
              setExpiryTime(savedExpiryTime);
              setCountdown(remaining);
              setIsActive(true);
            } else {
              resetCountdown();
            }
          } else if (autoStart) {
            startCountdown();
          }
        } else if (autoStart) {
          startCountdown();
        }
      } catch (error) {
        console.error(`Failed to load expiry time for ${key}:`, error);
      }
    };

    loadExpiryTime();

    return () => {
    };
  }, [key, autoStart, resetCountdown, startCountdown]);

  useEffect(() => {
    if (!isActive) return;

    const updateCountdown = () => {
      if (expiryTime) {
        const remaining = calculateTimeRemaining(expiryTime);
        setCountdown(remaining);

        if (remaining <= 0) {
          resetCountdown();
        }
      }
    };

    const timer = setInterval(updateCountdown, 1000);

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          updateCountdown();
        }
      },
    );

    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [expiryTime, isActive, resetCountdown]);

  const formattedTime = `${String(Math.floor(countdown / 60)).padStart(
    2,
    '0',
  )}:${String(countdown % 60).padStart(2, '0')}`;

  return {
    countdown,
    formattedTime,
    isActive,
    startCountdown,
    resetCountdown,
    isExpired: countdown === 0,
  };
};
