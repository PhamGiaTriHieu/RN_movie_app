import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Lấy token từ AsyncStorage
    const token = await AsyncStorage.getItem('auth_token');

    // Thêm token vào header nếu có
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Có thể thêm các xử lý khác cho request
    return config;
  },
  (error) => {
    // Xử lý lỗi request
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu response
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Lấy refresh token
        const refreshToken = await AsyncStorage.getItem('refresh_token');

        if (!refreshToken) {
          // Nếu không có refresh token, đăng xuất người dùng
          await AsyncStorage.removeItem('auth_token');
          // Có thể dispatch một action để cập nhật trạng thái đăng nhập
          return Promise.reject(error);
        }

        // Gọi API để lấy token mới
        const response = await axios.post(
          'https://api.example.com/auth/refresh',
          {
            refresh_token: refreshToken,
          }
        );

        // Lưu token mới
        await AsyncStorage.setItem('auth_token', response.data.token);

        // Cập nhật header và thực hiện lại request
        originalRequest.headers[
          'Authorization'
        ] = `Bearer ${response.data.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Xử lý khi refresh token thất bại
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('refresh_token');
        // Có thể dispatch một action để đăng xuất
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    return Promise.reject(error);
  }
);

export default axiosInstance;

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
