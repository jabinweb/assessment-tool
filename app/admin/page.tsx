import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const isUserAdmin = await isAdmin(session.user.email);
  
  if (!isUserAdmin) {
    redirect('/?error=unauthorized&message=Access denied');
  }

  // Fetch dashboard statistics
  const stats = await getDashboardStats();

  return <AdminDashboard stats={stats} />;
}

async function isAdmin(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true }
  });
  return user?.role === 'admin';
}

async function getDashboardStats() {
  const [
    totalUsers, 
    totalAssessments, 
    totalQuestions, 
    recentUsers,
    usersThisMonth,
    reportsThisMonth,
    completionRate,
    questionsBySection,
    recentReports,
    averageAssessmentTime,
    topPerformingUsers
  ] = await Promise.all([
    prisma.user.count(),
    prisma.report.count(),
    prisma.question.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        reports: {
          select: {
            id: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    }),
    // Users registered this month
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    // Reports generated this month
    prisma.report.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    calculateCompletionRate(),
    prisma.question.groupBy({
      by: ['section'],
      _count: {
        id: true
      },
      orderBy: {
        section: 'asc'
      }
    }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    }),
    calculateAverageAssessmentTime(),
    getTopPerformingUsers()
  ]);

  // Calculate growth percentages
  const lastMonthUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  });

  const userGrowth = lastMonthUsers > 0 ? 
    Math.round(((usersThisMonth - lastMonthUsers) / lastMonthUsers) * 100) : 0;

  return {
    totalUsers,
    totalAssessments,
    totalQuestions,
    recentUsers,
    usersThisMonth,
    reportsThisMonth,
    completionRate,
    questionsBySection,
    recentReports,
    averageAssessmentTime,
    topPerformingUsers,
    userGrowth,
    // Dynamic calculations
    activeUsersToday: await getActiveUsersToday(),
    questionsPerSection: calculateQuestionsDistribution(questionsBySection),
    recentActivity: await getRecentActivity()
  };
}

async function calculateCompletionRate() {
  const [usersWithReports, totalUsers] = await Promise.all([
    prisma.user.count({
      where: {
        reports: {
          some: {}
        }
      }
    }),
    prisma.user.count()
  ]);
  
  return totalUsers > 0 ? Math.round((usersWithReports / totalUsers) * 100) : 0;
}

async function calculateAverageAssessmentTime() {
  const usersWithReports = await prisma.report.findMany({
    include: {
      user: {
        select: {
          createdAt: true
        }
      }
    }
  });

  if (usersWithReports.length === 0) return 0;

  const totalTime = usersWithReports.reduce((acc, report) => {
    const userCreated = new Date(report.user.createdAt);
    const reportCreated = new Date(report.createdAt);
    const timeDiff = reportCreated.getTime() - userCreated.getTime();
    return acc + timeDiff;
  }, 0);

  // Return average time in minutes
  return Math.round(totalTime / (usersWithReports.length * 1000 * 60));
}

async function getTopPerformingUsers() {
  return await prisma.user.findMany({
    take: 3,
    where: {
      reports: {
        some: {}
      }
    },
    include: {
      reports: {
        select: {
          careerMatches: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          answers: true
        }
      }
    },
    orderBy: {
      answers: {
        _count: 'desc'
      }
    }
  });
}

async function getActiveUsersToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return await prisma.user.count({
    where: {
      OR: [
        {
          answers: {
            some: {
              createdAt: {
                gte: today
              }
            }
          }
        },
        {
          reports: {
            some: {
              createdAt: {
                gte: today
              }
            }
          }
        }
      ]
    }
  });
}

function calculateQuestionsDistribution(questionsBySection: any[]) {
  const total = questionsBySection.reduce((acc, section) => acc + section._count.id, 0);
  
  return questionsBySection.map(section => ({
    ...section,
    percentage: total > 0 ? Math.round((section._count.id / total) * 100) : 0
  }));
}

async function getRecentActivity() {
  const [recentAnswers, recentReports] = await Promise.all([
    prisma.answer.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        question: {
          select: {
            section: true
          }
        }
      }
    }),
    prisma.report.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  ]);

  // Serialize dates to prevent hydration errors
  return {
    recentAnswers: recentAnswers.map(answer => ({
      ...answer,
      createdAt: answer.createdAt.toISOString()
    })),
    recentReports: recentReports.map(report => ({
      ...report,
      createdAt: report.createdAt.toISOString()
    }))
  };
}
