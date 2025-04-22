import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { moderateScale, } from '../utils/scaling';
import { IconProps } from './types';


const Icon: React.FC<IconProps> = ({
  source,
  size = moderateScale(24),
  style,
  color,
  onPress,
  disabled = onPress ? false : true,
  round,
}) => {
  return (
    <Pressable
      style={[styles.iconContainer, { width: size, height: size }, style]}
      disabled={disabled}
      onPress={onPress}>
      <Image
        source={source}
        style={{
          width: size,
          height: size,
          resizeMode: 'contain',
          tintColor: color,
          borderRadius: round ? size / 2 : 0,
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Icon;
