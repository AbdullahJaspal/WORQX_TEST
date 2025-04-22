import React, { useState, useEffect, useRef } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { Header, Icon, QRScannerMask } from '../../../components';
import { qrLogin } from '../../../api/authApi';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/features/toastSlice';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList, routes } from '../../../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { icons } from '../../../assets/icons';
import { QrLoginData } from '../types';
import { showLoader } from '../../../redux/features/loaderSlice';

let debounceTimer: NodeJS.Timeout | null = null;

// Get screen dimensions to calculate scanning area
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Define the active scanning area size (adjust these values to match your QRScannerMask)
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7; // Assuming the mask is 70% of screen width
const SCAN_AREA_TOP = SCREEN_HEIGHT * 0.3; // Adjust based on where your mask is positioned

export default function QRCodeScannerScreen() {
  const scanningRef = useRef(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [scanned, setScanned] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    requestPermission();
  }, [hasPermission, requestPermission]);

  // Check if the detected QR code is within the scanning area
  const isCodeInScanArea = (code: { frame?: { x: number, y: number, width: number, height: number } }) => {
    if (!code.frame) return false;

    // The QR code position in the camera view
    const { x, y, width, height } = code.frame;

    const scanAreaLeft = (SCREEN_WIDTH - SCAN_AREA_SIZE) / 2;
    const scanAreaRight = scanAreaLeft + SCAN_AREA_SIZE;
    const scanAreaBottom = SCAN_AREA_TOP + SCAN_AREA_SIZE;

    const codeCenter = {
      x: x + width / 2,
      y: y + height / 2,
    };

    return (
      codeCenter.x >= scanAreaLeft &&
      codeCenter.x <= scanAreaRight &&
      codeCenter.y >= SCAN_AREA_TOP &&
      codeCenter.y <= scanAreaBottom
    );
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: async codes => {
      if (codes.length > 0 && !scanningRef.current) {
        // Only process codes that are within the scanning area
        const validCodes = codes.filter(code => isCodeInScanArea(code));

        if (validCodes.length > 0) {
          const scannedSessionId = validCodes[0].value;
          scanningRef.current = true;
          setScanned(true);
          scannedSessionId && handleScan(scannedSessionId);
        }
      }
    },
  });

  const handleScan = async (scannedSessionId: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      dispatch(showLoader(true));
      try {
        const data: QrLoginData = {
          sessionId: scannedSessionId,
          type: 'signIn',
        };
        const response = await qrLogin(data);
        console.log('QR Login Response:', response);
        if (response?.success) {
          dispatch(
            showToast({
              message: 'QR code scanned successfully!',
              type: 'success',
            }),
          );
          navigation.replace(routes.bottomTab, { screen: routes.dashboard });
        } else {
          scanningRef.current = false;
          setScanned(false);
        }
      } catch (error) {
        console.error('QR Login Error:', error);
        scanningRef.current = false;
        setScanned(false);
      }
      dispatch(showLoader(false));
    }, 1000);
  };

  if (sessionId) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          onPress={() => {
            setSessionId('');
            setScanned(false);
          }}>
          {sessionId}
        </Text>
      </View>
    );
  }
  if (!hasPermission) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginTop: 40,
            width: '80%',
          }}>
          <Header
            onPress={() => {
              navigation.goBack();
            }}
            logoVisible={false}
            white
            auth
          />
        </View>
        <Text
          onPress={() => {
            try {
              console.log('Requesting permission');

              requestPermission();
            } catch (error) {
              console.log('Error in requesting permission');
            }
          }}>
          No access to camera
        </Text>
      </SafeAreaView>
    );
  }
  if (device == null) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            marginTop: 40,
            top: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            padding: 10,
            borderRadius: 100,
            marginLeft: 16,
            zIndex: 2000,
          }}>
          <Icon source={icons.back} size={18} color={'white'} />
        </Pressable>
        <Text>Camera not available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanned}
        codeScanner={codeScanner}
      />
      <View
        style={{
          position: 'absolute',
          marginTop: 40,
          top: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          padding: 10,
          borderRadius: 100,
          marginLeft: 16,
        }}>
        <Icon
          source={icons.back}
          size={18}
          color={'white'}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <QRScannerMask />

      {/* Optional: Add a visual indicator for debugging */}
      {/* 
      <View style={{
        position: 'absolute',
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        top: SCAN_AREA_TOP,
        left: (SCREEN_WIDTH - SCAN_AREA_SIZE) / 2,
        borderWidth: 2,
        borderColor: 'red',
        backgroundColor: 'transparent',
      }} />
      */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
});