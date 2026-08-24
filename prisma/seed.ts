import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Limpiar datos existentes (opcional)
  await prisma.session.deleteMany();
  await prisma.drunkModeSession.deleteMany();
  await prisma.safeContact.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Hash de contraseñas
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const hashedPin = await bcrypt.hash('123456', 10); // PIN de 6 dígitos

  // Crear usuario de prueba
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      phone: '+521234567890',
      passwordHash: hashedPassword,
      fullName: 'Usuario Test',
      pinCode: hashedPin,
      isActive: true,
    },
  });

  console.log(`✅ Created user: ${user.email} (ID: ${user.id})`);

  // Crear contactos de confianza
  const contact1 = await prisma.safeContact.create({
    data: {
      userId: user.id,
      name: 'María González',
      phone: '+521234567891',
      email: 'maria@example.com',
      priority: 0,
      isEnabled: true,
    },
  });

  const contact2 = await prisma.safeContact.create({
    data: {
      userId: user.id,
      name: 'Juan Pérez',
      phone: '+521234567892',
      email: 'juan@example.com',
      priority: 1,
      isEnabled: true,
    },
  });

  console.log(`✅ Created safe contacts: ${contact1.name}, ${contact2.name}`);

  // Crear una sesión de Drunk Mode de ejemplo
  const drunkSession = await prisma.drunkModeSession.create({
    data: {
      userId: user.id,
      activatedAt: new Date(),
      deactivatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos después
      activationType: 'manual',
      deactivationType: 'pin',
      isActive: false,
      metadata: { location: 'home', confidence: 0.9 },
    },
  });

  console.log(`✅ Created drunk mode session (ID: ${drunkSession.id})`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Test credentials:');
  console.log('   Email: test@example.com');
  console.log('   Password: Password123!');
  console.log('   PIN: 123456'); // PIN de 6 dígitos
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
