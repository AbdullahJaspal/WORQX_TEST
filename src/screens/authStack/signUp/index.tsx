import type React from 'react';
import {useState, useEffect} from 'react';
import {SafeAreaView, View, KeyboardAvoidingView, Platform} from 'react-native';
import {
  Button,
  Header,
  PaginationDots,
  Text,
  Icon,
  CountdownTimer,
} from '../../../components';
import styles from './styles';
import {
  createPassword,
  createUser,
  resendOtp,
  verifyOtp,
} from '../../../api/authApi';
import {useDispatch} from 'react-redux';
import {icons} from '../../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../context/themeContext';
import {useKeyboard} from '../../../hooks/useKeyboard';
import {signupFormValidate} from '../../../utils/validation';
import {showToast} from '../../../redux/features/toastSlice';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {type AuthStackParamList, routes} from '../../../navigation/Routes';
import StepContent from './stepContent';
import type {
  CreatePasswordRequest,
  CreateUserRequest,
  ResendOtpRequest,
  SignupData,
  VerifyOtpRequest,
} from '../types';
import {showLoader} from '../../../redux/features/loaderSlice';

const SignUp: React.FC = () => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const isKeyboardVisible = useKeyboard();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+61',
    phone: '',
    password: '',
    confirmPassword: '',
    emailVerification: '',
    numberVerification: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [check, setCheck] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    dispatch(showLoader(false));
  }, [dispatch]);

  const handleNext = () => {
    const validationErrors = signupFormValidate(formData, currentStep);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (currentStep === 1) {
        handleCreateUser();
      } else if (currentStep === 2) {
        verifyCode();
      } else if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
      } else {
        createAccount();
      }
    }
  };

  const handleCountryCode = (code: string) => {
    updateFormData('countryCode', code);
  };
  const handleBackPress = () => {
    setErrors({});
    if (currentStep === 0) {
      navigation.goBack();
    } else if (currentStep === 2) {
      updateFormData('emailVerification', '');
      setCurrentStep(prev => prev - 1);
    } else if (currentStep === 5) {
      updateFormData('emailVerification', '');
      setCurrentStep(1);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };
  const handleCreateUser = async () => {
    try {
      const data: CreateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: 'signUp',
      };
      dispatch(showLoader(true));
      const response = await createUser(data);
      if (response) {
        dispatch(showLoader(false));
        console.log('Signup response', response);
        if (response?.user) {
          dispatch(showLoader(false));
          setCurrentStep(prev => prev + 4);
          dispatch(showToast({message: response?.message, type: 'success'}));
        } else {
          setCurrentStep(prev => prev + 1);
          dispatch(showLoader(false));
          dispatch(showToast({message: response?.message, type: 'success'}));
        }
      } else {
        dispatch(showLoader(false));
      }
    } catch (error) {
      dispatch(showLoader(false));
    }
  };
  const verifyCode = async () => {
    try {
      const data: VerifyOtpRequest = {
        code: formData.emailVerification,
        email: formData.email,
        platformType: 'mobile',
        type: 'signUp',
      };
      dispatch(showLoader(true));
      const response = await verifyOtp(data);
      if (response) {
        setCurrentStep(prev => prev + 3);
        dispatch(showToast({message: response?.message, type: 'success'}));
      } else {
        dispatch(showLoader(false));
      }
    } catch (error) {
      console.log('errorp[]', error);
    }
  };
  const handleReset = async () => {
    const data: ResendOtpRequest = {
      email: formData.email,
      type: 'signUp',
    };
    dispatch(showLoader(true));
    const response = await resendOtp(data);
    if (response) {
      dispatch(showLoader(false));
      dispatch(showToast({message: response?.message, type: 'success'}));
    } else {
      dispatch(showLoader(false));
    }
    dispatch(showLoader(false));
  };
  const createAccount = async () => {
    try {
      const data: CreatePasswordRequest = {
        code: formData.emailVerification,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        type: 'signUp',
      };
      if (check) {
        dispatch(showLoader(true));
        const response = await createPassword(data);
        if (response) {
          dispatch(showToast({message: response?.message, type: 'success'}));
          navigation.replace(routes.signIn);
        }
        dispatch(showLoader(false));
      } else {
        dispatch(
          showToast({
            message: 'Please check the Terms & condition and Privacy Policy',
            type: 'error',
          }),
        );
      }
    } catch (error) {
      console.log('error[]', error);
    }
  };
  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData(prev => {
      const updatedFormData = {...prev, [field]: value};
      setErrors({});
      return updatedFormData;
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Header onPress={handleBackPress} auth />
        <StepContent
          step={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          onEmailCodeComplete={code =>
            updateFormData('emailVerification', code)
          }
          onPhoneCodeComplete={code => {
            updateFormData('numberVerification', code);
          }}
          isKeyboardVisible={isKeyboardVisible}
          errors={errors}
          handleCountryCode={handleCountryCode}
        />
        <View style={styles.footer}>
          {currentStep === 5 && (
            <View style={styles.agreementTextContainer}>
              <Icon
                source={check ? icons.approved : icons.unchecked}
                size={20}
                color={check ? colors.primary : '#BCB3E2'}
                onPress={() => setCheck(!check)}
                style={{marginTop: 2}}
              />
              <Text textStyle="regular16" color={colors.textPrimary}>
                I agree to the{' '}
                <Text textStyle="bold16">Terms of Services </Text>
                and <Text textStyle="bold16">Privacy Policy.</Text>
              </Text>
            </View>
          )}
          <Button
            title={currentStep === 5 ? 'Create Account' : 'Continue'}
            backgroundColor={colors.primary}
            textColor={colors.background}
            width={'85%'}
            onPress={handleNext}
            disabled={Object.keys(errors).length > 0}
          />
          {(currentStep === 2 || currentStep === 4) && (
            <CountdownTimer
              duration={120}
              storageKey={`signup_otp_${formData.email}_step_${currentStep}`}
              onResend={handleReset}
              autoStart={true}
              forceReset={true}
            />
          )}
          {currentStep === 0 && (
            <Text textStyle="regular16" color={colors.textPrimary}>
              Already have an account?{' '}
              <Text
                textStyle="semibold16"
                style={{textDecorationLine: 'underline'}}
                onPress={() => {
                  navigation.navigate(routes.signIn);
                }}>
                Sign In
              </Text>
            </Text>
          )}
          <PaginationDots
            total={4}
            currentIndex={
              currentStep === 0
                ? 0
                : currentStep === 1 || currentStep === 2
                ? 1
                : currentStep === 3 || currentStep === 4
                ? 2
                : 3
            }
            color={colors.primary}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
