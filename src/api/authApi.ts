import {POST_ERROR} from '../utils/messages';
import {endPoints} from './endPoints';
import api from './genericApis';
import {
  CreateUserRequest,
  CreatePasswordRequest,
  ResendOtpRequest,
  SignInRequest,
  VerifyOtpRequest,
  QrLoginData,
} from '../screens/authStack/types';

export const signin = async (userData: SignInRequest) => {
  try {
    const response = await api.post(endPoints.signIn, userData);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const createUser = async (userData: CreateUserRequest) => {
  try {
    const response = await api.post(endPoints.createUser, userData);
    return response && response.data;
  } catch (error) {
    // throw error;
  }
};
export const resendOtp = async (userData: ResendOtpRequest) => {
  try {
    const response = await api.post(endPoints.resendOtp, userData);
    return response && response.data;
  } catch (error) {
    // throw error;
  }
};
export const verifyOtp = async (userData: VerifyOtpRequest) => {
  try {
    const response = await api.post(endPoints.verifyOtp, userData);
    return response && response.data;
  } catch (error) {
    // throw error;
  }
};
export const createPassword = async (userData: CreatePasswordRequest) => {
  try {
    const response = await api.post(endPoints.setPassword, userData);
    return response && response.data;
  } catch (error) {
    // throw error;
  }
};
export const forgetPassword = async (userData: ResendOtpRequest) => {
  try {
    const response = await api.post(endPoints.forgetPassword, userData);
    return response && response.data;
  } catch (error) {
    // throw error;
  }
};
export const qrLogin = async (userData: QrLoginData) => {
  try {
    const response = await api.post(endPoints.qrLogin, userData);
    return response && response.data;
  } catch (error) {
    // throw error;
  }
};
export const logout = async () => {
  try {
    const response = await api.get(endPoints.logout);
    return response && response.data;
  } catch (error: object | any) {
    console.error(
      POST_ERROR(
        '/auth/logout',
        error.response?.data?.message || error.message,
      ),
    );
    throw error;
  }
};
