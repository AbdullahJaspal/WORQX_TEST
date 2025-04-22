import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Pressable,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ImageProps,
  Alert,
  BackHandler,
} from 'react-native';
import {
  Button,
  CountdownTimer,
  Dropdown,
  Header,
  Icon,
  InputField,
  Modal,
  ProfileAvatar,
  Text,
} from '../../../components';
import { useTheme } from '../../../context/themeContext';
import { icons } from '../../../assets/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { logout, resendOtp, verifyOtp } from '../../../api/authApi';
import { genderData } from '../../../constants/data';
import DatePicker from '../../../components/DatePicker';
import { formatDate, getChangedFields } from '../../../utils/utils';
import ImagePicker from 'react-native-image-crop-picker';
import { updateProfile } from '../../../api/profileApi';
import { showLoader } from '../../../redux/features/loaderSlice';
import { getUserInfo } from '../../../api/dashboadApi';
import { login, saveInfo } from '../../../redux/features/authSlice';
import { routes } from '../../../navigation/Routes';
import { userRoles } from '../../../utils/enums';
import { showToast } from '../../../redux/features/toastSlice';
import styles, { calendarTheme } from './styles';
import VerificationInput from '../../../components/VerificationInput';
import { ResendOtpRequest, VerifyOtpRequest } from '../../authStack/types';
import { DropdownItem } from '../../../components/types';
import { InfoType, ProfileProps, VerificationType } from './types';


