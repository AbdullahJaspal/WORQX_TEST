import React from 'react';
import {Dimensions, View} from 'react-native';
import {useTheme} from '../context/themeContext';
import {Button, Icon, Text} from '.';
import {icons} from '../assets/icons';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {useNetwork} from '../context/NetworkContext';

const {width, height} = Dimensions.get('window');

const NoNetwork: React.FC = () => {
  const {colors} = useTheme();
  const {isRetrying, checkConnection} = useNetwork();
  const showNetworkError = useSelector(
    (state: RootState) => state.network.showNetworkError,
  );

  if (!showNetworkError) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        gap: 12,
        alignItems: 'center',
        paddingHorizontal: 24,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2000,
        width,
        height,
      }}>
      <Icon source={icons.noConnection} size={50} />
      <Text textStyle="medium16" color={colors.textPrimary}>
        Network Error
      </Text>
      <Text
        textStyle="regular14"
        color={colors.textPrimary}
        style={{textAlign: 'center'}}>
        Oops! It seems like there's a connection issue. Please check your
        internet and try again.
      </Text>
      <Button
        height={36}
        width={210}
        backgroundColor={colors.primary}
        title={isRetrying ? 'Checking...' : 'Retry'}
        textStyle="semibold12"
        onPress={checkConnection}
        disabled={isRetrying}
      />
    </View>
  );
};

export default NoNetwork;
