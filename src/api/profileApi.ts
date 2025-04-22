import { endPoints } from './endPoints';
import api from './genericApis';

const handleApiError = (error: any, endpoint: string) => {
  const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
  console.error(`API Error [${endpoint}]: ${errorMessage}`);

  return {
    success: false,
    message: errorMessage,
    error: error.response?.data || error,
  };
};

export const updateProfile = async (profileData: Record<string, any>) => {
  try {
    const response = await api.put(endPoints.updateProfile, profileData);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.updateProfile);
  }
};