const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [imageChanged, setImageChanged] = useState<boolean>(false);

  // Verification states
  const [verificationStatus, setVerificationStatus] = useState<boolean>(false);
  const [verificationType, setVerificationType] = useState<VerificationType>(undefined);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');

  // Form data
  const [info, setInfo] = useState<InfoType>({
    personalInfo: {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
    },
    contactInfo: {
      mobile: userInfo?.mobile || '',
      email: userInfo?.email || '',
    },
    additionalInfo: {
      dob: userInfo?.dob || undefined,
      gender: userInfo?.gender || '',
    },
    image: {
      uri: userInfo?.imageUrl || '',
      name: `image_${Date.now()}.jpg`,
      type: 'image/jpeg',
    },
    profile: userInfo?.imageUrl || '',
  });

  // Calculate gender selection from state for dropdown
  const gender = useMemo(() =>
    genderData?.find(item => item.value === info.additionalInfo.gender) || {},
    [info.additionalInfo.gender]
  );

  // Handle back button press system-wide
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (verificationType) {
          setVerificationType(null);
          return true;
        } else if (edit) {
          handleCancelEdit();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [edit, verificationType]);

  // Image picker handler with error handling
  const handleImagePick = useCallback(async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        mediaType: 'photo',
      });

      if (image.path) {
        const fileName = image.filename || `image_${Date.now()}.jpg`;
        const fileType = image.mime || 'image/jpeg';

        setInfo(prev => ({
          ...prev,
          profile: image.path,
          image: {
            uri: image.path,
            name: fileName,
            type: fileType,
          },
        }));
        setImageChanged(true);
      }
    } catch (error) {
      if (error?.toString() !== 'Error: User cancelled image selection') {
        dispatch(showToast({
          type: 'error',
          message: 'Failed to select image'
        }));
      }
    }
  }, [dispatch]);

  // Logout with confirmation
  const handleLogout = useCallback(async () => {
    dispatch(showLoader(true));
    try {
      const response = await logout();
      if (response.success) {
        dispatch(login({ token: '' }));
        dispatch(saveInfo({ userInfo: null }));
        navigation.replace(routes.auth);
      } else {
        dispatch(showToast({
          type: 'error',
          message: 'Logout failed, please try again'
        }));
      }
    } catch (error) {
      dispatch(showToast({
        type: 'error',
        message: 'Logout failed, please try again'
      }));
    } finally {
      dispatch(showLoader(false));
    }
  }, [dispatch, navigation]);

  // Form handling
  const handleChange = useCallback((
    section: 'personalInfo' | 'contactInfo' | 'additionalInfo',
    field: string,
    value: string,
  ) => {
    setInfo(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  // Reset form to original values
  const handleCancelEdit = useCallback(() => {
    setInfo({
      personalInfo: {
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
      },
      contactInfo: {
        mobile: userInfo?.mobile || '',
        email: userInfo?.email || '',
      },
      additionalInfo: {
        dob: userInfo?.dob || undefined,
        gender: userInfo?.gender || '',
      },
      image: {
        uri: userInfo?.imageUrl || '',
        name: `image_${Date.now()}.jpg`,
        type: 'image/jpeg',
      },
      profile: userInfo?.imageUrl || '',
    });
    setImageChanged(false);
    setEdit(false);
  }, [userInfo]);

  // Check if there are any changes compared to original data
  const hasChanges = useMemo(() => {
    const originalPersonalInfo = {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
    };

    const originalContactInfo = {
      mobile: userInfo?.mobile || '',
      email: userInfo?.email || '',
    };

    const originalAdditionalInfo = {
      dob: userInfo?.dob || undefined,
      gender: userInfo?.gender || '',
    };

    const personalInfoChanged = Object.keys(getChangedFields(
      originalPersonalInfo,
      info.personalInfo,
    )).length > 0;

    const contactInfoChanged = Object.keys(getChangedFields(
      originalContactInfo,
      info.contactInfo,
    )).length > 0;

    const additionalInfoChanged = Object.keys(getChangedFields(
      originalAdditionalInfo,
      info.additionalInfo,
    )).length > 0;

    return personalInfoChanged || contactInfoChanged || additionalInfoChanged || imageChanged;
  }, [info, userInfo, imageChanged]);

  // Back button handler with unsaved changes confirmation
  const handleBack = useCallback(() => {
    if (verificationType) {
      setVerificationType(null);
      return;
    }

    if (edit) {
      if (hasChanges) {
        Alert.alert(
          'Unsaved Changes',
          'You have unsaved changes. Are you sure you want to discard them?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: handleCancelEdit }
          ]
        );
      } else {
        setEdit(false);
      }
    } else {
      navigation.goBack();
    }
  }, [edit, hasChanges, navigation, handleCancelEdit, verificationType]);


  const handleUpdate = async (isChangeEmailPhone: boolean = false, type?: VerificationType) => {
    try {
      dispatch(showLoader(true));
      let hasUpdate = false;
      const formData = new FormData();
      if (imageChanged && info.image && info.image.uri) {
        formData.append('image', {
          uri: info.image.uri,
          name: info.image.name,
          type: info.image.type,
        });
        hasUpdate = true;
      }
      const originalPersonalInfo = {
        firstName: userInfo?.firstName,
        lastName: userInfo?.lastName,
      };

      const originalContactInfo = {
        mobile: userInfo?.mobile,
        email: userInfo?.email,
      };

      const originalAdditionalInfo = {
        dob: userInfo?.dob,
        gender: userInfo?.gender,
      };

      const changedPersonalInfo = getChangedFields(
        originalPersonalInfo,
        info.personalInfo,
      );
      const changedContactInfo = getChangedFields(
        originalContactInfo,
        info.contactInfo,
      );
      const changedAdditionalInfo = getChangedFields(
        originalAdditionalInfo,
        info.additionalInfo,
      );

      if (Object.keys(changedPersonalInfo).length > 0) {
        formData.append('personalInfo', JSON.stringify(changedPersonalInfo));
        hasUpdate = true;
      }
      if (Object.keys(changedContactInfo).length > 0) {
        formData.append('contactInfo', JSON.stringify(changedContactInfo));
        hasUpdate = true;
      }
      if (Object.keys(changedAdditionalInfo).length > 0) {
        formData.append(
          'additionalInfo',
          JSON.stringify(changedAdditionalInfo),
        );
        hasUpdate = true;
      }
      if (isChangeEmailPhone) {
        formData.append('isChangeEmailPhone', isChangeEmailPhone);
        hasUpdate = true;
      }

      if (type) {
        formData.append('type', type);
        hasUpdate = true;
      }


      console.log('Form data:', formData);

      if (!hasUpdate) {
        dispatch(
          showToast({
            type: 'error',
            message: 'You need to change the any of the field',
          }),
        );
        dispatch(showLoader(false));
        return;
      }

      const response = await updateProfile(formData);
      console.log('Update profile response:', response);
      if (response) {
        setVerificationType(type);
      }
      if (!isChangeEmailPhone) {
        const userData = await getUserInfo();
        setImageChanged(false);
        dispatch(saveInfo({ userInfo: userData?.user }));
        setEdit(false);
      }
      dispatch(showLoader(false));
    } catch (error) {
      console.error('Profile update error:', error);
      dispatch(showLoader(false));
    }
  };

  const handleResendOtp = useCallback(async () => {
    dispatch(showLoader(true));
    try {
      const isEmail = verificationType === 'updateEmail';
      const data: ResendOtpRequest = {
        [isEmail ? 'updateEmail' : 'mobile']: isEmail
          ? info?.contactInfo?.email || ''
          : info?.contactInfo?.mobile || '',
        type: isEmail ? 'updateEmail' : 'updatePhone',
      };

      const response = await resendOtp(data);

      if (response?.success) {
        dispatch(showToast({
          message: response.message || 'OTP sent successfully',
          type: 'success'
        }));
      } else {
        dispatch(showToast({
          message: response?.message || `Failed to send OTP to your ${isEmail ? 'updateEmail' : 'mobile'}`,
          type: 'error'
        }));
      }
    } catch (error) {
      dispatch(showToast({
        message: `Failed to send OTP to your ${verificationType === 'updateEmail' ? 'updateEmail' : 'mobile'}`,
        type: 'error'
      }));
    } finally {
      dispatch(showLoader(false));
    }
  }, [verificationType, info, dispatch]);

  const handleVerifyOtp = useCallback(async () => {
    if (verificationCode.length < 6) {
      setVerificationError('Please enter the complete 6-digit code');
      return;
    }

    dispatch(showLoader(true));
    try {
      const isEmail = verificationType === 'updateEmail';
      const data: VerifyOtpRequest = {
        email: info?.contactInfo?.email,
        code: verificationCode,
        platformType: 'mobile',
        type: isEmail ? 'updateEmail' : 'updatePhone',
      };
      console.log('Verification data:', data);

      const response = await verifyOtp(data);

      if (response?.success) {
        setVerificationStatus(true)
        dispatch(showToast({
          message: 'Verification successful',
          type: 'success'
        }));

        setVerificationCode('');
        setVerificationError('');
        setVerificationType(null);

      } else {
        setVerificationError(response?.message || 'Invalid verification code');
      }
    } catch (error) {
      setVerificationError('Verification failed. Please try again.');
    } finally {
      dispatch(showLoader(false));
    }
  }, [verificationCode, verificationType, info, dispatch]);

  const getVerificationTitle = useCallback(() => {
    return verificationType === 'updateEmail'
      ? 'Email Verification'
      : 'Mobile Verification';
  }, [verificationType]);

  const getVerificationMessage = useCallback(() => {
    if (verificationType === 'updateEmail') {
      return `Code just sent to your email address at ${info.contactInfo.email}`;
    } else {
      return `Code just sent to your mobile number ${info.contactInfo.mobile}`;
    }
  }, [verificationType, info.contactInfo.email, info.contactInfo.mobile]);

  // Render verification screen
  const renderVerificationScreen = () => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ marginTop: 64, width: '85%' }}>
        <View style={{ gap: 12, marginBottom: 20 }}>
          <Text textStyle="regular20">
            {getVerificationTitle()}
          </Text>
          <Text textStyle="medium14" color={colors.textPrimary}>
            {getVerificationMessage()}
          </Text>
        </View>
        <Text textStyle="semibold16">Verification Code</Text>
        <VerificationInput
          length={6}
          onCodeComplete={(code) => { setVerificationCode(code), setVerificationError('') }}
          error={verificationError}
          value={verificationCode}
        />

        <Button
          height={48}
          backgroundColor={colors.primary}
          title="Verify"
          onPress={handleVerifyOtp}
          style={{ marginTop: 15 }}
          disabled={verificationCode.length < 6}
        />

        <View style={{ alignSelf: 'center', marginTop: 30 }}>
          <CountdownTimer
            duration={120}
            storageKey={`${verificationType}_change_${verificationType === 'updateEmail'
              ? info.contactInfo.email
              : info.contactInfo.mobile}`}
            onResend={handleResendOtp}
            autoStart={true}
            forceReset={true}
          />
        </View>
      </View>
    </View>
  );

  // Render profile info row
  const InfoRow = ({ title, value, icon }: { title: string, value: string | undefined, icon: ImageProps }) => (
    <View>
      <View style={styles.infoRow}>
        <Text textStyle="semibold16" color="#333">
          {title}
        </Text>
        <Icon source={icon} size={16} />
      </View>
      <Text textStyle="medium16" color="#777">
        {value || 'Not provided'}
      </Text>
    </View>
  );

  // Render profile form
  const renderProfileForm = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <ProfileAvatar
            uri={info.profile}
            firstName={info?.personalInfo?.firstName}
            lastName={info?.personalInfo?.lastName}
            size={100}
            style={{ marginTop: 56 }}
            textStyle="bold24"
          />

          {edit && (
            <Pressable
              onPress={handleImagePick}
              style={[styles.editIcon, { backgroundColor: colors.primary }]}>
              <Icon
                disabled
                source={icons.pen}
                color={colors.white}
                size={10}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.userInfoContainer}>
          <Text textStyle="medium20">
            {info.personalInfo.firstName} {info.personalInfo.lastName}
          </Text>
          <Text textStyle="medium12" color={colors.textPrimary}>
            {userRoles[userInfo?.role as keyof typeof userRoles] || 'Unknown Role'}
          </Text>
          {!edit && (
            <Pressable
              onPress={() => setEdit(true)}
              style={styles.editProfileButton}>
              <Text textStyle="semibold10">Edit Profile</Text>
              <Icon source={icons.pen} size={8} />
            </Pressable>
          )}
        </View>
        {edit ? (
          <>
            <View style={{ zIndex: 100 }}>
              <Text textStyle="semibold20">Personal Info</Text>
              <InputField
                label="First Name"
                value={info.personalInfo.firstName}
                labelColor={colors.textPrimary}
                placeholder="Enter First Name"
                onChangeText={text =>
                  handleChange('personalInfo', 'firstName', text)
                }
              />
              <InputField
                label="Last Name"
                value={info.personalInfo.lastName}
                labelColor={colors.textPrimary}
                placeholder="Enter Last Name"
                onChangeText={text =>
                  handleChange('personalInfo', 'lastName', text)
                }
              />

              <Dropdown
                data={genderData}
                selectedItem={gender}
                onSelect={(item: DropdownItem) => {
                  handleChange('additionalInfo', 'gender', item.value || '');
                }}
                labelColor={colors.textPrimary}
                label="Gender"
                placeholder="Select Gender"
                variant="simple"
                dropdownStyle={{
                  borderRadius: 8,
                  shadowOpacity: 0.05,
                }}
                itemStyle={{
                  borderBottomWidth: 0,
                }}
                containerStyle={{ marginTop: 12 }}
                showIcons={false}
              />

              <InputField
                label="Date of Birth"
                value={
                  (info?.additionalInfo?.dob &&
                    formatDate(info?.additionalInfo?.dob, 'numeric')) ||
                  ''
                }
                labelColor={colors.textPrimary}
                placeholder="Select Date of birth"
                onChangeText={text =>
                  handleChange('additionalInfo', 'dob', text)
                }
                editable={false}
                icon={icons.calendar}
                onPressIcon={() => setCalendarVisible(true)}
              />
              <Text textStyle="semibold20" style={{ marginTop: 12 }}>
                Contact Info
              </Text>
              <InputField
                label="Phone"
                value={info.contactInfo.mobile}
                labelColor={colors.textPrimary}
                placeholder="Enter Phone number"
                onChangeText={text =>
                  handleChange('contactInfo', 'mobile', text)
                }
                verifyStatus={verificationStatus ? 'Verified' : 'Verify Now'}
                verify={info.contactInfo.mobile !== userInfo?.mobile}
                onPressVerify={() => {
                  handleUpdate(true, 'updateMobile');
                }}
              />
              <InputField
                label="Email"
                value={info.contactInfo.email}
                labelColor={colors.textPrimary}
                placeholder="Enter email"
                onChangeText={text =>
                  handleChange('contactInfo', 'email', text)
                }
                verify={info.contactInfo.email !== userInfo?.email}
                onPressVerify={() => {
                  !verificationStatus ? handleUpdate(true, 'updateEmail') : () => { }
                }}
                verifyStatus={verificationStatus ? 'Verified' : 'Verify Now'}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
                <Button
                  height={48}
                  backgroundColor={colors.background}
                  title="Cancel"
                  textColor={colors.textSecondary}
                  onPress={handleCancelEdit}
                  style={{ flex: 1 }}
                  borderColor={colors.primary}
                />
                <Button
                  height={48}
                  backgroundColor={colors.primary}
                  title="Save"
                  onPress={() => handleUpdate(false, undefined)}
                  style={{ flex: 1 }}
                  disabled={!hasChanges}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.sectionContainer}>
              <Text textStyle="semibold20">Personal Info</Text>
              <InfoRow
                title="Gender"
                value={
                  genderData?.find(
                    item => item.value === info?.additionalInfo.gender,
                  )?.label
                }
                icon={icons.gender}
              />
              <InfoRow
                title="Date of Birth"
                value={
                  (info?.additionalInfo?.dob &&
                    formatDate(info?.additionalInfo?.dob, 'numeric')) ||
                  ''
                }
                icon={icons.dob}
              />
              <Text textStyle="semibold20" style={{ marginTop: 20 }}>Contact Info</Text>
              <InfoRow
                title="Phone"
                value={info.contactInfo.mobile}
                icon={icons.phone}
              />
              <InfoRow
                title="Email"
                value={info.contactInfo.email}
                icon={icons.email}
              />
            </View>
            <Button
              height={48}
              backgroundColor={colors.pink}
              title="Logout"
              textColor={colors.error}
              icon={icons.signin}
              iconSize={14}
              onPress={() => setShowModal(true)}
              style={{ marginTop: 35 }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title={verificationType
            ? getVerificationTitle()
            : edit
              ? 'Edit Profile'
              : 'My Profile'
          }
          onPress={handleBack}
        />

        {verificationType
          ? renderVerificationScreen()
          : renderProfileForm()
        }

        <DatePicker
          visible={calendarVisible}
          onClose={() => setCalendarVisible(false)}
          onSelectDate={text => {
            handleChange('additionalInfo', 'dob', text);
          }}
          initialDate={info.additionalInfo.dob}
          currentDate={info.additionalInfo.dob || new Date()}
          calendarTheme={calendarTheme}
        />

        <View style={{ zIndex: 800 }}>
          <Modal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onAction={handleLogout}
            message="Are you sure you want to log out?"
            leftButton="Cancel"
            rightButton="Logout"
            title="Logout"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Profile;