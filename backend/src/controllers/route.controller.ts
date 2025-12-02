import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma/client';

const createRouteSchema = z.object({
  storeIds: z.array(z.string().uuid()).min(1, 'Selecione pelo menos uma loja'),
  orders: z.array(z.number().int().min(0)).optional(), // Ordem opcional
});

const updateRouteSchema = z.object({
  storeIds: z.array(z.string().uuid()).min(1, 'Selecione pelo menos uma loja'),
  orders: z.array(z.number().int().min(0)).optional(),
});

// Criar ou atualizar rota de um promotor
export async function setPromoterRoute(req: AuthRequest, res: Response) {
  try {
    const { promoterId } = req.params;
    
    // Validar UUID do promoterId
    if (!z.string().uuid().safeParse(promoterId).success) {
      return res.status(400).json({ message: 'ID do promotor inválido' });
    }

    const { storeIds, orders } = createRouteSchema.parse(req.body);

    // Verificar se o promotor existe
    const promoter = await prisma.user.findUnique({
      where: { id: promoterId },
    });

    if (!promoter || promoter.role !== 'PROMOTER') {
      return res.status(404).json({ message: 'Promotor não encontrado' });
    }

    // Verificar se todas as lojas existem
    const stores = await prisma.store.findMany({
      where: { id: { in: storeIds } },
    });

    if (stores.length !== storeIds.length) {
      return res.status(400).json({ message: 'Uma ou mais lojas não foram encontradas' });
    }

    // Deletar atribuições antigas do promotor
    await prisma.routeAssignment.deleteMany({
      where: { promoterId },
    });

    // Criar novas atribuições
    const assignments = await Promise.all(
      storeIds.map((storeId, index) =>
        prisma.routeAssignment.create({
          data: {
            promoterId,
            storeId,
            order: orders?.[index] ?? index,
            isActive: true,
          },
          include: {
            store: true,
          },
        })
      )
    );

    res.json({
      message: 'Rota configurada com sucesso',
      route: {
        promoter: {
          id: promoter.id,
          name: promoter.name,
          email: promoter.email,
        },
        stores: assignments.map((a) => ({
          id: a.store.id,
          name: a.store.name,
          address: a.store.address,
          order: a.order,
        })),
        totalStores: assignments.length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Set promoter route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Obter rota de um promotor
export async function getPromoterRoute(req: AuthRequest, res: Response) {
  try {
    const { promoterId } = req.params;

    const promoter = await prisma.user.findUnique({
      where: { id: promoterId },
    });

    if (!promoter || promoter.role !== 'PROMOTER') {
      return res.status(404).json({ message: 'Promotor não encontrado' });
    }

    const assignments = await prisma.routeAssignment.findMany({
      where: {
        promoterId,
        isActive: true,
      },
      include: {
        store: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    res.json({
      promoter: {
        id: promoter.id,
        name: promoter.name,
        email: promoter.email,
      },
      route: assignments.map((a: any) => ({
        id: a.id,
        store: {
          id: a.store.id,
          name: a.store.name,
          address: a.store.address,
          latitude: a.store.latitude,
          longitude: a.store.longitude,
        },
        order: a.order,
        isActive: a.isActive,
      })),
      totalStores: assignments.length,
    });
  } catch (error) {
    console.error('Get promoter route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Listar todas as rotas (para supervisor)
export async function getAllRoutes(req: AuthRequest, res: Response) {
  try {
    const promoters = await prisma.user.findMany({
      where: { role: 'PROMOTER' },
      include: {
        routeAssignments: {
          where: { isActive: true },
          include: {
            store: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    const routes = promoters.map((promoter: any) => ({
      promoter: {
        id: promoter.id,
        name: promoter.name,
        email: promoter.email,
      },
      stores: promoter.routeAssignments.map((a: any) => ({
        id: a.store.id,
        name: a.store.name,
        address: a.store.address,
        order: a.order,
      })),
      totalStores: promoter.routeAssignments.length,
    }));

    res.json({ routes });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Obter lojas disponíveis para atribuição
export async function getAvailableStores(req: AuthRequest, res: Response) {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ stores });
  } catch (error) {
    console.error('Get available stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

