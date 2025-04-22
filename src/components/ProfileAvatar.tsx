import React, { useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/themeContext';
import { Text } from '.';
import { getUserInitials } from '../utils/utils';
import { ProfileAvatarProps } from './types';



const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  uri,
  firstName = '',
  lastName = '',
  size = 50,
  style,
  textStyle
}) => {
  const { colors } = useTheme();

  const containerStyle = useMemo(() => ({
    width: size,
    height: size,
    borderRadius: size / 2,
  }), [size]);

  const initials = useMemo(() =>
    getUserInitials(firstName, lastName)
    , [firstName, lastName]);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.profileImage, containerStyle, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.profileImage,
        containerStyle,
        style,
        { backgroundColor: colors.grey },
      ]}>
      <Text textStyle={textStyle} color={colors.primary}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(ProfileAvatar);