declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'lodash/debounce' {
  const debounce: any;
  export default debounce;
}

declare module '@env' {
  export const REACT_APP_BASE_URL: string;
}
