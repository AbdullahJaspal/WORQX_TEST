import axios from 'axios';
import store from '../redux/store';
import { showToast } from '../redux/features/toastSlice';
import { login } from '../redux/features/authSlice';
import { REACT_APP_BASE_URL } from '@env';
import { setShowNetworkError } from '../redux/features/networkSlice';
import NetworkManager from '../services/NetworkManager';

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL,
  // baseURL: 'http://10.0.0.48:9000/api/v1',
  // timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async config => {
    const networkManager = NetworkManager.getInstance();
    const isConnected = networkManager.getCurrentStatus();
    if (!isConnected) {
      return Promise.reject({ message: 'Network Error' });
    }
    const token = store.getState().auth.token;

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    config.headers['platform-type'] = 'mobile';
    return config;
  },
  error => Promise.reject(error),
);

const handleLogout = async () => {
  try {
    store.dispatch(login({ token: null }));
  } catch (error) {
    console.log('Error[]', error);
  }
};
// Response interceptor
axiosInstance.interceptors.response.use(
  response => response,

  error => {
    console.log(
      'API responses',
      error?.response?.status,
      error?.response?.data,
      error,
    );
    if (error.message === 'Network Error' || !error.response) {
      store.dispatch(setShowNetworkError(true));
      NetworkManager.getInstance().checkConnection();
      return Promise.reject(error);
    }
    if (error?.response) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      if ([409, 404, 400].includes(error?.response?.status)) {
        console.log('Error[]', error);
        store.dispatch(
          showToast({
            message: error?.response?.data?.message || 'Something went wrong.',
            type: 'error',
          }),
        );
      } else if ([429].includes(error?.response?.status)) {
        store.dispatch(
          showToast({
            message: error?.response?.data?.message,
            type: 'error',
          }),
        );
      } else if (error?.response?.status === 500) {
        store.dispatch(
          showToast({
            message: error?.response?.data?.message,
            type: 'error',
          }),
        );
      }
    }

    return Promise.reject(error);
  },
);
export default axiosInstance;
