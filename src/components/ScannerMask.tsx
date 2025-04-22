import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { images } from '../assets/images';
import { ScannerMaskProps } from './types';

const { width } = Dimensions.get('window');
const SCANNER_AREA_SIZE = width * 0.7;
const CORNER_WIDTH = 40;
const CORNER_HEIGHT = 40;
const CORNER_BORDER_WIDTH = 4;
const CORNER_RADIUS = 12;



const QRScannerMask = ({ expirySeconds = 30 }: ScannerMaskProps) => {
  const [timeLeft, setTimeLeft] = useState(expirySeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Image
          source={images.mask}
          style={{
            width: SCANNER_AREA_SIZE,
            height: SCANNER_AREA_SIZE,
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCANNER_AREA_SIZE,
    height: SCANNER_AREA_SIZE,
    position: 'relative',
  },
  cornerContainer: {
    position: 'absolute',
    width: CORNER_WIDTH,
    height: CORNER_HEIGHT,
  },
  cornerHorizontal: {
    position: 'absolute',
    height: CORNER_BORDER_WIDTH,
    width: CORNER_WIDTH - CORNER_RADIUS,
    backgroundColor: 'white',
  },
  cornerVertical: {
    position: 'absolute',
    width: CORNER_BORDER_WIDTH,
    height: CORNER_HEIGHT - CORNER_RADIUS,
    backgroundColor: 'white',
  },
  // Top Left Corner
  topLeft: {
    top: 0,
    left: 0,
  },
  topLeftHorizontal: {
    top: 0,
    right: 0,
    borderTopLeftRadius: CORNER_RADIUS,
  },
  topLeftVertical: {
    top: 0,
    left: 0,
    borderTopLeftRadius: CORNER_RADIUS,
  },
  // Top Right Corner
  topRight: {
    top: 0,
    right: 0,
  },
  topRightHorizontal: {
    top: 0,
    left: 0,
    borderTopRightRadius: CORNER_RADIUS,
  },
  topRightVertical: {
    top: 0,
    right: 0,
    borderTopRightRadius: CORNER_RADIUS,
  },
  // Bottom Left Corner
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomLeftHorizontal: {
    bottom: 0,
    right: 0,
    borderBottomLeftRadius: CORNER_RADIUS,
  },
  bottomLeftVertical: {
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: CORNER_RADIUS,
  },
  // Bottom Right Corner
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  bottomRightHorizontal: {
    bottom: 0,
    left: 0,
    borderBottomRightRadius: CORNER_RADIUS,
  },
  bottomRightVertical: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: CORNER_RADIUS,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default QRScannerMask;
