'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, FileText, BarChart3, Clock, AlertCircle, X, Brain, Heart, Lightbulb, Play, Pause, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { User, AssessmentSession, Notification } from '@prisma/client';

interface Props {
  user: User;
  progress: {
    aptitude: { completed: number; total: number; percentage: number };
    personality: { completed: number; total: number; percentage: number };
    interest: { completed: number; total: number; percentage: number };
  };
  sessions: AssessmentSession[];
  notifications: Notification[];
}

export function DashboardClient({ user, progress, sessions, notifications }: Props) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dashboard data from props
  const completedSections = Object.values(progress).filter(p => p.percentage === 100).length;
  const inProgressSections = Object.values(progress).filter(p => p.percentage > 0 && p.percentage < 100).length;
  const averageScore = Math.round(
    (progress.aptitude.percentage + progress.personality.percentage + progress.interest.percentage) / 3
  );

  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error === 'forbidden' && message) {
      setErrorMessage(message);
    }
  }, [searchParams]);

  const sections = [
    {
      id: 'aptitude',
      title: 'Think & Solve',
      emoji: '🧠',
      description: 'Test your problem-solving abilities',
      icon: Brain,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      progress: progress.aptitude
    },
    {
      id: 'personality',
      title: 'Know Yourself',
      emoji: '💝',
      description: 'Discover your personality traits',
      icon: Heart,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      progress: progress.personality
    },
    {
      id: 'interest',
      title: 'Explore Interests',
      emoji: '✨',
      description: 'Find what excites you',
      icon: Lightbulb,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      progress: progress.interest
    }
  ];

  const getNextSection = () => {
    if (progress.aptitude.percentage < 100) return 'aptitude';
    if (progress.personality.percentage < 100) return 'personality';
    if (progress.interest.percentage < 100) return 'interest';
    return null;
  };

  const handleStartAssessment = async () => {
    if (isStarting) return; // Prevent multiple clicks
    
    setIsStarting(true);
    try {
      const nextSection = getNextSection();
      if (nextSection) {
        router.push(`/assessment/section/${nextSection}`);
      } else {
        router.push('/assessment/start');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setIsStarting(false);
    }
  };

  const handleContinueSection = (sectionId: string) => {
    if (!mounted) return;
    
    try {
      router.push(`/assessment/section/${sectionId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setErrorMessage('Navigation failed. Please try again.');
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalProgress = Math.round(
    (progress.aptitude.percentage + progress.personality.percentage + progress.interest.percentage) / 3
  );

  const hasStarted = progress.aptitude.completed > 0 || progress.personality.completed > 0 || progress.interest.completed > 0;

  // Check if all sections are complete
  const allSectionsComplete = completedSections === 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Message Banner */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              {hasStarted 
                ? `You're ${totalProgress}% through your career discovery journey`
                : "Ready to discover your perfect career path?"
              }
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{completedSections}</p>
            <p className="text-gray-600 text-sm">Sections finished</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">In Progress</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{inProgressSections}</p>
            <p className="text-gray-600 text-sm">Sections remaining</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Avg Progress</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{averageScore}%</p>
            <p className="text-gray-600 text-sm">Overall completion</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Plus className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Next Step</h3>
            </div>
            <Link
              href="/assessment/start"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {hasStarted ? 'Continue' : 'Start Assessment'}
            </Link>
          </div>
        </div>

        {/* Overall Progress */}
        {hasStarted && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Overall Progress</h2>
              <span className="text-2xl font-bold text-indigo-600">{totalProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 transition-all duration-1000 ease-out"
                style={{ width: `${totalProgress}%` }}
              >
                <div className="w-full h-full bg-white bg-opacity-30"></div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Complete all sections to get your personalized career recommendations
            </p>
          </div>
        )}

        {/* Assessment Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isCompleted = section.progress.percentage === 100;
            const isStarted = section.progress.completed > 0;
            
            return (
              <div
                key={section.id}
                className={`${section.bgColor} rounded-3xl p-6 relative overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  isCompleted ? 'ring-2 ring-green-400' : ''
                }`}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {isCompleted ? (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  ) : isStarted ? (
                    <Pause className="h-8 w-8 text-orange-500" />
                  ) : (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{section.emoji}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{section.title}</h3>
                </div>
                
                <p className="text-gray-700 text-center mb-6 leading-relaxed">{section.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{section.progress.completed}/{section.progress.total}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-60 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${section.color} transition-all duration-500`}
                      style={{ width: `${section.progress.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium text-gray-700">
                      {section.progress.percentage}% Complete
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  {isCompleted ? (
                    <button
                      onClick={() => handleContinueSection(section.id)}
                      className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium"
                    >
                      Review Answers
                    </button>
                  ) : isStarted ? (
                    <button
                      onClick={() => handleContinueSection(section.id)}
                      className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => handleContinueSection(section.id)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                    >
                      Start Section
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {sessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      session.section === 'aptitude' ? 'bg-blue-100 text-blue-600' :
                      session.section === 'personality' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {session.section === 'aptitude' ? <Brain className="h-5 w-5" /> :
                       session.section === 'personality' ? <Heart className="h-5 w-5" /> :
                       <Lightbulb className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{session.section} Section</p>
                      <p className="text-sm text-gray-600">
                        {session.answeredCount}/{session.totalQuestions} questions completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 capitalize">{session.status}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show Results Button when all sections complete */}
        {allSectionsComplete && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 mb-8 border border-green-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                🎉 Congratulations! Assessment Complete!
              </h2>
              <p className="text-green-700 mb-6">
                You've finished all three sections. Ready to discover your career matches?
              </p>
              <Link
                href={`/assessment/results/${user.id}`}
                className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View My Results
                <CheckCircle className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
