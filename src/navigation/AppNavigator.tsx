import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import { RootStackParamList, routes } from './Routes';
import Splash from '../screens/splash';
import BottomTabNavigator from './BottomTabNavigator';
import EventDetail from '../screens/homeStack/EventDetail';
import ScheduleEvent from '../screens/homeStack/scheduleEvent';
import Invite from '../screens/homeStack/scheduleEvent/invitePerson';
import LinkRecord from '../screens/homeStack/scheduleEvent/linkRecord';
import Participants from '../screens/homeStack/EventDetail/Participants';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.splash}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.splash} component={Splash} />
      <Stack.Screen name={routes.auth} component={AuthNavigator} />
      <Stack.Screen name={routes.bottomTab} component={BottomTabNavigator} />
      <Stack.Screen name={routes.eventDetail} component={EventDetail} />
      <Stack.Screen name={routes.scheduleEvent} component={ScheduleEvent} />
      <Stack.Screen
        name={routes.invite}
        component={Invite}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name={routes.linkRecord}
        component={LinkRecord}
        options={{ presentation: 'transparentModal' }}
      />
      <Stack.Screen
        name={routes.participants}
        component={Participants}
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
