'use client';

import {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useTheme} from '../../../context/themeContext';
import {
  Button,
  Header,
  InputField,
  Text,
  CountdownTimer,
} from '../../../components';
import VerificationInput from '../../../components/VerificationInput';
import {useNavigation} from '@react-navigation/native';
import {type AuthStackParamList, routes} from '../../../navigation/Routes';
import Icon from '../../../components/Icon';
import {icons} from '../../../assets/icons';
import styles from './styles';
import {forgetFormValidate} from '../../../utils/validation';
import {
  createPassword,
  forgetPassword,
  resendOtp,
  verifyOtp,
} from '../../../api/authApi';
import {useDispatch} from 'react-redux';
import {showToast} from '../../../redux/features/toastSlice';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {
  CreatePasswordRequest,
  ForgetpasswordData,
  ResendOtpRequest,
  VerifyOtpRequest,
} from '../types';
import {showLoader} from '../../../redux/features/loaderSlice';

const ForgetPassword = () => {
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<ForgetpasswordData>({
    email: '',
    phone: '',
    emailVerification: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<
    'initial' | 'verification' | 'createPassword'
  >('initial');

  const handleContinue = () => {
    const validationErrors = forgetFormValidate(formData, step);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (step === 'initial') {
        handleForget();
      } else if (step === 'verification') {
        handleVerifyOtp();
      } else if (step === 'createPassword') {
        handlePassword();
      }
    }
  };

  const updateFormData = (field: keyof ForgetpasswordData, value: string) => {
    setFormData(prev => {
      const updatedForm = {...prev, [field]: value};
      setErrors({});
      return updatedForm;
    });
  };

  const handleBackPress = () => {
    setErrors({});
    if (step === 'createPassword') {
      setStep('verification');
    } else if (step === 'verification') {
      setStep('initial');
      updateFormData('emailVerification', '');
    } else {
      navigation.goBack();
    }
  };

  const handleForget = async () => {
    const data: ResendOtpRequest = {
      email: formData.email,
      type: 'forgotPassword',
    };
    dispatch(showLoader(true));
    const response = await forgetPassword(data);
    if (response) {
      dispatch(showToast({message: response.message, type: 'success'}));
      setStep('verification');
      dispatch(showLoader(false));
    }
  };

  const handleResendOtp = async () => {
    dispatch(showLoader(true));
    try {
      const data: ResendOtpRequest = {
        email: formData.email,
        type: 'forgotPassword',
      };
      const response = await resendOtp(data);
      if (response?.success) {
        dispatch(showToast({message: response.message, type: 'success'}));
      }
    } catch (error) {
      dispatch(showToast({message: 'Failed to resend OTP', type: 'error'}));
    } finally {
      dispatch(showLoader(false));
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.emailVerification) {
      setErrors(prev => ({...prev, emailVerification: 'Code is required'}));
      return;
    }
    dispatch(showLoader(true));
    try {
      const data: VerifyOtpRequest = {
        email: formData.email,
        code: formData.emailVerification,
        platformType: 'mobile',
        type: 'forgotPassword',
      };
      const response = await verifyOtp(data);

      if (response?.success) {
        dispatch(showToast({message: response.message, type: 'success'}));
        setStep('createPassword');
      }
    } catch (error) {
      // Handle error
    } finally {
      dispatch(showLoader(false));
    }
  };

  const handlePassword = async () => {
    const data: CreatePasswordRequest = {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      type: 'forgotPassword',
    };
    dispatch(showLoader(true));
    const response = await createPassword(data);
    if (response) {
      dispatch(showToast({message: response?.message, type: 'success'}));
      dispatch(showLoader(false));
      navigation.replace(routes.signIn);
    } else {
      dispatch(showLoader(false));
    }
  };

  return (
    <SafeAreaView
      style={[styles.mainContainer, {backgroundColor: colors.background}]}>
      <Header onPress={handleBackPress} auth />
      {step === 'initial' && (
        <View style={{width: '85%', marginTop: 64}}>
          <Text textStyle="bold24">Forgot Password</Text>
          <Text
            textStyle="regular14"
            color={colors.textPrimary}
            style={{marginTop: 12}}>
            Forgot your password? Drop in your email or phone number, we'll send
            you a code to reset it in no time.
          </Text>
          <InputField
            required
            label="Email or Phone Number"
            placeholder="Your Email or Phone Number"
            value={formData.email}
            onChangeText={text => updateFormData('email', text)}
            error={errors.email || ''}
            editable={!formData.phone}
            containerStyle={{marginTop: 20}}
          />
        </View>
      )}
      {step === 'verification' && (
        <View style={{marginTop: 64, width: '85%'}}>
          <View style={{gap: 12, marginBottom: 20}}>
            <Text textStyle="regular20">
              Please enter email verification code
            </Text>
            <Text textStyle="medium14" color={colors.textPrimary}>
              Code just sent to your email address at {formData.email}
            </Text>
          </View>
          <Text textStyle="semibold16">Verification Code</Text>
          <VerificationInput
            length={6}
            onCodeComplete={code => updateFormData('emailVerification', code)}
            error={errors.emailVerification}
            value={formData.emailVerification}
          />
        </View>
      )}
      {step === 'createPassword' && (
        <View style={{marginTop: 64, width: '85%'}}>
          <View style={{gap: 12, marginBottom: 20}}>
            <Text textStyle="regular20">
              Please reset password for your account
            </Text>
          </View>
          <InputField
            required
            label="Create New Password"
            placeholder="Enter New Password"
            value={formData.password}
            onChangeText={text => updateFormData('password', text)}
            secureTextEntry
            isPassword={true}
            error={errors.password || ''}
          />
          <InputField
            required
            label="Confirm New Password"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={text => updateFormData('confirmPassword', text)}
            secureTextEntry
            isPassword={true}
            containerStyle={{marginTop: 15}}
          />
          {formData.password && (
            <View style={{gap: 2, marginTop: 12}}>
              {[
                {
                  condition: formData.password.length >= 10,
                  text: 'Minimum 10 characters.',
                },
                {
                  condition: /[@#$%]/.test(formData.password),
                  text: 'At least ONE special character (@, #, $, %)',
                },
                {
                  condition: /[A-Z]/.test(formData.password),
                  text: 'At least ONE capital letter',
                },
                {
                  condition: /[0-9]/.test(formData.password),
                  text: 'At least ONE number',
                },
                {
                  condition: formData.password === formData.confirmPassword,
                  text: 'Confirm New Password is the same',
                },
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'center',
                    marginTop: 8,
                  }}>
                  <Icon
                    source={item.condition ? icons.check : icons.close}
                    color={item.condition ? colors.primary : colors.error}
                    size={item.condition ? 12 : 13}
                  />
                  <Text
                    textStyle="regular12"
                    color={item.condition ? colors.primary : colors.error}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      <Button
        title={
          step === 'initial'
            ? 'Get Verification Code'
            : step === 'createPassword'
            ? 'Reset'
            : 'Continue'
        }
        backgroundColor={colors.primary}
        textColor={colors.background}
        width={'85%'}
        onPress={handleContinue}
        disabled={Object.keys(errors).length > 0}
        style={{marginTop: 72, marginBottom: 16}}
      />
      {step === 'verification' && (
        <CountdownTimer
          duration={120}
          storageKey={`forget_password_otp_${formData.email}`}
          onResend={handleResendOtp}
          autoStart={true}
          forceReset={true}
        />
      )}
    </SafeAreaView>
  );
};

export default ForgetPassword;
