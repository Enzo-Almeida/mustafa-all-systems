import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma/client';

const createStoreSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

const updateStoreSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function createStore(req: AuthRequest, res: Response) {
  try {
    const data = createStoreSchema.parse(req.body);

    const store = await prisma.store.create({
      data,
    });

    res.status(201).json({ store });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
    }
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateStore(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const data = updateStoreSchema.parse(req.body);

    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada' });
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data,
    });

    res.json({ store: updatedStore });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
    }
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteStore(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada' });
    }

    await prisma.store.delete({
      where: { id },
    });

    res.json({ message: 'Loja deletada com sucesso' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllStores(req: AuthRequest, res: Response) {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ stores });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getStore(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      return res.status(404).json({ message: 'Loja não encontrada' });
    }

    res.json({ store });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

