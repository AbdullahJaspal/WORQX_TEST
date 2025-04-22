import {useState} from 'react';
import styles from './styles';
import {useDispatch} from 'react-redux';
import {Keyboard, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../context/themeContext';
import {login} from '../../../redux/features/authSlice';
import {showToast} from '../../../redux/features/toastSlice';
import {signinFormVaildate} from '../../../utils/validation';
import {resendOtp, signin, verifyOtp} from '../../../api/authApi';
import {
  Button,
  CountdownTimer,
  Header,
  InputField,
  Text,
} from '../../../components';
import {type AuthStackParamList, routes} from '../../../navigation/Routes';
import VerificationInput from '../../../components/VerificationInput';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {
  ResendOtpRequest,
  SignInData,
  SignInRequest,
  VerifyOtpRequest,
} from '../types';
import {showLoader} from '../../../redux/features/loaderSlice';

const SignIn = () => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
    emailVerification: '',
  });
  const [step, setStep] = useState<'initial' | 'verification'>('initial');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof SignInData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    setErrors({});
  };

  const handleContinue = async () => {
    const validationErrors = signinFormVaildate(formData, step);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (step === 'initial') {
        handleSignIn();
      } else if (step === 'verification') handleVerifyOtp();
    }
  };
  const handleSignIn = async () => {
    const validationErrors = signinFormVaildate(formData, step);
    setErrors(validationErrors);
    Keyboard.dismiss();
    if (Object.keys(validationErrors).length === 0) {
      if (step === 'initial') {
        dispatch(showLoader(true));
        try {
          const data: SignInRequest = {
            email: formData.email,
            password: formData.password,
            platformType: 'mobile',
            type: 'signIn',
          };
          const response = await signin(data);
          if (response?.success) {
            if (response?.token) {
              dispatch(login({token: response.token}));
              dispatch(
                showToast({message: 'Login successful!', type: 'success'}),
              );
              navigation.replace(routes.bottomTab);
            } else {
              dispatch(showToast({message: response.message, type: 'success'}));
              setStep('verification');
            }
          }
        } catch (error) {
          dispatch(
            showToast({message: 'Something went wrong!', type: 'error'}),
          );
        } finally {
          dispatch(showLoader(false));
        }
      }
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
        type: 'signIn',
      };
      const response = await verifyOtp(data);
      if (response?.success) {
        dispatch(login({token: response.token}));

        dispatch(showToast({message: 'Login successful!', type: 'success'}));
        navigation.replace(routes.bottomTab);
      }
    } catch (error) {
      dispatch(showToast({message: 'Invalid OTP!', type: 'error'}));
    } finally {
      dispatch(showLoader(false));
    }
  };
  const handleResendOtp = async () => {
    dispatch(showLoader(true));
    try {
      const data: ResendOtpRequest = {email: formData.email, type: 'signIn'};
      const response = await resendOtp(data);
      if (response?.success) {
        dispatch(showToast({message: response?.message, type: 'success'}));
      }
    } catch (error) {
      dispatch(showToast({message: 'Failed to resend OTP', type: 'error'}));
    } finally {
      dispatch(showLoader(false));
    }
  };

  const handlePressBack = () => {
    step === 'verification'
      ? updateFormData('emailVerification', '')
      : navigation.goBack();
    setStep(step === 'verification' ? 'initial' : 'initial');
  };
  return (
    <View style={[styles.mainCont, {backgroundColor: colors.background}]}>
      <Header onPress={handlePressBack} auth />

      {step === 'initial' && (
        <View style={{width: '85%', marginTop: 64}}>
          <Text textStyle="bold24">Sign In</Text>
          <Text
            textStyle="regular14"
            color={colors.textPrimary}
            style={{marginTop: 12}}>
            Welcome back! Please enter your credentials.
          </Text>
          <InputField
            required
            label="Email"
            placeholder="Your Email"
            value={formData.email}
            onChangeText={text => updateFormData('email', text)}
            error={errors.email}
          />
          <InputField
            required
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={text => updateFormData('password', text)}
            error={errors.password}
            secureTextEntry
            containerStyle={{marginTop: 15}}
            isPassword
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
      <View
        style={{
          width: '85%',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
        }}>
        <Button
          title={'Continue'}
          backgroundColor={colors.primary}
          textColor={colors.background}
          width={'100%'}
          onPress={handleContinue}
          disabled={Object.keys(errors).length > 0}
          style={{marginTop: 72, marginBottom: 16}}
        />
        {step === 'initial' && (
          <Text
            textStyle="regular16"
            color={colors.textPrimary}
            style={{textDecorationLine: 'underline'}}
            onPress={() => {
              navigation.navigate(routes.forgetpassword);
            }}>
            Forgot Password?
          </Text>
        )}
        {step === 'verification' && (
          <CountdownTimer
            duration={120}
            storageKey={`signin_otp_${formData.email}`}
            onResend={handleResendOtp}
            autoStart={true}
            forceReset={true} // Force reset when the component mounts
          />
        )}
        {step === 'initial' && (
          <Text
            style={{marginVertical: 12}}
            textStyle="regular16"
            color={colors.textPrimary}>
            Already have an account?{' '}
            <Text
              textStyle="semibold16"
              style={{textDecorationLine: 'underline'}}
              onPress={() => {
                navigation.navigate(routes.signUp);
              }}>
              Sign Up
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

export default SignIn;
