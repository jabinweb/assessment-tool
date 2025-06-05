'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Clock, 
  BookOpen, 
  Users, 
  Star,
  ChevronRight,
  GraduationCap,
  Briefcase,
  School,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AssessmentType {
  id: string;
  name: string;
  code: string;
  description: string;
  targetAudience: string;
  ageGroup: string[];
  educationLevel: string;
  totalDuration: number;
  isDefault: boolean;
  _count: {
    questions: number;
  };
}

interface UserProfile {
  targetAudience?: string;
  educationLevel?: string;
  age?: number;
}

export function AssessmentTypeSelector() {
  const router = useRouter();
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchAssessmentTypes();
  }, []);

  const fetchAssessmentTypes = async () => {
    try {
      setError(null);
      const response = await fetch('/api/assessment/types');
      if (response.ok) {
        const data = await response.json();
        setAssessmentTypes(data.assessmentTypes);
        setUserProfile(data.userProfile);
      } else {
        throw new Error('Failed to fetch assessment types');
      }
    } catch (error) {
      console.error('Error fetching assessment types:', error);
      setError('Unable to load assessment types. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (assessmentTypeId: string) => {
    try {
      setStarting(assessmentTypeId);
      setNotification(null);
      
      const response = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentTypeId })
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({ type: 'success', message: 'Assessment started successfully!' });
        
        // Small delay to show success message
        setTimeout(() => {
          router.push(`/assessment/${data.sessionId}`);
        }, 500);
      } else {
        const error = await response.json();
        setNotification({ 
          type: 'error', 
          message: error.error || 'Failed to start assessment. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      setNotification({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setStarting(null);
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'school_student': return <School className="h-5 w-5" />;
      case 'college_student': return <GraduationCap className="h-5 w-5" />;
      case 'working_professional': return <Briefcase className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'school_student': return 'bg-blue-100 text-blue-700';
      case 'college_student': return 'bg-green-100 text-green-700';
      case 'working_professional': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
        <p className="text-gray-600">Loading assessments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 max-w-md mx-auto text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Assessments</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAssessmentTypes}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-current hover:opacity-70"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your Assessment</h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Select the assessment type that best matches your current educational level and career goals.
        </p>
      </div>

      {/* User Profile Info */}
      {userProfile.targetAudience && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 lg:mb-12 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              {getAudienceIcon(userProfile.targetAudience)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Recommended for you</h3>
              <p className="text-blue-700">
                Based on your profile, we recommend assessments for {userProfile.targetAudience.replace('_', ' ')}s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Types Grid - Responsive 2 Column Layout */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        {assessmentTypes.map((assessmentType) => (
          <div
            key={assessmentType.id}
            className={`group bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              assessmentType.isDefault 
                ? 'border-indigo-200 ring-4 ring-indigo-50 bg-gradient-to-br from-white to-indigo-50' 
                : 'border-gray-200 hover:border-indigo-200'
            }`}
          >
            <div className="p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-xl transition-colors group-hover:scale-110 ${
                  getAudienceColor(assessmentType.targetAudience)
                } shadow-sm`}>
                  {getAudienceIcon(assessmentType.targetAudience)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        {assessmentType.name}
                      </h3>
                      {assessmentType.isDefault && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 mt-2">
                          <Star className="h-3 w-3 mr-1.5 fill-current" />
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed text-base lg:text-lg">
                {assessmentType.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {assessmentType._count.questions}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide font-medium">
                    Questions
                  </div>
                </div>
                
                <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {assessmentType.totalDuration}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide font-medium">
                    Minutes
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => startAssessment(assessmentType.id)}
                disabled={starting === assessmentType.id}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 lg:py-5 rounded-xl font-bold text-lg lg:text-xl transition-all duration-300 transform ${
                  assessmentType.isDefault
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-2xl hover:scale-[1.02]'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {starting === assessmentType.id ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
                    <span>Starting Assessment...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-6 w-6 transition-transform group-hover:scale-110" />
                    Start Assessment
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {assessmentTypes.length === 0 && (
        <div className="text-center py-16 lg:py-24">
          <div className="mx-auto w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <BookOpen className="h-12 w-12 lg:h-16 lg:w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">No Assessments Available</h3>
          <p className="text-gray-500 text-lg lg:text-xl max-w-md mx-auto mb-6">
            Please contact your administrator to set up assessment types for your organization.
          </p>
          <button
            onClick={fetchAssessmentTypes}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
