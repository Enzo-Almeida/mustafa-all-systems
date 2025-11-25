import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiConfig from '../config/api';

const apiClient = axios.create({
  baseURL: apiConfig.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export interface PresignedUrlRequest {
  visitId: string;
  type: 'FACADE_CHECKIN' | 'FACADE_CHECKOUT' | 'OTHER';
  contentType?: string;
  extension?: string;
}

export const photoService = {
  async getPresignedUrl(data: PresignedUrlRequest) {
    const response = await apiClient.post(apiConfig.ENDPOINTS.UPLOAD.PHOTO, data);
    return response.data;
  },

  /**
   * Faz upload de uma foto para S3 usando presigned URL
   * Compatível com React Native usando expo-file-system
   */
  async uploadToS3(presignedUrl: string, fileUri: string, contentType: string = 'image/jpeg'): Promise<boolean> {
    try {
      console.log('📤 [photoService] Iniciando upload para S3...');
      console.log('📤 [photoService] URI do arquivo:', fileUri);
      console.log('📤 [photoService] Content-Type:', contentType);

      // Verificar se o arquivo existe
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('Arquivo não encontrado: ' + fileUri);
      }

      // Normalizar URI (garantir que tem file://)
      const normalizedUri = fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`;

      // Fazer upload usando expo-file-system
      // O uploadSessionId é opcional, mas ajuda a rastrear o upload
      const uploadResult = await FileSystem.uploadAsync(presignedUrl, normalizedUri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          'Content-Type': contentType,
        },
      });

      console.log('📤 [photoService] Upload concluído:', uploadResult.status);
      
      if (uploadResult.status === 200) {
        console.log('✅ [photoService] Upload bem-sucedido');
        return true;
      } else {
        console.error('❌ [photoService] Upload falhou com status:', uploadResult.status);
        console.error('❌ [photoService] Resposta:', uploadResult.body);
        return false;
      }
    } catch (error: any) {
      console.error('❌ [photoService] Erro no upload:', error);
      console.error('❌ [photoService] Mensagem:', error?.message);
      console.error('❌ [photoService] Stack:', error?.stack);
      throw error;
    }
  },
};

