import { DELETE_ERROR } from '../utils/messages';
import axiosInstance from './axiosInstance';


export class ApiError extends Error {
  name: string;
  status: number;
  data: object | null;
  constructor(status: number, message: string, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const api = {
  async get(url: string, params?: any) {
    try {
      const response = await axiosInstance.get(url, { params });
      return response;
    } catch (error: any) {
      const { response } = error as { response: any };
    }
  },

  async post(url: string, data: object, params?: any) {
    try {
      const response = await axiosInstance.post(url, data, { params });
      return response;
    } catch (error: any) {
      const { response } = error as { response: any };
    }
  },

  async put(url: string, data: object, params?: any) {
    try {
      const response = await axiosInstance.put(url, data, { params });
      return response;
    } catch (error: any) {
      const { response } = error as { response: any };
    }
  },

  async delete(url: string, params?: string) {
    try {
      const response = await axiosInstance.delete(url, { params });
      return response;
    } catch (error: any) {
      const { response } = error as { response: any };
      throw new ApiError(
        response?.status || 500,
        DELETE_ERROR(url, response?.data?.message || error.message),
      );
    }
  },
};

export default api;
