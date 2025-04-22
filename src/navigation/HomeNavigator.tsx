import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList, routes } from './Routes';
import Dashboard from '../screens/homeStack/dashboard';
import QRCodeScannerScreen from '../screens/authStack/qrScan';
import CalendarScreen from '../screens/homeStack/calender';
import NotesNavigator from './NotesNavigator';
import ActivityScreen from '../screens/homeStack/activityScreen';
import ActivityDetail from '../screens/homeStack/activityDetail';
import HistoryScreen from '../screens/homeStack/scheduleEvent/history';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.dashboard}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.dashboard} component={Dashboard} />
      <Stack.Screen name={routes.calender} component={CalendarScreen} />
      <Stack.Screen name={routes.qrScanner} component={QRCodeScannerScreen} />
      <Stack.Screen name={routes.myActivity} component={ActivityScreen} />
      <Stack.Screen name={routes.activityDetail} component={ActivityDetail} />
      <Stack.Screen name={routes.notes} component={NotesNavigator} />
      <Stack.Screen
        name={routes.historyScreen}
        component={HistoryScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
