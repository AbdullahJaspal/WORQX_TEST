import React, { memo } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from './src/redux/store';

import { LoadingScreen, Toast } from './src/components';
import NoNetWork from './src/components/NoNetwork';
import AppNavigator from './src/navigation/AppNavigator';

import { ThemeProvider } from './src/context/themeContext';
import { NetworkProvider } from './src/context/NetworkContext';

const App: React.FC<{}> = () => (
  <ThemeProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NetworkProvider>
          <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="dark-content" backgroundColor="white" />
              <AppNavigator />
              <NoNetWork />
            </SafeAreaView>
          </NavigationContainer>
        </NetworkProvider>
        <LoadingScreen />
        <Toast stacked={false} />
      </PersistGate>
    </Provider>
  </ThemeProvider>
);

export default memo(App);