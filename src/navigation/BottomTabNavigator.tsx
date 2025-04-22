import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Platform, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { Icon, Modal, ProfileAvatar } from '../components';
import { icons } from '../assets/icons';
import Notifications from '../screens/homeStack/notifications';
import HomeNavigator from './HomeNavigator';

import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';

import { AppStackParamList, routes } from './Routes';
import { RootState } from '../redux/store';

import { showToast } from '../redux/features/toastSlice';

import {
  enableBioMetric,
  checkBiometricSupport,
  checkNewFingerPrintAdded,
} from 'react-native-biometric-check';
import TobeDesigned from '../screens';
import Profile from '../screens/homeStack/profile';
import { moderateScale } from '../utils/scaling';
import { BIOMETRIC_MESSAGES } from '../constants/data';

const Tab = createBottomTabNavigator();


const BottomTabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { token, userInfo } = useSelector((state: RootState) => state.auth);
  const badgeCount = useSelector((state: RootState) => state.notifications.badgeCount);

  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (token === null) {
      navigation.replace(routes.auth);
      dispatch(
        showToast({
          message: 'Login session expired! Login again',
          type: 'error',
        }),
      );
    }
  }, [token, dispatch, navigation]);

  const handleBiometricResult = useCallback(
    (res: number | string) => {
      switch (res) {
        case 1:
          dispatch(showToast({
            message: 'Biometric authentication not available on the device',
            type: 'error',
          }));
          break;
        case 2:
          dispatch(showToast({
            message: 'Biometric authentication is locked due to too many failed attempts',
            type: 'error',
          }));
          break;
        case 3:
          dispatch(showToast({
            message: 'Biometric authentication is not enrolled',
            type: 'error',
          }));
          break;
        case 4:
          dispatch(showToast({
            message: 'BIOMETRIC_STATUS_UNKNOWN',
            type: 'warning',
          }));
          break;
        case Platform.select({ android: 'BIOMETRICS_SUCCESS', ios: 5 }):
        case 'BIOMETRICS_SUCCESS':
          setModalVisible(false);
          dispatch(showToast({
            message: 'Verified successfully',
            type: 'success',
          }));
          break;
        default:
          setModalVisible(true);
          setMessage(BIOMETRIC_MESSAGES.UNAUTHORIZED);
      }
    },
    [dispatch]
  );

  // Initialize biometric authentication
  const initBiometricAuth = useCallback(() => {
    try {
      enableBioMetric(
        BIOMETRIC_MESSAGES.TITLE,
        BIOMETRIC_MESSAGES.DESCRIPTION,
        handleBiometricResult,
      );
    } catch (error) {
      console.error('Biometric error:', error);
    }
  }, [handleBiometricResult]);

  useEffect(() => {
    // Check for new fingerprints
    checkNewFingerPrintAdded(res => {
      if (res === 'NEW_FINGERPRINT_ADDED') {
        dispatch(showToast({
          message: res,
          type: 'error',
        }));
      }
    });

    // iOS specific handling
    if (Platform.OS === 'ios') {
      initBiometricAuth();
      return;
    }

    // Android handling
    checkBiometricSupport(res => {
      if (res === 'SUCCESS') {
        enableBioMetric(
          BIOMETRIC_MESSAGES.TITLE,
          BIOMETRIC_MESSAGES.DESCRIPTION,
          handleBiometricResult,
        );
      } else if (
        Platform.OS === 'android' &&
        res === 'TO_DISABLE_USE_BIOMETRICS'
      ) {
        initBiometricAuth();
      } else {
        dispatch(showToast({
          message: res,
          type: 'error',
        }));
        setModalVisible(true);
      }
    });
  }, [dispatch, handleBiometricResult, initBiometricAuth]);


  // Get tab icon based on route and focus state
  const getTabIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case routes.home:
        return focused ? icons.filledHome : icons.home;
      case routes.search:
        return icons.search;
      case routes.notifications:
        return focused ? icons.filledNoti : icons.notification;
      case routes.more:
        return icons.more;
      case routes.profile:
        return { uri: userInfo?.imageUrl };
      default:
        return focused ? icons.filledHome : icons.home;
    }
  };


  // Memoize tab bar options to prevent recreation on each render
  const screenOptions = useMemo(() => {
    return ({ route }: { route: { name: string } }) => ({
      tabBarHideOnKeyboard: true,
      headerShown: false,
      tabBarIcon: ({ focused }: { focused: boolean }) => {
        const routeName = route.name;
        const isProfileTab = routeName === routes.profile;
        const iconName = getTabIcon(routeName, focused);

        return (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {isProfileTab && iconName.uri == null ? (
              <ProfileAvatar
                uri={null}
                firstName={userInfo?.firstName}
                lastName={userInfo?.lastName}
                size={moderateScale(26)}
                textStyle={'bold12'}
              />
            ) : (
              <Icon
                source={iconName}
                size={isProfileTab ? moderateScale(26) : 24}
                disabled
                round={isProfileTab}
                color={
                  isProfileTab
                    ? undefined
                    : focused
                      ? colors.primary
                      : colors.textPrimary
                }
              />
            )}
          </View>
        );
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textPrimary,
      tabBarStyle: {
        height: Platform.OS === 'ios' ? 88 : 68,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.background,
      },
      tabBarLabelStyle: {
        fontFamily: fonts.family.regular,
        fontSize: 12,
        marginTop: 5,
      },
    });
  }, [colors, userInfo, getTabIcon]);


  // Retry biometric authentication
  const retryBiometricAuth = useCallback(() => {
    setModalVisible(false);
    initBiometricAuth();
  }, [initBiometricAuth]);

  // Memoize notification options
  const notificationOptions = useMemo(() => ({
    tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
    tabBarBadgeStyle: {
      backgroundColor: colors.error,
      color: colors.white,
      fontSize: 10,
      fontFamily: fonts.family.regular,
    },
  }), [badgeCount, colors]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator
        initialRouteName={routes.home}
        backBehavior="history"
        screenOptions={screenOptions}>
        <Tab.Screen name={routes.home} component={HomeNavigator} />
        <Tab.Screen name={routes.search} component={TobeDesigned} />
        <Tab.Screen
          name={routes.notifications}
          component={Notifications}
          options={notificationOptions}
        />
        <Tab.Screen name={routes.more} component={TobeDesigned} />
        <Tab.Screen name={routes.profile} component={Profile} />
      </Tab.Navigator>

      <Modal
        title="Authorization"
        visible={modalVisible}
        onClose={retryBiometricAuth}
        onAction={() => { }}
        message={message}
        leftButton={'Try again'}
        rightButton={''}
      />
    </SafeAreaView>
  );
};

export default React.memo(BottomTabNavigator);