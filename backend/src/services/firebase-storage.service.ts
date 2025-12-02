import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Admin (only if credentials are provided)
let storage: ReturnType<typeof getStorage> | null = null;

const hasFirebaseCredentials = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_STORAGE_BUCKET;

if (hasFirebaseCredentials) {
  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
    storage = getStorage();
    console.log('✅ Firebase Storage inicializado');
  } catch (error) {
    console.warn('⚠️  Erro ao inicializar Firebase Storage:', error);
  }
} else {
  console.warn('⚠️  Firebase credentials não configuradas. Usando URLs mockadas para desenvolvimento.');
}

export interface PresignedUrlOptions {
  contentType: string;
  expiresIn?: number;
}

/**
 * Gera URL de upload para Firebase Storage
 * Retorna uma URL que pode ser usada para upload direto
 */
export async function getPresignedUploadUrl(
  key: string,
  options: PresignedUrlOptions
): Promise<string> {
  if (!storage || !hasFirebaseCredentials) {
    // Retornar URL mockada para desenvolvimento
    const mockUrl = `https://mock-storage.local/photos/${key}?upload=true`;
    console.log(`📸 [Firebase Mock] Generated mock upload URL for key: ${key}`);
    return mockUrl;
  }

  try {
    const bucket = storage.bucket();
    const file = bucket.file(key);

    // Criar URL assinada para upload (válida por 1 hora por padrão)
    const [url] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + (options.expiresIn || 3600) * 1000,
      contentType: options.contentType,
    });

    return url;
  } catch (error) {
    console.error('Erro ao gerar presigned URL do Firebase:', error);
    throw error;
  }
}

/**
 * Gera URL de download para Firebase Storage
 */
export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  if (!storage || !hasFirebaseCredentials) {
    const mockUrl = `https://mock-storage.local/photos/${key}?download=true`;
    console.log(`📸 [Firebase Mock] Generated mock download URL for key: ${key}`);
    return mockUrl;
  }

  try {
    const bucket = storage.bucket();
    const file = bucket.file(key);

    // Criar URL assinada para download
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  } catch (error) {
    console.error('Erro ao gerar download URL do Firebase:', error);
    throw error;
  }
}

/**
 * Gera URL pública (se o arquivo for público)
 */
export function getPublicUrl(key: string): string {
  const bucket = process.env.FIREBASE_STORAGE_BUCKET || 'promo-gestao-photos';
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(key)}?alt=media`;
}

/**
 * Gera chave única para foto
 */
export function generatePhotoKey(visitId: string, type: string, extension: string = 'jpg'): string {
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `photos/${visitId}/${type}-${timestamp}-${uuid}.${extension}`;
}

/**
 * Deleta foto do Firebase Storage
 */
export async function deletePhoto(key: string): Promise<void> {
  if (!storage || !hasFirebaseCredentials) {
    console.log(`📸 [Firebase Mock] Would delete photo: ${key} (mock mode)`);
    return;
  }

  try {
    const bucket = storage.bucket();
    const file = bucket.file(key);
    await file.delete();
    console.log(`✅ Foto deletada: ${key}`);
  } catch (error) {
    console.error(`Erro ao deletar foto ${key}:`, error);
    throw error;
  }
}

