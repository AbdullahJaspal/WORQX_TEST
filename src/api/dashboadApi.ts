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

export const getUserInfo = async () => {
  try {
    const response = await api.get(endPoints.getUser);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getUser);
  }
};

export const getBusiness = async () => {
  try {
    const response = await api.get(endPoints.getAllBussiness, {
      saveType: 'published',
    });
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getAllBussiness);
  }
};