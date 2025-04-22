
//signup
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password: string;
  confirmPassword: string;
  emailVerification?: string;
  numberVerification?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  type: 'signUp';
}

export interface VerifyOtpRequest {
  code?: string;
  platformType: 'mobile';
  email: string;
  type: 'signUp' | 'signIn' | 'forgotPassword' | 'updateEmail' | 'updatePhone';
}

export interface ResendOtpRequest {
  email?: string;
  mobile?: string;
  type: 'signUp' | 'signIn' | 'forgotPassword' | 'updateEmail' | 'updatePhone';
}

export interface CreatePasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
  code?: string;
  type: 'signUp' | 'forgotPassword';
}

//signin
export interface SignInData {
  email: string;
  password: string;
  emailVerification: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  platformType: string;
  type: 'signIn';
}

//forgetPassword

export interface ForgetpasswordData {
  email: string;
  phone: string;
  password: string;
  emailVerification: string;
  confirmPassword: string;
}

//QRcode

export interface QrLoginData {
  sessionId: string;
  type: 'signIn';
}
