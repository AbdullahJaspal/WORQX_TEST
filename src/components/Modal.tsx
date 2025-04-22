import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import Text from './Text';
import { useTheme } from '../context/themeContext';
import { LoadingScreen } from '.';
import { ModalProps } from './types';


const { width } = Dimensions.get('window');

const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  onAction,
  title,
  message,
  leftButton,
  rightButton,
}) => {
  const { colors } = useTheme();
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}>
            <View style={styles.header}>
              <Text textStyle="semibold16" color={colors.background}>
                {title}
              </Text>
            </View>

            <View style={styles.content}>
              <Text textStyle="regular12" color={colors.textPrimary}>
                {message}
              </Text>

              <View style={styles.buttonContainer}>
                {leftButton && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}>
                    <Text textStyle="regular12" color={colors.textPrimary}>
                      {leftButton}
                    </Text>
                  </TouchableOpacity>
                )}
                {rightButton && (
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={onAction}>
                    <Text textStyle="regular12" color={colors.error}>
                      {rightButton}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
      <LoadingScreen />
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 900,
  },
  modalContainer: {
    width: width - 32,
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 14,
    zIndex: 900,
    overflow: 'hidden',
  },
  modalContent: {
    zIndex: 900,
    backgroundColor: 'white',
  },
  header: {
    zIndex: 900,
    backgroundColor: '#2F5A3C',
    padding: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    borderRadius: 24,
    height: 30,
    borderWidth: 1,
    paddingHorizontal: 24,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 14,
  },
  logoutButton: {
    borderRadius: 24,
    height: 30,
    paddingHorizontal: 24,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
  },
  logoutButtonText: {
    color: '#FF4444',
    fontSize: 14,
  },
});

export default Modal;
