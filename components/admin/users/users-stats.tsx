'use client'

import { Users, CheckCircle, TrendingUp, UserPlus } from 'lucide-react'

interface UsersStatsProps {
  totalUsers: number
  usersWithReports: number
  usersThisMonth: number
}

export function UsersStats({ totalUsers, usersWithReports, usersThisMonth }: UsersStatsProps) {
  const completionRate = totalUsers > 0 ? Math.round((usersWithReports / totalUsers) * 100) : 0

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `${usersThisMonth} this month`
    },
    {
      title: 'Completed Assessments',
      value: usersWithReports,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: 'Users with reports'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: 'Overall completion'
    },
    {
      title: 'New This Month',
      value: usersThisMonth,
      icon: UserPlus,
      color: 'bg-orange-500',
      change: 'Recent signups'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
