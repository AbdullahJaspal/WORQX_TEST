import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PaginationDotsProps } from './types';



const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  currentIndex,
  color = '#FFFFFF',
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = currentIndex >= index;
        const dotStyle = useAnimatedStyle(() => {
          return {
            width: withSpring(25),
            backgroundColor: isActive ? color : '#D1D1D6',
          };
        }, [isActive]);

        return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  } as ViewStyle,
  dot: {
    height: 6,
    borderRadius: 4,
    marginHorizontal: 1.5,
  } as ViewStyle,
});

export default PaginationDots;
