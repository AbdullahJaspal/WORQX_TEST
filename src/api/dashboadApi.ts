import {endPoints} from './endPoints';
import api from './genericApis';

export const getUserInfo = async () => {
  try {
    const response = await api.get(endPoints.getUser);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
export const getBusiness = async () => {
  try {
    const response = await api.get(endPoints.getAllBussiness, {
      saveType: 'published',
    });
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
