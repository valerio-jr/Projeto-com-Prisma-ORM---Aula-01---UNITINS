import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========== CREATE ==========

export async function createCourse(data: {
  title: string;
  code: string;
  description?: string;
  duration: number;
  professor: string;
  semester: string;
}) {
  return await prisma.course.create({
    data: {
      ...data,
      credits: 4,
      status: true,
    },
  });
}

export async function createModule(data: {
  title: string;
  courseId: string;
  order: number;
  duration: number;
  description?: string;
  content?: string;
  videoUrl?: string;
}) {
  return await prisma.module.create({
    data,
  });
}

// ========== READ ==========

export async function getAllCourses() {
  return await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getCourseById(id: string) {
  return await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });
}

export async function getCourseByCode(code: string) {
  return await prisma.course.findUnique({
    where: { code },
    include: {
      modules: true,
    },
  });
}

export async function getActiveCoursesWithCredits(credits: number) {
  return await prisma.course.findMany({
    where: {
      AND: [
        { status: true },
        { credits },
      ],
    },
    include: {
      modules: true,
    },
    orderBy: {
      title: 'asc',
    },
  });
}

export async function getModulesByDuration(minDuration: number, maxDuration: number) {
  return await prisma.module.findMany({
    where: {
      duration: {
        gte: minDuration,
        lte: maxDuration,
      },
    },
    orderBy: {
      duration: 'desc',
    },
  });
}

// ========== UPDATE ==========

export async function updateCourse(
  id: string,
  data: {
    title?: string;
    description?: string;
    credits?: number;
    status?: boolean;
  }
) {
  return await prisma.course.update({
    where: { id },
    data,
    include: {
      modules: true,
    },
  });
}

export async function updateModule(
  id: string,
  data: {
    title?: string;
    description?: string;
    duration?: number;
    content?: string;
    videoUrl?: string;
  }
) {
  return await prisma.module.update({
    where: { id },
    data,
  });
}

// ========== DELETE ==========

export async function deleteCourse(id: string) {
  return await prisma.course.delete({
    where: { id },
  });
}

export async function deleteModule(id: string) {
  return await prisma.module.delete({
    where: { id },
  });
}

// ========== AGGREGATION & STATISTICS ==========

export async function getCourseStatistics() {
  return await prisma.course.aggregate({
    _count: true,
    _sum: {
      duration: true,
      credits: true,
    },
    _avg: {
      credits: true,
      duration: true,
    },
  });
}

export async function getTotalModulesDuration() {
  return await prisma.module.aggregate({
    _sum: {
      duration: true,
    },
    _avg: {
      duration: true,
    },
    _count: true,
  });
}

export async function getModulesCountByCourse() {
  return await prisma.course.findMany({
    select: {
      title: true,
      code: true,
      _count: {
        select: {
          modules: true,
        },
      },
    },
  });
}

// ========== PAGINATION ==========

export async function getCoursesWithPagination(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      skip,
      take: pageSize,
      include: {
        modules: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.course.count(),
  ]);

  return {
    data: courses,
    pagination: {
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
    },
  };
}

// ========== SEARCH ==========

export async function searchCourses(searchTerm: string) {
  return await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { code: { contains: searchTerm, mode: 'insensitive' } },
        { professor: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      modules: true,
    },
  });
}

export async function searchModules(searchTerm: string) {
  return await prisma.module.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      course: true,
    },
  });
}

// ========== TRANSACTIONS ==========

export async function duplicateCourseWithModules(courseId: string) {
  return await prisma.$transaction(async (tx) => {
    const originalCourse = await tx.course.findUnique({
      where: { id: courseId },
      include: { modules: true },
    });

    if (!originalCourse) {
      throw new Error('Curso não encontrado');
    }

    const newCourse = await tx.course.create({
      data: {
        title: `${originalCourse.title} (Cópia)`,
        description: originalCourse.description,
        code: `${originalCourse.code}-COPY`,
        credits: originalCourse.credits,
        duration: originalCourse.duration,
        professor: originalCourse.professor,
        semester: originalCourse.semester,
        status: originalCourse.status,
      },
    });

    const modules = await tx.module.createMany({
      data: originalCourse.modules.map((module) => ({
        title: module.title,
        description: module.description,
        order: module.order,
        duration: module.duration,
        content: module.content,
        videoUrl: module.videoUrl,
        courseId: newCourse.id,
      })),
    });

    return {
      course: newCourse,
      modulesCount: modules.count,
    };
  });
}
