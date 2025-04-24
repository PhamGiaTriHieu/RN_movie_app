import axiosInstance from '@/services/axios';
import qs from 'qs';
const version = 'v1';

// Tạo các custom hooks để sử dụng với Axios
export const apiClient = {
  get: async (url: string, params = {}) => {
    return axiosInstance.get(url, {params});
  },
  post: async (url: string, data = {}) => {
    return axiosInstance.post(url, data);
  },
  put: async (url: string, data = {}) => {
    return axiosInstance.put(url, data);
  },
  delete: async (url: string) => {
    return axiosInstance.delete(url);
  },
};

// Versioning API client
export const apiClientWithVersion = {
  get: async (url: string, params = {}) => {
    return axiosInstance.get(`${version}/api/${url}`, {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, {indices: false});
      },
    });
  },
  post: async (url: string, data = {}) => {
    return axiosInstance.post(`${version}/api/${url}`, data);
  },
  put: async (url: string, data = {}) => {
    return axiosInstance.put(`${version}/api/${url}`, data);
  },
  delete: async (url: string) => {
    return axiosInstance.delete(`${version}/api/${url}`);
  },
};
