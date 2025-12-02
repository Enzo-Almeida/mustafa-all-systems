import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { hashPassword } from '../utils/password';
import { UserRole } from '../types';

/**
 * Endpoint temporário para executar seed do banco de dados
 * ⚠️ REMOVER EM PRODUÇÃO ou proteger com autenticação forte
 */
export async function seedDatabase(req: Request, res: Response) {
  try {
    // ⚠️ SEGURANÇA: Em produção, adicione uma verificação de secret
    const secret = req.headers['x-seed-secret'] || req.body.secret;
    const expectedSecret = process.env.SEED_SECRET || 'temporary-seed-secret-change-me';
    
    if (secret !== expectedSecret) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('🌱 Starting database seed...');

    // Create test users
    const supervisorPassword = await hashPassword('senha123');
    const promoterPassword = await hashPassword('senha123');

    // Create supervisor
    const supervisor = await prisma.user.upsert({
      where: { email: 'supervisor@teste.com' },
      update: {},
      create: {
        email: 'supervisor@teste.com',
        name: 'Supervisor Teste',
        password: supervisorPassword,
        role: UserRole.SUPERVISOR,
      },
    });

    console.log('✅ Supervisor created:', supervisor.email);

    // Create promoters
    const promoters = await Promise.all([
      prisma.user.upsert({
        where: { email: 'promotor1@teste.com' },
        update: {},
        create: {
          email: 'promotor1@teste.com',
          name: 'Promotor 1',
          password: promoterPassword,
          role: UserRole.PROMOTER,
        },
      }),
      prisma.user.upsert({
        where: { email: 'promotor2@teste.com' },
        update: {},
        create: {
          email: 'promotor2@teste.com',
          name: 'Promotor 2',
          password: promoterPassword,
          role: UserRole.PROMOTER,
        },
      }),
    ]);

    console.log('✅ Promoters created:', promoters.map(p => p.email));

    // Create test stores
    let store1 = await prisma.store.findFirst({
      where: { name: 'Loja ABC' },
    });

    if (!store1) {
      store1 = await prisma.store.create({
        data: {
          name: 'Loja ABC',
          address: 'Rua Teste, 123 - São Paulo, SP',
          latitude: -23.5505,
          longitude: -46.6333,
        },
      });
    }

    let store2 = await prisma.store.findFirst({
      where: { name: 'Loja XYZ' },
    });

    if (!store2) {
      store2 = await prisma.store.create({
        data: {
          name: 'Loja XYZ',
          address: 'Av. Exemplo, 456 - São Paulo, SP',
          latitude: -23.5632,
          longitude: -46.6541,
        },
      });
    }

    console.log('✅ Stores created');

    // Create photo quotas
    await Promise.all(
      promoters.map(promoter =>
        prisma.photoQuota.upsert({
          where: { promoterId: promoter.id },
          update: {},
          create: {
            promoterId: promoter.id,
            expectedPhotos: 10,
          },
        })
      )
    );

    console.log('✅ Photo quotas created');

    res.json({
      success: true,
      message: 'Database seeded successfully',
      users: {
        supervisor: supervisor.email,
        promoters: promoters.map(p => p.email),
      },
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

