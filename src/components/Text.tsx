import React from 'react';
import { Text as RNText, StyleSheet, } from 'react-native';
import fonts from '../theme/fonts';
import { useTheme } from '../context/themeContext';
import { moderateScale } from '../utils/scaling';
import { CustomTextProps } from './types';

const Text: React.FC<CustomTextProps> = ({
  textStyle,
  color,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <RNText
      style={[
        { color: color || colors.primary },
        textStyle ? textStyles[textStyle] : {},
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

export const textStyles = StyleSheet.create({
  regular8: { fontFamily: fonts.family.regular, fontSize: moderateScale(8) },
  regular10: { fontFamily: fonts.family.regular, fontSize: moderateScale(10) },
  regular12: { fontFamily: fonts.family.regular, fontSize: moderateScale(12) },
  regular14: { fontFamily: fonts.family.regular, fontSize: moderateScale(14) },
  regular16: { fontFamily: fonts.family.regular, fontSize: moderateScale(16) },
  regular18: { fontFamily: fonts.family.regular, fontSize: moderateScale(18) },
  regular20: { fontFamily: fonts.family.regular, fontSize: moderateScale(20) },
  regular24: { fontFamily: fonts.family.regular, fontSize: moderateScale(24) },
  medium10: { fontFamily: fonts.family.medium, fontSize: moderateScale(10) },
  medium12: { fontFamily: fonts.family.medium, fontSize: moderateScale(12) },
  medium14: { fontFamily: fonts.family.medium, fontSize: moderateScale(14) },
  medium16: { fontFamily: fonts.family.medium, fontSize: moderateScale(16) },
  medium20: { fontFamily: fonts.family.medium, fontSize: moderateScale(20) },
  semibold10: { fontFamily: fonts.family.semibold, fontSize: moderateScale(10) },
  semibold12: { fontFamily: fonts.family.semibold, fontSize: moderateScale(12) },
  semibold16: { fontFamily: fonts.family.semibold, fontSize: moderateScale(16) },
  semibold18: { fontFamily: fonts.family.semibold, fontSize: moderateScale(18) },
  semibold20: { fontFamily: fonts.family.semibold, fontSize: moderateScale(20) },
  semibold24: { fontFamily: fonts.family.semibold, fontSize: moderateScale(24) },
  bold12: { fontFamily: fonts.family.bold, fontSize: moderateScale(12) },
  bold16: { fontFamily: fonts.family.bold, fontSize: moderateScale(16) },
  bold24: { fontFamily: fonts.family.bold, fontSize: moderateScale(24) },
});

export default Text;
