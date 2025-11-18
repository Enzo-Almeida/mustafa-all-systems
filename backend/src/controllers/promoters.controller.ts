import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma/client';
import { UserRole } from '../../../shared/types';

export async function getPromoters(req: AuthRequest, res: Response) {
  try {
    const promoters = await prisma.user.findMany({
      where: {
        role: UserRole.PROMOTER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      promoters,
    });
  } catch (error) {
    console.error('Get promoters error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

