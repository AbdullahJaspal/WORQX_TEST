import React from 'react';
import {
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/themeContext';
import { Icon, Text } from '.';
import { verticalScale } from '../utils/scaling';
import { ButtonProps } from './types';


const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  textColor,
  textStyle = 'semibold16',
  borderRadius = 100,
  paddingHorizontal = 20,
  width,
  height = verticalScale(50),
  disabled,
  style,
  borderColor,
  icon,
  iconSize = 12,
}) => {
  const { colors } = useTheme();

  const defaultBorderColor = borderColor || backgroundColor || colors.primary;
  const defaultTextColor =
    textColor ||
    (backgroundColor === colors.primary ? colors.white : colors.primary);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor || colors.background,
          width,
          height,
          borderRadius,
          paddingHorizontal,
          borderWidth: 1,
          borderColor: defaultBorderColor,
          flexDirection: 'row',
          gap: icon ? 6 : 0,
        },
        style,
      ]}>
      <Text textStyle={textStyle} color={defaultTextColor}>
        {title}
      </Text>
      {icon && (
        <Icon source={icon} size={iconSize} color={textColor} disabled />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
