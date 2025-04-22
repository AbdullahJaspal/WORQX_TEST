import type React from 'react';
import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { hideToast } from '../redux/features/toastSlice';
import { useTheme } from '../context/themeContext';
import { Icon, Text } from '.';
import { icons } from '../assets/icons';

const Toast: React.FC<{ stacked?: boolean }> = ({ stacked = true }) => {
  const toastStack = useSelector((state: RootState) => state.toast.toastStack);
  const toastsToRender = stacked ? toastStack : toastStack.slice(-1);

  return (
    <View style={styles.container}>
      {toastsToRender.map((toast, index) => (
        <ToastItem key={toast.id} toast={toast} index={index} />
      ))}
    </View>
  );
};

const ToastItem: React.FC<{ toast: any; index: number }> = ({ toast, index }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (toast.visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 100 }),
      );
      translateY.value = withTiming(index * -10, { duration: 200 });
      const hideTimeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(-100, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 });
        dispatch(hideToast(toast.id));
      }, 2500);

      return () => clearTimeout(hideTimeout);
    }
  }, [toast.visible, dispatch, opacity, scale, translateY, toast.id, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    zIndex: index,
  }));

  const getToastBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'rgba(76, 175, 80, 1)';
      case 'error':
        return 'rgba(255, 0, 0, 1)';
      case 'warning':
        return 'rgba(255, 165, 0, 1)';
      default:
        return 'rgba(0, 0, 0, 1)';
    }
  };

  const borderRadius = useMemo(() => {
    const maxRadius = 100;
    const minRadius = 4;
    const maxLength = 50;
    const messageLength = toast?.message?.length;

    return Math.max(
      minRadius,
      maxRadius - (messageLength / maxLength) * (maxRadius - minRadius),
    );
  }, [toast.message]);

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <View
        style={[
          styles.toast,
          {
            backgroundColor: getToastBackgroundColor(),
            borderRadius: borderRadius,
          },
        ]}>
        <Icon
          source={toast.type === 'error' ? icons.closefill : icons.checked}
          color={colors.background}
          onPress={() => {
            dispatch(hideToast(toast.id));
          }}
        />
        <Text
          textStyle="regular14"
          color={colors.background}
          numberOfLines={5}
          style={{ width: '80%' }}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: '50%',
    maxWidth: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    gap: 10,
    alignSelf: 'center',
    flexShrink: 1,
  },
});

export default Toast;
