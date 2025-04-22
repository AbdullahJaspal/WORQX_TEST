import React from 'react';
import {View} from 'react-native';
import {Icon, InputField, Text} from '../../../components';
import VerificationInput from '../../../components/VerificationInput';
import {icons} from '../../../assets/icons';
import styles from './styles';
import {useTheme} from '../../../context/themeContext';
import {SignupData} from '../types';

interface StepContentProps {
  step: number;
  formData: SignupData;
  updateFormData: (field: keyof SignupData, value: string) => void;
  onEmailCodeComplete: (code: string) => void;
  onPhoneCodeComplete: (code: string) => void;
  handleCountryCode: (code: string) => void;
  isKeyboardVisible: boolean;
  errors: Record<string, string>;
  countdown: number;
}
const StepContent: React.FC<StepContentProps> = ({
  step,
  formData,
  updateFormData,
  onEmailCodeComplete,
  onPhoneCodeComplete,
  isKeyboardVisible,
  handleCountryCode,
  errors,
}) => {
  const {colors} = useTheme();

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={{marginTop: 64}}>
            <View style={{gap: 12}}>
              {!isKeyboardVisible && (
                <>
                  <Text textStyle="bold24">Welcome to WORQX!</Text>
                  <Text textStyle="regular14" color={colors.textPrimary}>
                    WORQX is personal to you and not your employer!{'\n'}Its
                    your lifelong personal account.
                  </Text>
                </>
              )}
              <Text textStyle="regular20">Please enter your name</Text>
            </View>
            <InputField
              required
              label="First Name"
              placeholder="Your First Name"
              value={formData.firstName}
              onChangeText={text => updateFormData('firstName', text)}
              error={errors.firstName}
              containerStyle={{marginTop: 20}}
            />
            <InputField
              required
              label="Last Name"
              placeholder="Your Last Name"
              value={formData.lastName}
              onChangeText={text => updateFormData('lastName', text)}
              error={errors.lastName}
              containerStyle={{marginTop: 15}}
            />
          </View>
        );
      case 1:
        return (
          <View style={{marginTop: 64}}>
            <View style={{gap: 12, marginBottom: 20}}>
              <Text textStyle="regular14" color={colors.textPrimary}>
                Because this is your lifelong personal account, we suggest you
                use your personal email address.
              </Text>
              <Text textStyle="regular20">Please enter your email address</Text>
            </View>
            <InputField
              required
              label="Email"
              placeholder="Your Email"
              value={formData.email}
              onChangeText={text => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </View>
        );
      case 2:
        return (
          <View style={{marginTop: 64}}>
            <View style={{gap: 12, marginBottom: 20}}>
              <Text textStyle="regular20">Enter Email Verification Code</Text>
              <Text textStyle="medium14" color={colors.textPrimary}>
                Code just sent to your email address at {formData.email}
              </Text>
            </View>
            <Text textStyle="semibold16">Verification Code</Text>
            <VerificationInput
              length={6}
              value={formData.emailVerification}
              onCodeComplete={onEmailCodeComplete}
              error={errors.emailVerification}
            />
          </View>
        );
      case 3:
        return (
          <View style={{marginTop: 64}}>
            <View style={{gap: 12, marginBottom: 20}}>
              <Text textStyle="regular14" color={colors.textPrimary}>
                Because this is your lifelong personal account, we suggest you
                use your personal mobile phone number
              </Text>
              <Text textStyle="regular20">Please enter your phone number</Text>
            </View>
            <InputField
              required
              label="Phone Number"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChangeText={text => updateFormData('phone', text)}
              keyboardType="phone-pad"
              handleCountryCode={handleCountryCode}
              error={errors.phone}
              isPhoneNumber={true}
            />
          </View>
        );
      case 4:
        return (
          <View style={{marginTop: 64}}>
            <View style={{gap: 12, marginBottom: 20}}>
              <Text textStyle="regular20">
                Enter Phone Number Verification Code
              </Text>
              <Text textStyle="medium14" color={colors.textPrimary}>
                Code just sent to your phone number at {formData.countryCode}
                {formData.phone}
              </Text>
            </View>
            <Text textStyle="semibold16">Verification Code</Text>
            <VerificationInput
              length={6}
              value={formData.numberVerification}
              onCodeComplete={onPhoneCodeComplete}
              error={errors.numberVerification}
            />
          </View>
        );
      case 5:
        return (
          <View style={{marginTop: 64}}>
            <View style={{gap: 12, marginBottom: 20}}>
              <Text textStyle="regular20">
                Please create password for your account
              </Text>
            </View>
            <InputField
              required
              label="Password"
              placeholder="Enter Password"
              value={formData.password}
              onChangeText={text => updateFormData('password', text)}
              secureTextEntry
              isPassword={true}
              error={errors.password || ''}
            />
            <InputField
              required
              label="Confirm Password"
              placeholder="Confirm Password"
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
        );

      default:
        return null;
    }
  };

  return <View style={styles.stepContainer}>{renderStepContent()}</View>;
};

export default StepContent;
