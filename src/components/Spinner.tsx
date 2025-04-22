import React from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../context/themeContext';
import { SpinnerProps } from './types';



const Spinner: React.FC<SpinnerProps> = ({
  size = 60,
  color,
  secondaryColor,
  duration = 1000,
  strokeWidth = 10,
  progress = 40,
}) => {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);
  const actualStrokeWidth = strokeWidth || Math.max(size / 10, 5);
  const primaryColor = color || colors.primary;
  const trackColor = secondaryColor || '#F0F0F0';
  const center = size / 2;
  const radius = (size - actualStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressArc = circumference * (progress / 100);
  const strokeDasharray = `${progressArc} ${circumference - progressArc}`;

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={actualStrokeWidth}
          fill="transparent"
        />
      </Svg>

      <Animated.View
        style={[{ position: 'absolute', top: 0, left: 0 }, animatedStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={primaryColor}
            strokeWidth={actualStrokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={0}
            strokeLinecap="round"
            fill="transparent"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default Spinner;
