import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  console.log('🗑️  Banco de dados limpo');

  // Criar cursos
  const course1 = await prisma.course.create({
    data: {
      title: 'Desenvolvimento Web com Node.js',
      description: 'Aprenda a criar aplicações web escaláveis com Node.js',
      code: 'DEV-WEB-001',
      credits: 4,
      duration: 60,
      professor: 'Dr. João Silva',
      semester: '2026.1',
      status: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Banco de Dados com PostgreSQL',
      description: 'Domine o PostgreSQL e otimize suas queries',
      code: 'DB-POSTGRES-001',
      credits: 4,
      duration: 40,
      professor: 'Dra. Maria Santos',
      semester: '2026.1',
      status: true,
    },
  });

  console.log('✅ Cursos criados');

  // Criar módulos para o primeiro curso
  await prisma.module.create({
    data: {
      title: 'Introdução ao Node.js',
      description: 'Fundamentos e setup do ambiente',
      order: 1,
      duration: 90,
      content: 'Conceitos básicos de Node.js, instalação e configuração',
      videoUrl: 'https://example.com/video1',
      courseId: course1.id,
    },
  });

  await prisma.module.create({
    data: {
      title: 'Express.js Framework',
      description: 'Criando APIs REST com Express',
      order: 2,
      duration: 120,
      content: 'Roteamento, middlewares e controladores',
      videoUrl: 'https://example.com/video2',
      courseId: course1.id,
    },
  });

  await prisma.module.create({
    data: {
      title: 'Integração com Banco de Dados',
      description: 'Conectando aplicação com PostgreSQL',
      order: 3,
      duration: 150,
      content: 'Connection pools, queries e ORM',
      videoUrl: 'https://example.com/video3',
      courseId: course1.id,
    },
  });

  // Criar módulos para o segundo curso
  await prisma.module.create({
    data: {
      title: 'Introdução ao PostgreSQL',
      description: 'Instalação e conceitos fundamentais',
      order: 1,
      duration: 80,
      content: 'Tipo de dados, tabelas e constraints',
      videoUrl: 'https://example.com/video4',
      courseId: course2.id,
    },
  });

  await prisma.module.create({
    data: {
      title: 'Queries e Joins Avançados',
      description: 'Otimizando consultas complexas',
      order: 2,
      duration: 100,
      content: 'INNER JOIN, LEFT JOIN, subconsultas e performance',
      videoUrl: 'https://example.com/video5',
      courseId: course2.id,
    },
  });

  console.log('✅ Módulos criados');

  console.log('🌱 Seed completado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
