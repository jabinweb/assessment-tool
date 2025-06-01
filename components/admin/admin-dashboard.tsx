'use client';

import { Users, FileText, BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalAssessments: number;
  totalQuestions: number;
  usersThisMonth: number;
  reportsThisMonth: number;
  completionRate: number;
  userGrowth: number;
  activeUsersToday: number;
  averageAssessmentTime: number;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    reports: Array<{
      id: string;
      createdAt: Date;
    }>;
    _count: {
      answers: number;
    };
  }>;
  questionsBySection: Array<{
    section: string;
    _count: {
      id: number;
    };
    percentage?: number;
  }>;
  recentReports: Array<{
    id: string;
    createdAt: Date;
    user: {
      name: string | null;
      email: string;
      createdAt: Date;
    };
  }>;
  topPerformingUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    _count: {
      answers: number;
    };
  }>;
  recentActivity: {
    recentAnswers: Array<{
      id: string;
      createdAt: string; // Changed from Date to string
      user: {
        name: string | null;
        email: string;
      };
      question: {
        section: string;
      };
    }>;
    recentReports: Array<{
      id: string;
      createdAt: string; // Changed from Date to string
      user: {
        name: string | null;
        email: string;
      };
    }>;
  };
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `${stats.userGrowth >= 0 ? '+' : ''}${stats.userGrowth}% vs last month`,
      changeColor: stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      href: '/admin/users'
    },
    {
      title: 'Active Today',
      value: stats.activeUsersToday,
      icon: Clock,
      color: 'bg-green-500',
      change: 'Users active today',
      changeColor: 'text-green-600',
      href: '/admin/users'
    },
    {
      title: 'Assessment Reports',
      value: stats.totalAssessments,
      icon: FileText,
      color: 'bg-purple-500',
      change: `${stats.reportsThisMonth} this month`,
      changeColor: 'text-green-600',
      href: '/admin/reports'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'bg-orange-500',
      change: `Avg time: ${stats.averageAssessmentTime}min`,
      changeColor: 'text-blue-600',
      href: '/admin/users'
    }
  ];

  return (
    <div className="p-4 lg:p-0">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm lg:text-base text-gray-600">
          Real-time insights • Assessment management dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <div className="bg-white rounded-lg shadow-md p-3 lg:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs lg:text-sm ${stat.changeColor} truncate`}>{stat.change}</p>
                  </div>
                  <div className={`${stat.color} p-2 lg:p-3 rounded-full ml-2`}>
                    <Icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Recent Activity</h2>
          <div className="space-y-2 lg:space-y-3">
            {stats.recentActivity.recentAnswers.map((answer) => (
              <div key={answer.id} className="flex items-center text-xs lg:text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 lg:mr-3 flex-shrink-0"></div>
                <span className="text-gray-600 truncate flex-1">
                  <strong>{answer.user.name || 'User'}</strong> answered {answer.question.section} question
                </span>
                <span className="ml-2 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(answer.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
            {stats.recentActivity.recentReports.map((report) => (
              <div key={report.id} className="flex items-center text-xs lg:text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 lg:mr-3 flex-shrink-0"></div>
                <span className="text-gray-600 truncate flex-1">
                  <strong>{report.user.name || 'User'}</strong> completed assessment
                </span>
                <span className="ml-2 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Top Participants</h2>
          <div className="space-y-3 lg:space-y-4">
            {stats.topPerformingUsers.map((user, index) => (
              <div key={user.id} className="flex items-center">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm mr-2 lg:mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{user.name || 'Anonymous'}</p>
                  <p className="text-xs lg:text-sm text-gray-500">{user._count.answers} answers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions Distribution */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 lg:col-span-1 col-span-1">
          <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Question Distribution</h2>
          <div className="space-y-3 lg:space-y-4">
            {stats.questionsBySection.map((section) => (
              <div key={section.section}>
                <div className="flex justify-between mb-1 lg:mb-2">
                  <span className="font-medium text-gray-900 capitalize text-sm lg:text-base">{section.section}</span>
                  <span className="text-xs lg:text-sm text-gray-600">{section._count.id}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                  <div 
                    className={`h-1.5 lg:h-2 rounded-full ${
                      section.section === 'aptitude' ? 'bg-blue-500' :
                      section.section === 'personality' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${section.percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Users - Enhanced */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="text-lg lg:text-xl font-semibold">Recent Users</h2>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {stats.recentUsers.map((user) => (
              <Link key={user.id} href={`/admin/users/${user.id}`}>
                <div className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-xs lg:text-sm">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm lg:text-base truncate">{user.name || 'Unknown'}</p>
                      <p className="text-xs lg:text-sm text-gray-500">{user._count.answers} answers</p>
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs rounded-full ${
                      user.reports.length > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.reports.length > 0 ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Reports - Enhanced */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h2 className="text-lg lg:text-xl font-semibold">Recent Reports</h2>
            <Link href="/admin/reports" className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {stats.recentReports.map((report) => (
              <Link key={report.id} href={`/admin/reports/${report.id}`}>
                <div className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                    </div>
                    <div className="ml-2 lg:ml-3 min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                        {report.user.name || 'Unknown User'}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        Member since {new Date(report.user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <span className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
