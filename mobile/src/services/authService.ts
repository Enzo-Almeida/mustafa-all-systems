import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, LoginResponse } from '../types';
import apiConfig from '../config/api';

// Configurar axios com interceptors para adicionar token
const apiClient = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🌐 URL da API:', apiConfig.ENDPOINTS.AUTH.LOGIN);
    console.log('📤 Enviando requisição de login...');
    
    try {
      const response = await apiClient.post<LoginResponse>(apiConfig.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log('✅ Resposta recebida:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro na requisição:', error);
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network request failed')) {
        console.error('❌ Erro de conexão - Verifique se o backend está rodando e a URL está correta');
      }
      throw error;
    }
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ accessToken: string }>(apiConfig.ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data;
  },
};

