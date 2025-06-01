'use client'

import { FileText, TrendingUp, Clock, Users } from 'lucide-react'

interface ReportsStatsProps {
  totalReports: number
  reportsThisMonth: number
  averageCompletionTime: number
}

export function ReportsStats({ totalReports, reportsThisMonth, averageCompletionTime }: ReportsStatsProps) {
  const stats = [
    {
      title: 'Total Reports',
      value: totalReports,
      icon: FileText,
      color: 'bg-blue-500',
      change: `${reportsThisMonth} this month`
    },
    {
      title: 'This Month',
      value: reportsThisMonth,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: 'New reports'
    },
    {
      title: 'Avg. Completion',
      value: `${averageCompletionTime}m`,
      icon: Clock,
      color: 'bg-orange-500',
      change: 'Average time'
    },
    {
      title: 'Completion Rate',
      value: '85%',
      icon: Users,
      color: 'bg-purple-500',
      change: 'Of all users'
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
