import { endPoints } from './endPoints';
import api from './genericApis';

export const updateProfile = async (profileData: Record<string, any>) => {
  try {
    const response = await api.put(`${endPoints.updateProfile}`, profileData);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
