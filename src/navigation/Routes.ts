export const routes = {
  // AppNavigator
  splash: 'Splash',
  auth: 'Auth',
  home: 'Home',
  bottomTab: 'BottomTab',

  // AuthNavigator
  signIn: 'SignIn',
  signUp: 'SignUp',
  forgetpassword: 'ForgetPassword',
  qrScanner: 'QRCodeScannerScreen',

  //HomeNavigator
  dashboard: 'Dashboard',

  //BottomTabNavigator
  homeScreen: 'Dashboard',
  notifications: 'Notifications',
  search: 'Search',
  more: 'More',
  profile: 'Profile',

  //
  calender: 'CalendarScreen',
  eventDetail: 'EventDetail',
  participants: 'Participants',
  rsvp: 'RSVP',
  scheduleEvent: 'ScheduleEvent',

  notes: 'Notes',

  //notes Navigator
  myNotes: 'MyNotes',
  addNotes: 'AddNotes',
  viewNotes: 'ViewNotes',
  deleteNotes: 'DeleteNotes',

  // activity
  myActivity: 'ActivityScreen',
  activityDetail: 'ActivityDetail',
  invite: 'Invite',
  linkRecord: 'LinkRecord',
  historyScreen: 'HistoryScreen',
} as const;

export type Routes = typeof routes;

export type AppStackParamList = {
  [routes.splash]: undefined;
  [routes.auth]: undefined | { screen: string };
  [routes.home]: undefined | { screen: string };
  [routes.qrScanner]: undefined | { screen: string };
  [routes.bottomTab]: undefined | { screen: string };
  [routes.eventDetail]: { item: any };
  [routes.scheduleEvent]: { item: any };
  [routes.invite]: undefined | { screen: string; params: any };
  [routes.linkRecord]: undefined | { screen: string; params: any };
  [routes.participants]: { participants: Array<any> };
};

export type AuthStackParamList = {
  [routes.splash]: undefined;
  [routes.signIn]: undefined;
  [routes.signUp]: undefined;
  [routes.forgetpassword]: undefined;
  [routes.bottomTab]: undefined | { screen: string };
  [routes.home]: undefined;
};

export type HomeStackParamList = {
  [routes.qrScanner]: undefined;
  [routes.auth]: undefined;
  [routes.dashboard]: undefined;
  [routes.calender]: undefined | { item: any };
  [routes.eventDetail]: { item: any };
  [routes.participants]: {
    participants: Array<{
      name: string;
      imageUrl?: string;
      firstName: string;
      lastName: string;
      role: string;
      userId: string;
    }>;
  };
  [routes.rsvp]: undefined | { screen: string };
  [routes.notes]: undefined | { screen: string };
  [routes.myActivity]: undefined | { screen: string };
  [routes.activityDetail]: undefined | { screen: string };
  [routes.scheduleEvent]: { item: any };
  [routes.invite]: undefined | { screen: string };
  [routes.linkRecord]: undefined | { screen: string };
  [routes.historyScreen]: undefined | { screen: string };
};

export type NotesStackParamList = {
  [routes.myNotes]: undefined | { screen: string };
  [routes.addNotes]: undefined | { screen: string };
  [routes.viewNotes]: undefined | { screen: string };
  [routes.deleteNotes]: undefined | { screen: string };
};

export type RootStackParamList = AppStackParamList & {
  [routes.auth]: AuthStackParamList;
};