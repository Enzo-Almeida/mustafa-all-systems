import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Verificar se temos credenciais AWS configuradas
const hasAwsCredentials = 
  process.env.AWS_ACCESS_KEY_ID && 
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_ACCESS_KEY_ID.trim() !== '' &&
  process.env.AWS_SECRET_ACCESS_KEY.trim() !== '';

// Só inicializar S3 se tivermos credenciais
let s3: AWS.S3 | null = null;
if (hasAwsCredentials) {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
  });
} else {
  console.warn('⚠️  AWS credentials not configured. Using mock S3 URLs for development.');
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'promo-gestao-photos';

export interface PresignedUrlOptions {
  contentType: string;
  expiresIn?: number;
}

export async function getPresignedUploadUrl(
  key: string,
  options: PresignedUrlOptions
): Promise<string> {
  // Se não temos credenciais AWS, retornar URL mockada para desenvolvimento
  if (!hasAwsCredentials || !s3) {
    // Retornar uma URL mockada que simula um presigned URL
    // Em desenvolvimento, o upload não funcionará, mas o check-in pode prosseguir
    const mockUrl = `https://mock-s3.local/${BUCKET_NAME}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=mock&X-Amz-Date=${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z&X-Amz-Expires=${options.expiresIn || 3600}&X-Amz-SignedHeaders=host`;
    console.log(`📸 [S3 Mock] Generated mock presigned URL for key: ${key}`);
    return mockUrl;
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: options.contentType,
    Expires: options.expiresIn || 3600, // 1 hour default
  };

  return s3.getSignedUrlPromise('putObject', params);
}

export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  // Se não temos credenciais AWS, retornar URL mockada
  if (!hasAwsCredentials || !s3) {
    const mockUrl = `https://mock-s3.local/${BUCKET_NAME}/${key}?download=true`;
    console.log(`📸 [S3 Mock] Generated mock download URL for key: ${key}`);
    return mockUrl;
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expiresIn,
  };

  return s3.getSignedUrlPromise('getObject', params);
}

export function generatePhotoKey(visitId: string, type: string, extension: string = 'jpg'): string {
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `photos/${visitId}/${type}-${timestamp}-${uuid}.${extension}`;
}

export async function deletePhoto(key: string): Promise<void> {
  // Se não temos credenciais AWS, apenas logar (não fazer nada)
  if (!hasAwsCredentials || !s3) {
    console.log(`📸 [S3 Mock] Would delete photo: ${key} (mock mode)`);
    return;
  }

  await s3.deleteObject({
    Bucket: BUCKET_NAME,
    Key: key,
  }).promise();
}

