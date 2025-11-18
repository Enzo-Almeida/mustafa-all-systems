import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../config/api';

const apiClient = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const storeService = {
  async getStores(): Promise<Store[]> {
    try {
      const response = await apiClient.get('/promoters/stores');
      return response.data.stores || [];
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      // Retornar dados mockados se a API falhar (usando IDs do seed)
      // Nota: Os IDs precisam ser os UUIDs reais do banco
      return [];
    }
  },
};

