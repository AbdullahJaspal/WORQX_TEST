import { POST_ERROR } from '../utils/messages';
import { endPoints } from './endPoints';
import api from './genericApis';
import {
  CreateUserRequest,
  CreatePasswordRequest,
  ResendOtpRequest,
  SignInRequest,
  VerifyOtpRequest,
  QrLoginData,
} from '../screens/authStack/types';

const handleApiError = (error: any, endpoint: string) => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  console.error(POST_ERROR(endpoint, errorMessage));

  return {
    success: false,
    message: errorMessage,
    error: error.response?.data || error,
  };
};

export const signin = async (userData: SignInRequest) => {
  try {
    const response = await api.post(endPoints.signIn, userData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.signIn);
  }
};

export const createUser = async (userData: CreateUserRequest) => {
  try {
    const response = await api.post(endPoints.createUser, userData);
    return response?.data ?? null;
  } catch (error: any) {
    return handleApiError(error, endPoints.createUser);
  }
};

export const resendOtp = async (userData: ResendOtpRequest) => {
  try {
    const response = await api.post(endPoints.resendOtp, userData);
    return response?.data ?? null;
  } catch (error: any) {
    return handleApiError(error, endPoints.resendOtp);
  }
};

export const verifyOtp = async (userData: VerifyOtpRequest) => {
  try {
    const response = await api.post(endPoints.verifyOtp, userData);
    return response?.data ?? null;
  } catch (error: any) {
    return handleApiError(error, endPoints.verifyOtp);
  }
};

export const createPassword = async (userData: CreatePasswordRequest) => {
  try {
    const response = await api.post(endPoints.setPassword, userData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.setPassword);
  }
};

export const forgetPassword = async (userData: ResendOtpRequest) => {
  try {
    const response = await api.post(endPoints.forgetPassword, userData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.forgetPassword);
  }
};

export const qrLogin = async (userData: QrLoginData) => {
  try {
    const response = await api.post(endPoints.qrLogin, userData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.qrLogin);
  }
};

export const logout = async () => {
  try {
    const response = await api.get(endPoints.logout);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.logout);
  }
};