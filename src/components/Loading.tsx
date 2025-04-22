import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Spinner, Text } from '.';
import { useTheme } from '../context/themeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LoadingScreenProps } from './types';

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  spinnerSize = 60,
  message,
}) => {
  const { colors } = useTheme();
  const isVisible = useSelector((state: RootState) => state.loader.loading);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.blurView} />
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <Spinner size={spinnerSize} color={colors.primary} />
        {message && (
          <Text style={[styles.text, { color: colors.textPrimary }]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    gap: 10,
    padding: 30,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoadingScreen;
