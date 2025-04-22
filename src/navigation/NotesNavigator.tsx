import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyNotes from '../screens/homeStack/notes';
import AddNotes from '../screens/homeStack/notes/addNotes';
import DeleteNotes from '../screens/homeStack/notes/deleteNotes';
import { routes } from './Routes';
import ViewNotes from '../screens/homeStack/notes/viewNotes';

const Stack = createNativeStackNavigator();

const NotesNavigator = () => (
  <Stack.Navigator
    initialRouteName={routes.myNotes}
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={routes.myNotes} component={MyNotes} />
    <Stack.Screen
      name={routes.addNotes}
      component={AddNotes}
      options={{
        presentation: 'transparentModal',
        tabBarStyle: {
          display: 'none',
        },
        tabBarButton: () => null,
      }}
    />
    <Stack.Screen
      name={routes.viewNotes}
      component={ViewNotes}
      options={{ presentation: 'transparentModal' }}
    />
    <Stack.Screen
      name={routes.deleteNotes}
      component={DeleteNotes}
      options={{ presentation: 'transparentModal' }}
    />
  </Stack.Navigator>
);

export default NotesNavigator;
