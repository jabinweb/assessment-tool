'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, TrendingUp, BookOpen, Award, Target, Activity, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatTimeMinutes } from '@/lib/time-utils';

interface DashboardContentEnhancedProps {
  user: any;
  dashboardData: {
    analytics: {
      totalAssessments: number;
      completedAssessments: number;
      averageScore: number;
      streakDays: number;
      lastActivity: Date | null;
      totalTimeSpent: number;
      aptitudeAverage: number;
      personalityAverage: number;
      interestAverage: number;
      hasActiveSession: boolean;
      currentSessionStatus: string | null;
    };
    recentActivities: Array<{
      id: string;
      title: string;
      type: string;
      date: Date;
      audience?: string;
      score?: number | null;
      icon: string;
    }>;
    upcomingDeadlines: Array<{
      id: string;
      title: string;
      targetDate: Date;
      priority: string;
      progress?: any;
      timeSpent?: number;
    }>;
    recommendations: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      estimatedTime: string;
      actionUrl: string;
      reason?: string; // Add reason field for debugging/transparency
    }>;
    assessmentSessions: Array<any>;
  };
}

export function DashboardContentEnhanced({ user, dashboardData }: DashboardContentEnhancedProps) {
  const [mounted, setMounted] = React.useState(false);
  const { analytics, recentActivities, upcomingDeadlines, recommendations } = dashboardData;

  // Fix SSR hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date || !mounted) return 'Never';
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(date));
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (!mounted || !totalSeconds || totalSeconds <= 0) return '0m';
    return formatTimeMinutes(totalSeconds);
  };

  // Calculate total time with better estimation
  const getTotalTimeSpent = () => {
    if (!analytics || !mounted) return 0;
    
    let totalTime = analytics.totalTimeSpent || 0;
    
    // If no time recorded but has assessments, estimate
    if (totalTime === 0 && analytics.totalAssessments > 0) {
      // Estimate based on number of assessments
      // Assume each assessment takes about 15-20 minutes
      totalTime = analytics.totalAssessments * 900; // 15 minutes in seconds
    }
    
    return totalTime;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getProfileCompleteness = () => {
    if (!user) return 0;
    let score = 50; // Base score for having an account
    if (user.name) score += 10;
    if (user.age) score += 10;
    if (user.gradeLevel) score += 10;
    if (user.schoolName) score += 10;
    if (user.targetAudience) score += 10;
    return Math.min(score, 100);
  };

  const getAssessmentStatus = () => {
    if (!analytics || !mounted) return 'not_started';
    
    const hasCompletedAssessments = analytics.completedAssessments > 0;
    const hasActiveSession = analytics.hasActiveSession;
    const currentSessionStatus = analytics.currentSessionStatus;
    
    let hasRecentActivity = false;
    try {
      hasRecentActivity = !!(analytics.lastActivity && 
        (Date.now() - new Date(analytics.lastActivity).getTime()) < (24 * 60 * 60 * 1000));
    } catch (error) {
      hasRecentActivity = false;
    }

    if (hasCompletedAssessments && !hasActiveSession) {
      return 'completed';
    } else if (hasActiveSession) {
      if (currentSessionStatus === 'in_progress' && hasRecentActivity) {
        return 'actively_working';
      } else if (currentSessionStatus === 'in_progress') {
        return 'session_stalled';
      } else {
        return 'session_started';
      }
    } else if (analytics.totalAssessments > 0) {
      return 'previous_sessions'; // Had sessions before but none active
    } else {
      return 'not_started';
    }
  };

  const assessmentStatus = getAssessmentStatus();

  const getStatusBasedRecommendation = () => {
    if (!analytics || !mounted) return null;
    
    if (assessmentStatus === 'session_stalled') {
      return {
        title: 'Continue Your Assessment',
        message: 'You have an assessment in progress. Continue where you left off to get your personalized career insights.',
        action: 'Continue Assessment',
        url: '/assessment/continue',
        priority: 'high'
      };
    } else if (assessmentStatus === 'session_started') {
      return {
        title: 'Complete Your Assessment',
        message: 'You started an assessment. Continue to unlock your career recommendations.',
        action: 'Continue Assessment',
        url: '/assessment/continue',
        priority: 'high'
      };
    } else if (assessmentStatus === 'actively_working') {
      return {
        title: 'Keep Going!',
        message: 'You\'re making great progress. Continue your assessment to unlock your career recommendations.',
        action: 'Continue Assessment',
        url: '/assessment/continue',
        priority: 'medium'
      };
    } else if (assessmentStatus === 'previous_sessions') {
      return {
        title: 'Start a New Assessment',
        message: 'Ready for a fresh assessment? Start a new one to get updated career insights.',
        action: 'Start New Assessment',
        url: '/assessment',
        priority: 'medium'
      };
    }
    return null;
  };

  const statusRecommendation = getStatusBasedRecommendation();

  // Show loading state until mounted
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-muted-foreground text-lg">
          Track your career discovery journey and explore new opportunities.
        </p>
      </div>

      {/* Status-based Alert */}
      {statusRecommendation && (
        <div className={`p-4 rounded-lg border ${
          statusRecommendation.priority === 'high' 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className={`font-medium ${
                statusRecommendation.priority === 'high' ? 'text-yellow-900' : 'text-blue-900'
              }`}>
                {statusRecommendation.title}
              </h3>
              <p className={`text-sm mt-1 ${
                statusRecommendation.priority === 'high' ? 'text-yellow-700' : 'text-blue-700'
              }`}>
                {statusRecommendation.message}
              </p>
            </div>
            <Button asChild variant={statusRecommendation.priority === 'high' ? 'default' : 'outline'} className="shrink-0">
              <Link href={statusRecommendation.url}>{statusRecommendation.action}</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild size="lg" className="h-20 justify-start p-6">
          <Link href={assessmentStatus === 'not_started' ? '/assessment' : '/assessment/continue'}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-left min-w-0">
                <div className="font-semibold truncate">
                  {assessmentStatus === 'not_started' ? 'Start Assessment' : 
                   assessmentStatus === 'actively_working' || assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started' ? 'Continue Assessment' : 
                   'View Results'}
                </div>
                <div className="text-sm opacity-80 truncate">
                  {assessmentStatus === 'not_started' ? 'Discover your ideal career path' : 
                   assessmentStatus === 'actively_working' || assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started' ? 'Complete your ongoing assessment' : 
                   'See your career matches'}
                </div>
              </div>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-20 justify-start p-6">
          <Link href="/profile">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left min-w-0">
                <div className="font-semibold truncate">Profile</div>
                <div className="text-sm text-muted-foreground truncate">Update your personal information</div>
              </div>
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="h-20 justify-start p-6">
          <Link href="/notifications">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-left min-w-0">
                <div className="font-semibold truncate">Notifications</div>
                <div className="text-sm text-muted-foreground truncate">Check your latest updates</div>
              </div>
            </div>
          </Link>
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessment History</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalAssessments || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.hasActiveSession ? 'Current session active' : 
               analytics?.completedAssessments > 0 ? `${analytics.completedAssessments} completed` : 'Ready to start'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(getTotalTimeSpent())}</div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.totalAssessments || 0) > 0 ? 'Exploring your potential' : 'Ready to start learning'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.streakDays || 0} days</div>
            <p className="text-xs text-muted-foreground">
              {(analytics?.streakDays || 0) > 0 ? 'Keep the momentum going!' : 'Start your streak today!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessmentStatus === 'completed' ? 'Completed' :
               assessmentStatus === 'actively_working' ? 'In Progress' :
               assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started' ? 'Pending' :
               'Not Started'}
            </div>
            <p className="text-xs text-muted-foreground">
              {assessmentStatus === 'completed' ? `${analytics?.averageScore || 0}% average score` :
               assessmentStatus === 'actively_working' ? 'Keep going!' :
               assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started' ? 'Resume to complete' :
               'Take your first assessment'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assessment Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Progress</CardTitle>
            <CardDescription>
              {assessmentStatus === 'not_started' && "Ready to start your journey?"} 
              {(assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started') && `You have ${analytics?.totalAssessments || 0} incomplete assessment session${(analytics?.totalAssessments || 0) > 1 ? 's' : ''}`}
              {assessmentStatus === 'actively_working' && `Great progress! Continue your assessment to unlock insights`}
              {assessmentStatus === 'previous_sessions' && `Continue your assessment to get personalized career insights`}
              {assessmentStatus === 'completed' && `You've completed ${analytics?.completedAssessments || 0} assessment${(analytics?.completedAssessments || 0) > 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started') ? (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-amber-500" />
                  <h3 className="text-lg font-semibold mb-2">Complete Your Assessment</h3>
                  <p className="text-muted-foreground mb-4">
                    You have {analytics?.totalAssessments || 0} assessment session{(analytics?.totalAssessments || 0) > 1 ? 's' : ''} waiting to be completed. 
                    Finish at least one to get your personalized career recommendations!
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button asChild>
                      <Link href="/assessment/continue">
                        Continue Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/assessment">Start Fresh</Link>
                    </Button>
                  </div>
                </div>
                
                {/* Progress Indicator */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="font-medium text-amber-900">Assessment Progress</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Total time invested: {formatTime(getTotalTimeSpent())} across {analytics?.totalAssessments || 0} session{(analytics?.totalAssessments || 0) > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Complete one session to unlock your career insights and recommendations
                  </p>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="font-medium mb-3">Recent Activities</h4>
                  {recentActivities && recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <span className="text-lg">{activity.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                          </div>
                          {activity.score && (
                            <Badge variant="secondary">{activity.score}%</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No recent activities</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Take our comprehensive career assessment to discover your ideal career path.</h3>
                <Button asChild size="lg" className="mt-4">
                  <Link href="/assessment">
                    Start Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Profile Strength:</span>
                <span className="text-green-600 font-medium">
                  {getProfileCompleteness() >= 90 ? 'Excellent' : 
                   getProfileCompleteness() >= 70 ? 'Good' : 
                   getProfileCompleteness() >= 50 ? 'Average' : 'Needs Work'}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span></span>
                <span className="font-medium">({getProfileCompleteness()}%)</span>
              </div>
              <Progress value={getProfileCompleteness()} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Assessment History:</span>
                <span>{analytics?.totalAssessments || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reports Generated:</span>
                <span className={(analytics?.completedAssessments || 0) === 0 ? 'text-amber-600 font-medium' : ''}>
                  {analytics?.completedAssessments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Current Session:</span>
                <span className={analytics?.hasActiveSession ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                  {analytics?.hasActiveSession ? 'Active' : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time Invested:</span>
                <span>{formatTime(getTotalTimeSpent())}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Created:</span>
                <span>{formatDate(user?.createdAt)}</span>
              </div>
              {user?.gradeLevel && (
                <div className="flex justify-between">
                  <span className="font-medium">Grade Level:</span>
                  <span>{user.gradeLevel}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">School:</span>
                <span>{user?.schoolName || 'N/A'}</span>
              </div>
            </div>

            {/* Status-specific tips */}
            {(assessmentStatus === 'session_stalled' || assessmentStatus === 'session_started') && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> You have an active assessment session. Continue to complete it and receive your personalized career report.
                </p>
              </div>
            )}

            {getProfileCompleteness() >= 90 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Excellent! Your profile is complete and optimized for the most accurate career recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines - Show if there are pending sessions */}
      {upcomingDeadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Pending Assessments
            </CardTitle>
            <CardDescription>
              Complete these assessments to get your career insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{deadline.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last activity: {formatDate(deadline.targetDate)}
                      {deadline.timeSpent && ` • ${formatTime(deadline.timeSpent)} spent`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(deadline.priority) as any}>
                      {deadline.priority}
                    </Badge>
                    <Button asChild size="sm">
                      <Link href="/assessment/continue">Continue</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Smart suggestions based on your progress and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{rec.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(rec.priority) as any}>
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Est. {rec.estimatedTime}
                      </span>
                      {rec.reason && (
                        <span className="text-xs text-blue-600 font-medium">
                          {rec.reason}
                        </span>
                      )}
                    </div>
                    <Button asChild size="sm">
                      <Link href={rec.actionUrl}>Start</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
