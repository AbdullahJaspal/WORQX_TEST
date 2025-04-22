import React, { useState, useRef, } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import fonts from '../theme/fonts';
import { useTheme } from '../context/themeContext';
import { Text } from '.';
import { Info } from '../assets/icons';

interface VerificationInputProps {
  length?: number;
  onCodeComplete?: (code: string) => void;
  error?: string;
  value?: string;
  containerStyle?: ViewProps['style'];
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  length = 6,
  onCodeComplete,
  error,
  value,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const [code, setCode] = useState<string[]>(
    value ? value.split('') : Array(length).fill(''),
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      onCodeComplete?.(newCode.join(''));
    }
  };

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    const { key } = event.nativeEvent;

    if (key === 'Backspace') {
      if (code[index] === '') {
        if (index > 0) {
          const newCode = [...code];
          newCode[index - 1] = '';
          setCode(newCode);

          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.verificationContainer}>
        {Array.from({ length }).map((_, index) => (
          <React.Fragment key={index}>
            <TextInput
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.verificationInput,
                {
                  fontFamily: fonts.family.semibold,
                  borderColor: error ? colors.error : colors.grey,
                  fontSize: fonts.size.large24,
                  padding: 0,
                  paddingTop: 2,
                },
              ]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={value => handleChange(value, index)}
              onKeyPress={event => handleKeyPress(event as any, index)}
              value={code[index]}
            />
            {(index + 1) % 3 === 0 && index + 1 < length && (
              <View style={styles.separator} />
            )}
          </React.Fragment>
        ))}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text textStyle="regular12" color={colors.error}>
            {error}
          </Text>
          <Info />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationInput: {
    width: 45,
    height: 53,
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    fontSize: 18,
    borderColor: '#939090',
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  separator: {
    width: 15,
    height: 4,
    backgroundColor: 'black',
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
});

export default VerificationInput;
