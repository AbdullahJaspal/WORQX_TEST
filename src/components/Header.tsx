import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Icon, Text } from '.';
import { icons } from '../assets/icons';
import Logo from './../assets/images/worqx_logo_.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Routes';
import { moderateScale } from '../utils/scaling';
import { HeaderProps } from './types';



const Header: React.FC<HeaderProps> = ({
  onPress,
  logoVisible = true,
  white,
  title,
  auth,
  leftIcon,
  onPressLeft,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          width: auth ? '85%' : '90%',
        },
      ]}>
      {auth ? (
        <>
          <View style={{ position: 'absolute' }}>
            <Icon
              source={icons.back}
              size={18}
              color={white ? 'white' : ''}
              onPress={handlePress}
            />
          </View>
          {logoVisible && (
            <View style={styles.logoContainer}>
              <Logo width={80} height={80} />
            </View>
          )}
        </>
      ) : (
        <View
          style={{
            height: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pressable onPress={handlePress} style={{ padding: 4 }}>
            <Icon
              source={icons.back}
              size={18}
              color={white ? 'white' : ''}
              disabled
            />
          </Pressable>
          <View style={{ alignSelf: 'center' }}>
            <Text textStyle="medium20">{title}</Text>
          </View>
          <Pressable
            disabled={!leftIcon}
            onPress={onPressLeft}
            style={{ padding: 4 }}>
            <Icon size={moderateScale(28)} disabled source={leftIcon} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
});

export default Header;
