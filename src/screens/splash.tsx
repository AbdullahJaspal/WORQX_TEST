import React, { useEffect } from 'react';
import { View, StyleSheet, } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Logo from '../assets/images/worqx_logo_.svg';
import { useTheme } from '../context/themeContext';
import { Button } from '../components';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList, routes } from '../navigation/Routes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Splash: React.FC = () => {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const authStack = useSelector((state: RootState) => state.auth);
  const logoScale = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));
  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 1000 });
    const timer = setTimeout(() => {
      if (authStack.token) {
        navigation.replace(routes.bottomTab);
      } else {
        buttonsOpacity.value = withTiming(1, { duration: 500 });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [logoScale, buttonsOpacity, authStack.token, navigation]);
  const onPressSignin = () => {
    navigation.navigate(routes.auth, { screen: routes.signIn });
  };
  const onPressCreateAccount = () => {
    navigation.navigate(routes.auth, { screen: routes.signUp });
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Logo width={260} height={260} />
      </Animated.View>

      <Animated.View style={[buttonsStyle]}>
        <Button
          title="Create Account"
          width={180}
          onPress={onPressCreateAccount}
          textColor={colors.primary}
        />
        <Button
          textColor={colors.primary}
          title="Login"
          width={180}
          onPress={onPressSignin}
          style={{ marginTop: 12 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
});

export default Splash;
