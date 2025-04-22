import { endPoints } from './endPoints';
import api from './genericApis';

export const getNotification = async () => {
  try {
    const response = await api.get(endPoints.getNotification);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};

export const openNotification = async (id: string) => {
  try {
    const response = await api.get(`${endPoints.getNotification}/${id}`);
    return response?.data;
  } catch (error: object | any) {
    // throw error;
  }
};
