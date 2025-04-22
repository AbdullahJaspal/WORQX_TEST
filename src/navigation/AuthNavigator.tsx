import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList, routes } from './Routes';
import SignIn from '../screens/authStack/signIn';
import SignUp from '../screens/authStack/signUp';
import ForgetPassword from '../screens/authStack/forgetPassword';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={routes.signIn}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.signIn} component={SignIn} />
      <Stack.Screen name={routes.signUp} component={SignUp} />
      <Stack.Screen name={routes.forgetpassword} component={ForgetPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
