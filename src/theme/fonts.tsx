import {moderateScale} from '../utils/scaling';

const size = {
  tiny12: moderateScale(12),
  small16: moderateScale(16),
  regular20: moderateScale(20),
  large24: moderateScale(24),
};

const family = {
  bold: 'SourceSans3-Bold',
  medium: 'SourceSans3-Medium',
  regular: 'SourceSans3-Regular',
  semibold: 'SourceSans3-SemiBold',
};

export default {
  size,
  family,
};
