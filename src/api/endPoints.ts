export const endPoints = {
  //auth/signup
  createUser: '/users/',
  verifyOtp: '/users/verify-otp/',
  setPassword: '/users/set-password/',
  resendOtp: '/users/resend-otp/',
  forgetPassword: '/users/forgot-password',

  //auth/signin
  signIn: '/users/sign-in/',
  resetpassword: '/users/reset-password',
  logout: '/users/logout/',

  // /qr/create
  qrLogin: '/qr/scan',

  //dashboad/getme
  getUser: '/users/',

  //notes
  getAllNotes: '/note/',
  deleteNote: '/note/delete',

  //events
  getAllEvents: '/event/',
  getUsersNetwork: '/network/all',
  searchNetwork: '/network/search',
  createEvent: '/event',
  acceptReject: '/event/attendance/',
  eventHistory: '/event/history',

  //bussiness
  getAllBussiness: '/business',

  //profile
  updateProfile: '/profile',

  // notification
  getNotification: '/notification',
};
