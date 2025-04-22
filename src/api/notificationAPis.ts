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

export const getNotification = async () => {
  try {
    const response = await api.get(endPoints.getNotification);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endPoints.getNotification);
  }
};

export const openNotification = async (id: string) => {
  const endpoint = `${endPoints.getNotification}/${id}`;
  try {
    const response = await api.get(endpoint);
    return response?.data;
  } catch (error: any) {
    return handleApiError(error, endpoint);
  }
};