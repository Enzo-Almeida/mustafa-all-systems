// Configuração da API
// No Expo, use process.env.EXPO_PUBLIC_* para variáveis de ambiente
const API_URL = typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL 
  ? process.env.EXPO_PUBLIC_API_URL 
  : 'http://localhost:3000/api';

// Log da URL configurada (apenas em desenvolvimento)
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.log('🔧 Configuração da API:');
  console.log('   EXPO_PUBLIC_API_URL:', process.env?.EXPO_PUBLIC_API_URL || 'NÃO DEFINIDO');
  console.log('   API_URL final:', API_URL);
  if (!process.env?.EXPO_PUBLIC_API_URL) {
    console.warn('⚠️  AVISO: EXPO_PUBLIC_API_URL não está definido!');
    console.warn('⚠️  Crie um arquivo .env na pasta mobile com:');
    console.warn('⚠️  EXPO_PUBLIC_API_URL=http://SEU_IP:3000/api');
  }
}

export default {
  BASE_URL: API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `${API_URL}/auth/login`,
      REFRESH: `${API_URL}/auth/refresh`,
    },
    PROMOTER: {
      STORES: `${API_URL}/promoters/stores`,
      CHECKIN: `${API_URL}/promoters/checkin`,
      CHECKOUT: `${API_URL}/promoters/checkout`,
      PHOTOS: `${API_URL}/promoters/photos`,
      PRICE_RESEARCH: `${API_URL}/promoters/price-research`,
      CURRENT_VISIT: `${API_URL}/promoters/current-visit`,
    },
    UPLOAD: {
      PHOTO: `${API_URL}/upload/photo`,
    },
  },
};
