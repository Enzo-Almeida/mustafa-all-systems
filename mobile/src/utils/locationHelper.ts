/**
 * Helper centralizado para importação e uso do expo-location
 * 
 * Este helper resolve o problema de expo-location retornar undefined no Expo Go
 * e fornece uma interface consistente para todas as telas que precisam de localização.
 */

import { Alert } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LocationObject {
  coords: LocationCoords;
  timestamp: number;
}

export interface LocationPermissionStatus {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain?: boolean;
}

let cachedLocationModule: any = null;
let isLocationAvailable = false;

/**
 * Importa o módulo expo-location de forma robusta
 * Tenta diferentes formas de importação e cacheia o resultado
 */
async function importLocationModule(): Promise<any> {
  // Se já tentamos importar e está disponível, retorna o cache
  if (cachedLocationModule && isLocationAvailable) {
    return cachedLocationModule;
  }

  try {
    console.log('📍 [locationHelper] Tentando importar expo-location...');
    
    // Tentar require() primeiro (funciona melhor com Metro bundler)
    const locationModule: any = require('expo-location');
    
    console.log('📍 [locationHelper] Módulo importado:', typeof locationModule, locationModule ? Object.keys(locationModule).slice(0, 10) : 'undefined');
    
    if (!locationModule) {
      throw new Error('Módulo expo-location retornou undefined');
    }
    
    let Location: any = null;
    
    // expo-location pode exportar de diferentes formas
    if (typeof locationModule === 'object') {
      // Verificar se tem requestForegroundPermissionsAsync diretamente
      if (typeof locationModule.requestForegroundPermissionsAsync === 'function') {
        Location = locationModule;
        console.log('📍 [locationHelper] Usando locationModule diretamente');
      } 
      // Verificar se tem default
      else if (locationModule.default && typeof locationModule.default.requestForegroundPermissionsAsync === 'function') {
        Location = locationModule.default;
        console.log('📍 [locationHelper] Usando locationModule.default');
      }
      // Verificar se tem Location
      else if (locationModule.Location && typeof locationModule.Location.requestForegroundPermissionsAsync === 'function') {
        Location = locationModule.Location;
        console.log('📍 [locationHelper] Usando locationModule.Location');
      }
      // Tentar usar o próprio módulo (pode ser namespace export)
      else {
        Location = locationModule;
        console.log('📍 [locationHelper] Usando locationModule como fallback');
      }
    } else {
      Location = locationModule;
    }
    
    // Verificar se o módulo Location está disponível
    if (!Location || typeof Location.requestForegroundPermissionsAsync !== 'function') {
      console.error('❌ [locationHelper] expo-location não está disponível:', Location);
      console.error('❌ [locationHelper] Tipo:', typeof Location);
      console.error('❌ [locationHelper] Keys:', Location ? Object.keys(Location).slice(0, 10) : 'N/A');
      throw new Error('Módulo de localização não está disponível. É necessário um development build para usar expo-location.');
    }
    
    // Cachear o módulo se estiver disponível
    cachedLocationModule = Location;
    isLocationAvailable = true;
    console.log('✅ [locationHelper] expo-location carregado com sucesso');
    
    return Location;
  } catch (importError: any) {
    console.error('❌ [locationHelper] Erro ao importar expo-location:', importError);
    console.error('❌ [locationHelper] Mensagem:', importError?.message);
    console.error('❌ [locationHelper] Stack:', importError?.stack);
    
    // Não cachear se falhou
    cachedLocationModule = null;
    isLocationAvailable = false;
    
    throw importError;
  }
}

/**
 * Verifica se o módulo de localização está disponível
 */
export async function isLocationModuleAvailable(): Promise<boolean> {
  try {
    await importLocationModule();
    return true;
  } catch {
    return false;
  }
}

/**
 * Solicita permissão de localização em foreground
 */
export async function requestForegroundPermissions(): Promise<LocationPermissionStatus> {
  try {
    const Location = await importLocationModule();
    
    console.log('📍 [locationHelper] Solicitando permissão de localização...');
    const result = await Location.requestForegroundPermissionsAsync();
    console.log('📍 [locationHelper] Status da permissão:', result.status);
    
    return {
      status: result.status,
      canAskAgain: result.canAskAgain,
    };
  } catch (error: any) {
    console.error('❌ [locationHelper] Erro ao solicitar permissão:', error);
    throw new Error('Não foi possível solicitar permissão de localização. Verifique se o módulo está disponível.');
  }
}

/**
 * Obtém a localização atual do dispositivo
 */
export async function getCurrentPosition(options?: {
  accuracy?: number;
  maximumAge?: number;
  timeout?: number;
}): Promise<LocationObject> {
  try {
    const Location = await importLocationModule();
    
    console.log('📍 [locationHelper] Obtendo localização atual...');
    const location = await Location.getCurrentPositionAsync(options || {});
    console.log('📍 [locationHelper] Localização obtida:', location.coords);
    
    return location;
  } catch (error: any) {
    console.error('❌ [locationHelper] Erro ao obter localização:', error);
    throw new Error('Não foi possível obter a localização. Verifique se as permissões foram concedidas.');
  }
}

/**
 * Solicita permissão e obtém localização em uma única chamada
 */
export async function requestPermissionAndGetLocation(options?: {
  accuracy?: number;
  maximumAge?: number;
  timeout?: number;
}): Promise<{ permission: LocationPermissionStatus; location: LocationObject }> {
  const permission = await requestForegroundPermissions();
  
  if (permission.status !== 'granted') {
    throw new Error('Permissão de localização negada');
  }
  
  const location = await getCurrentPosition(options);
  
  return { permission, location };
}

/**
 * Mostra um alerta informando que o módulo de localização não está disponível
 */
export function showLocationUnavailableAlert(): void {
  Alert.alert(
    'Localização Indisponível',
    'O módulo de localização não está disponível no Expo Go. Para usar esta funcionalidade, é necessário criar um development build.\n\n' +
    'Opções:\n' +
    '1. Criar um development build com EAS Build\n' +
    '2. Usar Expo Development Build localmente\n' +
    '3. Continuar sem localização (modo de desenvolvimento)',
    [
      { text: 'OK', style: 'default' },
    ]
  );
}

/**
 * Helper para verificar e solicitar permissão com tratamento de erros
 */
export async function ensureLocationPermission(): Promise<boolean> {
  try {
    const isAvailable = await isLocationModuleAvailable();
    
    if (!isAvailable) {
      showLocationUnavailableAlert();
      return false;
    }
    
    const permission = await requestForegroundPermissions();
    
    if (permission.status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'É necessário permitir o acesso à localização para usar esta funcionalidade.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Tentar Novamente', onPress: () => ensureLocationPermission() },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ [locationHelper] Erro ao garantir permissão:', error);
    Alert.alert(
      'Erro',
      error.message || 'Não foi possível solicitar permissão de localização.'
    );
    return false;
  }
}

