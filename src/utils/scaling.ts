import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => (width / guidelineBaseWidth) * size;

const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export {scale, verticalScale, moderateScale};

export const DimensionsData: {
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
} = {screenWidth, screenHeight, windowWidth, windowHeight};
