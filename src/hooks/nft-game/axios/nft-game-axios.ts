import axios from 'axios';
import { NFT_GAME_BACKEND_URL } from "../../../config/constants/environments"

const ApiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEW_BACKEND_BASE_URL,
});

// Add a request interceptor to set the Authorization header with a JWT token.
ApiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken-v2');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// API Methods
const Api = {
  get(endpoint: string, params?: string) {
    return ApiService.get(endpoint, { params });
  },

  post(endpoint: string, data: any) {
    return ApiService.post(endpoint, data);
  },

  put(endpoint: string, data: any) {
    return ApiService.put(endpoint, data);
  },

  patch(endpoint: string, data: any) {
    return ApiService.patch(endpoint, data);
  },

  delete(endpoint: string) {
    return ApiService.delete(endpoint);
  },
};

export default Api;
