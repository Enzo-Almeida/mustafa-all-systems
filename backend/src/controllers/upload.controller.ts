import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { getPresignedUploadUrl, generatePhotoKey } from '../services/s3.service';
import { PhotoType } from '../../../shared/types';

const presignedUrlSchema = z.object({
  visitId: z.string().uuid(),
  type: z.nativeEnum(PhotoType),
  contentType: z.string().default('image/jpeg'),
  extension: z.string().default('jpg'),
});

export async function getPresignedUrl(req: AuthRequest, res: Response) {
  try {
    const { visitId, type, contentType, extension } = presignedUrlSchema.parse(req.body);

    // Verify visit exists and belongs to the user (if promoter)
    // This will be implemented when we add visit controllers

    const key = generatePhotoKey(visitId, type, extension);
    const presignedUrl = await getPresignedUploadUrl(key, { contentType });

    // Se não temos credenciais AWS, usar URL mockada
    const bucketName = process.env.AWS_S3_BUCKET || 'promo-gestao-photos';
    const region = process.env.AWS_REGION || 'us-east-1';
    const hasAwsCredentials = 
      process.env.AWS_ACCESS_KEY_ID && 
      process.env.AWS_SECRET_ACCESS_KEY &&
      process.env.AWS_ACCESS_KEY_ID.trim() !== '' &&
      process.env.AWS_SECRET_ACCESS_KEY.trim() !== '';

    const finalUrl = hasAwsCredentials
      ? `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
      : `https://mock-s3.local/${bucketName}/${key}`;

    res.json({
      presignedUrl,
      key,
      url: finalUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error('Presigned URL error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

