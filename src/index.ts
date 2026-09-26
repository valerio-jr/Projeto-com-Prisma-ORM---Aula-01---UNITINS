import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📚 Exemplo de uso do Prisma ORM\n');

  try {
    // 1. Buscar todos os cursos
    console.log('1️⃣  Listando todos os cursos:');
    const courses = await prisma.course.findMany({
      include: {
        modules: true,
      },
    });
    console.log(JSON.stringify(courses, null, 2));
    console.log('\n');

    // 2. Buscar um curso específico
    console.log('2️⃣  Buscando curso por código:');
    const course = await prisma.course.findUnique({
      where: { code: 'DEV-WEB-001' },
      include: {
        modules: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    console.log(JSON.stringify(course, null, 2));
    console.log('\n');

    // 3. Contar módulos por curso
    console.log('3️⃣  Contando módulos:');
    const moduleCount = await prisma.module.count({
      where: {
        courseId: course?.id,
      },
    });
    console.log(`Total de módulos: ${moduleCount}`);
    console.log('\n');

    // 4. Buscar módulos ordenados
    console.log('4️⃣  Módulos ordenados por duração (decrescente):');
    const modules = await prisma.module.findMany({
      orderBy: {
        duration: 'desc',
      },
      take: 5,
    });
    console.log(JSON.stringify(modules, null, 2));
    console.log('\n');

    // 5. Agregação - total de horas de cursos
    console.log('5️⃣  Estatísticas de cursos:');
    const stats = await prisma.course.aggregate({
      _sum: {
        duration: true,
        credits: true,
      },
      _avg: {
        credits: true,
      },
      _count: true,
    });
    console.log('Estatísticas:', {
      totalCursos: stats._count,
      totalHorasAula: stats._sum.duration,
      totalCreditos: stats._sum.credits,
      mediaCreditos: stats._avg.credits,
    });
    console.log('\n');

    // 6. Busca com filtros
    console.log('6️⃣  Buscando cursos ativos com 4 créditos:');
    const filteredCourses = await prisma.course.findMany({
      where: {
        AND: [{ status: true }, { credits: 4 }],
      },
      select: {
        id: true,
        title: true,
        professor: true,
        credits: true,
      },
    });
    console.log(JSON.stringify(filteredCourses, null, 2));
    console.log('\n');

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
