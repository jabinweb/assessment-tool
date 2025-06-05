import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Users, Target, Clock, CheckCircle } from 'lucide-react';

interface SectionBreakdownProps {
  sectionStats: {
    aptitude: {
      total: number;
      completed: number;
      timeSpent: number;
    };
    personality: {
      total: number;
      completed: number;
      timeSpent: number;
    };
    interest: {
      total: number;
      completed: number;
      timeSpent: number;
    };
  };
}

export function SectionBreakdown({ sectionStats }: SectionBreakdownProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const sections = [
    {
      id: 'aptitude',
      title: 'Aptitude Assessment',
      description: 'Cognitive abilities and problem-solving',
      icon: Brain,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      stats: sectionStats.aptitude
    },
    {
      id: 'personality',
      title: 'Personality Profile',
      description: 'Behavioral traits and characteristics',
      icon: Users,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      stats: sectionStats.personality
    },
    {
      id: 'interest',
      title: 'Interest Exploration',
      description: 'Career interests and preferences',
      icon: Target,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      stats: sectionStats.interest
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Assessment Sections Completed
        </CardTitle>
        <CardDescription>
          Your performance across all assessment areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile-first responsive grid */}
        <div className="space-y-4 sm:space-y-6">
          {sections.map((section) => {
            const completionPercentage = getCompletionPercentage(
              section.stats.completed, 
              section.stats.total
            );
            const Icon = section.icon;

            return (
              <div 
                key={section.id}
                className={`p-4 rounded-lg border ${section.bgColor} ${section.borderColor}`}
              >
                {/* Header section - responsive flex */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white border ${section.borderColor}`}>
                      <Icon className={`h-5 w-5 ${section.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {section.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate sm:whitespace-normal">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Completion badge - responsive positioning */}
                  <div className="flex-shrink-0 self-start sm:self-center">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      completionPercentage === 100 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {completionPercentage === 100 ? 'Complete' : 'Partial'}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-xs font-bold text-gray-900">
                      {completionPercentage}%
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                {/* Stats section - responsive grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">Questions Completed</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {section.stats.completed}/{section.stats.total}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">Time Spent</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatTime(section.stats.timeSpent)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
