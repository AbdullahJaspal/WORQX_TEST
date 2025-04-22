import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/themeContext';
import fonts from '../theme/fonts';
import Icon from './Icon';
import { Hide, icons, Show } from '../assets/icons';
import { Text } from '.';
import { InputFieldProps, InputVariant } from './types';


const countryCodes = [
  { code: '+61', country: 'Australia' },
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+81', country: 'Japan' },
  { code: '+92', country: 'Pakistan' },
];

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required,
  error,
  containerStyle,
  style,
  value,
  onChangeText,
  isPassword,
  isPhoneNumber,
  secureTextEntry,
  handleCountryCode,
  icon,
  iconContainerStyle,
  onPressIcon,
  variant,
  labelColor,
  marginTop = 12,
  verify,
  verifyStatus = "Verify Now",
  onPressVerify,
  ...props
}) => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCode, setSelectedCode] = useState('+61');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const getEffectiveVariant = (): InputVariant => {
    if (variant) return variant;
    if (isPassword) return 'password';
    if (isPhoneNumber) return 'phone';
    return 'default';
  };

  const effectiveVariant = getEffectiveVariant();

  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value as string);
    } else if (effectiveVariant === 'phone') {
      setInputValue(selectedCode);
    } else {
      setInputValue('');
    }
  }, [value, effectiveVariant, selectedCode]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectCountryCode = (code: string) => {
    setSelectedCode(code);
    if (effectiveVariant === 'phone') {
      const phoneWithoutCode = inputValue.replace(selectedCode, '').trim();
      const newValue = `${code} ${phoneWithoutCode}`;
      setInputValue(newValue);
      onChangeText && onChangeText(newValue);
    }
    toggleModal();
    handleCountryCode && handleCountryCode(code);
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);

    if (effectiveVariant === 'phone') {
      if (!text.startsWith(selectedCode)) {
        const formattedText = `${selectedCode} ${text
          .replace(selectedCode, '')
          .trim()}`;
        setInputValue(formattedText);
        onChangeText && onChangeText(formattedText);
        return;
      }
    }

    onChangeText && onChangeText(text);
  };

  const renderPhoneCodeSelector = () => {
    if (effectiveVariant !== 'phone' || !inputValue.startsWith(selectedCode))
      return null;

    return (
      <TouchableOpacity
        onPress={toggleModal}
        style={[
          styles.codeSelector,
          {
            borderRightColor: colors.grey,
          },
        ]}>
        <Text textStyle="medium16">{selectedCode}</Text>
      </TouchableOpacity>
    );
  };

  const renderRightIcon = () => {
    if (effectiveVariant === 'password') {
      return (
        <Pressable
          onPress={togglePasswordVisibility}
          style={[styles.iconContainer, iconContainerStyle]}>
          {showPassword ? <Show /> : <Hide />}
        </Pressable>
      );
    }

    if (effectiveVariant === 'search') {
      return (
        <Pressable
          onPress={onPressIcon}
          style={[styles.searchIconContainer, iconContainerStyle]}>
          <Icon
            source={icons.search}
            size={20}
            disabled
            color={colors.primary}
          />
        </Pressable>
      );
    }

    if (icon && onPressIcon) {
      return (
        <Pressable
          onPress={onPressIcon}
          style={[styles.rightIconContainer, iconContainerStyle]}>
          <Icon source={icon} size={20} disabled />
        </Pressable>
      );
    }

    return null;
  };

  const getVariantStyles = () => {
    switch (effectiveVariant) {
      case 'search':
        return {
          container: {
            marginTop: 0,
            ...containerStyle,
          },
          input: {
            backgroundColor: colors.surface,
            borderRadius: 25,
            borderWidth: 0,
            borderBottomWidth: 0,
            height: 45,
            paddingHorizontal: 15,
            paddingLeft: 15,
            paddingRight: 45,
            shadowOpacity: 0,
            ...style,
          },
          icon: {
            ...iconContainerStyle,
          },
        };
      default:
        return {
          container: containerStyle,
          input: {
            ...(icon && {
              paddingRight: 40,
            }),
            ...style,
          },
          icon: iconContainerStyle,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const getPlaceholder = () => {
    if (placeholder) return placeholder;

    switch (effectiveVariant) {
      case 'search':
        return 'Search here';
      default:
        if (icon === icons.calendar) return 'Select Date';
        if (icon === icons.clock) return 'Select Time';
        return '';
    }
  };

  const isDateOrTimeField = icon === icons.calendar || icon === icons.clock;
  const fieldStyle = isDateOrTimeField ? styles.dateTimeField : {};

  return (
    <View style={[{ marginTop: marginTop }, variantStyles.container]}>
      {label && (
        <Text textStyle={'semibold16'} color={labelColor} style={styles.label}>
          {label}
          {required && (
            <Text textStyle="semibold16" color={colors.error}>
              {' '}
              *
            </Text>
          )}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          fieldStyle,
          {
            borderColor: error
              ? colors.error
              : isFocused
                ? colors.primary
                : colors.grey,
          },
          effectiveVariant === 'search' && {
            borderBottomWidth: 0,
            borderWidth: 0,
          },
          variantStyles.input,
        ]}>
        {renderPhoneCodeSelector()}

        <TextInput
          style={[
            styles.input,
            {
              fontFamily: fonts.family.medium,
              color: colors.textPrimary,
              fontSize: 16,
              textAlignVertical: 'center',
              height: '100%',
              paddingBottom:
                effectiveVariant === 'default' ||
                  effectiveVariant === 'password'
                  ? 4
                  : 0,
            },
            effectiveVariant === 'phone' && styles.phoneInput,
            isDateOrTimeField && {
              color: inputValue ? colors.textPrimary : colors.textSecondary,
            },
          ]}
          placeholder={getPlaceholder()}
          placeholderTextColor={colors.textSecondary || '#999999'}
          secureTextEntry={
            effectiveVariant === 'password' ? !showPassword : secureTextEntry
          }
          keyboardType={effectiveVariant === 'phone' ? 'phone-pad' : 'default'}
          value={inputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          onChangeText={handleInputChange}
          {...props}
        />
        {verify && <Text textStyle='bold12' onPress={onPressVerify}>{verifyStatus}</Text>}
        {renderRightIcon()}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text textStyle="regular12" color={colors.error}>
            {error}
          </Text>
          <Icon source={icons.info} size={13} />
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleModal}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
              },
            ]}>
            <FlatList
              data={countryCodes}
              removeClippedSubviews={false}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountryCode(item.code)}>
                  <Text
                    style={[
                      styles.countryText,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.family.regular,
                      },
                    ]}>
                    {item.country} ({item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  phoneInput: {
    paddingLeft: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    padding: 5,
  },
  searchIconContainer: {
    position: 'absolute',
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    bottom: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  codeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    paddingRight: 10,
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  countryItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  countryText: {
    fontSize: 16,
  },
  label: {
    marginBottom: 8,
  },
  dateTimeField: {
    borderColor: '#E0E0E0',
    height: 27,
  },
});

export default InputField;
