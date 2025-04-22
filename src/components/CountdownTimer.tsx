import type React from 'react';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../components';
import { usePersistentCountdown } from '../hooks/presistantCountdown';
import { useTheme } from '../context/themeContext';
import { CountdownTimerProps } from './types';



const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  storageKey,
  onExpire,
  onResend,
  resendLabel = 'Resend Code',
  autoStart = false,
  textStyle = 'regular16',
  activeStyle,
  expiredStyle,
  forceReset = false,
}) => {
  const { colors } = useTheme();
  const { formattedTime, isExpired, isActive, startCountdown, resetCountdown } =
    usePersistentCountdown({
      duration,
      key: storageKey,
      autoStart,
    });

  useEffect(() => {
    if (forceReset) {
      resetCountdown();
      if (autoStart) {
        startCountdown();
      }
    }
  }, [storageKey, forceReset, autoStart]);

  useEffect(() => {
    if (isExpired && onExpire) {
      onExpire();
    }
  }, [isExpired, onExpire]);

  const handleResend = () => {
    if (isExpired) {
      onResend();
      startCountdown();
    }
  };

  const defaultActiveStyle = {
    color: colors.error,
    textDecorationLine: 'none',
  };

  const defaultExpiredStyle = {
    color: colors.textPrimary,
    textDecorationLine: 'underline',
  };

  return (
    <TouchableOpacity
      disabled={!isExpired}
      onPress={handleResend}
      activeOpacity={0.7}>
      <Text
        textStyle={isExpired ? textStyle : 'regular20'}
        style={
          isExpired
            ? { ...(expiredStyle || defaultExpiredStyle) }
            : { ...(activeStyle || defaultActiveStyle) }
        }>
        {isExpired ? resendLabel : formattedTime}
      </Text>
    </TouchableOpacity>
  );
};

export default CountdownTimer;
