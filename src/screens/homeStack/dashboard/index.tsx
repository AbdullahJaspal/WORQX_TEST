import React, { useEffect, useState, useCallback } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  Alert,
  SafeAreaView,
  Linking,
  Modal as RNModal,
  Keyboard,
} from 'react-native';
import { Icon, Modal, Text } from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { icons } from '../../../assets/icons';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { saveBusiness, saveInfo } from '../../../redux/features/authSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, routes } from '../../../navigation/Routes';
import { getBusiness, getUserInfo } from '../../../api/dashboadApi';
import { RootState } from '../../../redux/store';
import { formatDate, getGreeting, getGreetingImage } from '../../../utils/utils';
import { useCameraPermission } from 'react-native-vision-camera';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { showLoader } from '../../../redux/features/loaderSlice';
import { images } from '../../../assets/images';
import QRCode from 'react-native-qrcode-svg';
import { DashBoardProps } from './types';

const Dashboard: React.FC<DashBoardProps> = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { hasPermission, requestPermission } = useCameraPermission();

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [locationPermission, setLocationpermission] = useState<boolean>(false);
  const [qrVisible, setQrVisible] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);

  const updateCurrentTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  useEffect(() => {
    requestPermission();
    requestLocationPermission();
  }, [hasPermission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      Keyboard.dismiss();
      const fetchData = async () => {
        try {
          await fetchUserInfo();
          await fetchBussinessInfo();
        } catch (e) {
          console.error("Failed to fetch:", e);
        }
      };
      fetchData();
    }, [])
  );

  const requestLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      setLocationpermission(true);
    } else {
      const requestResult = await request(permission);
      setLocationpermission(requestResult === RESULTS.GRANTED);
      if (requestResult !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission Required',
          'Please enable location access in settings.',
        );
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      dispatch(showLoader(true));
      const response = await getUserInfo();
      dispatch(saveInfo({ userInfo: response?.user }));
    } catch (error) {
      console.log('Error', error);
    } finally {
      dispatch(showLoader(false));
    }
  };

  const fetchBussinessInfo = async () => {
    const response = await getBusiness();
    dispatch(saveBusiness(response));
    console.log('response', response);
  };


  const onPressSignout = async () => {
    setShowModal(true);
  };

  const handleAdd = async () => {
    setShowModal(prev => !prev);
    Linking.openURL('https://worqx.devreels.com/');
  };

  const handleCancel = () => {
    setShowModal(prev => !prev);
  };

  const onPressSignIn = () => {
    navigation.navigate(routes.qrScanner);
  };

  const onPressNotes = () => {
    navigation.navigate(routes.notes);
  };

  const onPressActivity = () => {
    navigation.navigate(routes.myActivity);
  };

  const onPressCalendar = () => {
    if (userInfo?.lastAccessBusiness) navigation.navigate(routes.calender);
    else setShowModal(true);
  };

  const menuItems = [
    {
      id: 1,
      title: 'WORQX ID',
      icon: icons.finger,
      onPress: () => {
        setQrVisible(true);
      },
    },
    { id: 2, title: 'DOM AI', icon: icons.dom },
    { id: 3, title: 'Sign In', icon: icons.signout, onPress: onPressSignIn },
    { id: 4, title: 'Sign Out', icon: icons.signin },
    { id: 5, title: 'Activity', icon: icons.qr, onPress: onPressActivity },
    { id: 6, title: 'Business', icon: icons.activity },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView style={{
        backgroundColor: colors.primary,
        flexGrow: 1
      }}
      >
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.background },
            ]}>
            <Text
              style={[styles.title, { color: colors.textPrimary }]}
              textStyle="semibold20">
              {getGreeting(currentTime.getHours())} {userInfo?.firstName}!
            </Text>
            <View style={styles.rowCenter}>
              <Icon
                source={getGreetingImage(currentTime.getHours())}
                size={38}
              />
              <View style={[styles.dateContainer, { marginTop: 4 }]}>
                <Text textStyle="regular18" color={colors.textPrimary}>
                  {formatDate(currentTime, 'day')}
                </Text>
                <Text color={colors.textPrimary} textStyle="regular12">
                  {formatDate(currentTime, 'shortDate')}
                </Text>
              </View>
            </View>
            <View>
              <Text color={colors.textSecondary} textStyle="regular12">
                {formatDate(currentTime, 'time')}
              </Text>
              <View style={styles.rowBetween}>
                <Text textStyle="regular14" color={colors.textSecondary}>
                  Realtime Insight
                </Text>
                <Text
                  textStyle="regular14"
                  style={styles.underline}
                  onPress={onPressCalendar}>
                  View Calendar
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            style={[styles.notesTab, { backgroundColor: colors.background }]}
            onPress={onPressNotes}>
            <Text textStyle="semibold16" color={colors.textPrimary}>
              My Notes
            </Text>
            <Icon source={icons.right} size={12} />
          </Pressable>
          <View style={styles.menuContainer}>
            <View style={styles.grid}>
              {menuItems.map(({ id, title, icon, onPress }) => (
                <Pressable key={id} style={[styles.card,]} onPress={onPress}>
                  <View style={{ padding: 12, backgroundColor: colors.primary, borderRadius: 100 }}>
                    <Icon
                      source={icon}
                      size={20}
                      color={colors.white}
                      disabled
                    />
                  </View>
                  <Text textStyle="medium16" color={colors.textPrimary}>
                    {title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={{ zIndex: 800 }}>
            <Modal
              visible={showModal}
              onClose={handleCancel}
              onAction={handleAdd}
              message={`You don't have any business registered yet.`}
              leftButton="Cancel"
              rightButton="Add Business"
              title={'Add Business'}
            />
          </View>

          <RNModal
            key={'type'}
            visible={qrVisible}
            transparent
            animationType="slide">
            <Pressable
              style={styles.modalContainer}
              onPress={() => {
                setQrVisible(false);
              }}>
              <View
                style={[
                  styles.calendarContainer,
                  { backgroundColor: colors.background },
                ]}
                onStartShouldSetResponder={() => true}>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    padding: 30,
                    borderTopEndRadius: 20,
                    borderTopLeftRadius: 20,
                  }}>
                  <Text color={colors.background} textStyle="semibold20">
                    My WORQX ID
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.background,
                    padding: 30,
                    borderTopEndRadius: 20,
                    borderTopLeftRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 30,
                  }}>
                  <QRCode
                    value={userInfo?.sessionId || 'no id'}
                    logo={images.logo}
                    color={colors.primary}
                    logoSize={30}
                    logoMargin={0}
                    size={127}
                  />
                  <Text textStyle="medium12">My WORQX ID {userInfo?.uuid}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    height: 118,
                    borderBottomEndRadius: 20,
                    borderBottomLeftRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}>
                  <Text color={colors.background} textStyle="semibold16">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </Text>
                  <Text color={colors.background} textStyle="regular12">
                    Member since {formatDate(userInfo?.createdAt, 'monthYear')}
                  </Text>
                </View>
              </View>
            </Pressable>
          </RNModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
