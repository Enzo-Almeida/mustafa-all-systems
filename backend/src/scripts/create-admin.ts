import prisma from '../prisma/client';
import { hashPassword } from '../utils/password';
import { UserRole } from '../types';

async function main() {
  console.log('🔐 Criando usuário administrador...');

  const email = process.env.ADMIN_EMAIL || 'admin@promo.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Administrador';

  const hashedPassword = await hashPassword(password);

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    console.log('\n✅ Usuário administrador criado com sucesso!');
    console.log('\n📝 Credenciais:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Senha: ${password}`);
    console.log(`  Nome: ${admin.name}`);
    console.log(`  Role: ${admin.role}`);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

