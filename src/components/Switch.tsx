import React, { useState, useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../context/themeContext';
import { SwitchProps } from './types';



const Switch: React.FC<SwitchProps> = ({ value, onValueChange }) => {
  const [isOn, setIsOn] = useState(value);
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;
  const { colors } = useTheme();
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOn ? 18 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOn, translateX]);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    onValueChange(!isOn);
  };

  return (
    <Pressable
      onPress={toggleSwitch}
      style={[styles.switch, isOn && { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 40,
    height: 22,
    borderRadius: 20,
    backgroundColor: '#E3EBF6',
    padding: 2,
    justifyContent: 'center',
  },

  thumb: {
    width: 18,
    height: 18,
    borderRadius: 16,
    backgroundColor: 'white',
  },
});

export default Switch;
