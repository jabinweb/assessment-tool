'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Heart, Lightbulb, Clock, ArrowLeft, ArrowRight, Pause, CheckCircle, Save, Loader2 } from 'lucide-react';

interface Question {
  id: string;
  section: string;
  subDomain?: string | null;
  type: string;
  text: string;
  options: any;
  order: number;
  timeLimit?: number | null;
  difficulty?: string | null;
  trait?: string | null;
  riasecCode?: string | null;
}

interface AssessmentSectionProps {
  section: string;
  questions: Question[];
  existingAnswers: any[];
  sessionId: string;
  userId: string;
}

export function AssessmentSection({ 
  section, 
  questions, 
  existingAnswers, 
  sessionId, 
  userId 
}: AssessmentSectionProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-save functionality
  const autoSave = useCallback(async (questionId: string, answer: string, timeOnQuestion: number) => {
    if (autoSaveStatus === 'saving') return;
    
    setAutoSaveStatus('saving');
    try {
      await saveAnswer(questionId, answer, timeOnQuestion);
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('idle');
    }
  }, [autoSaveStatus]);

  // Check if questions are loaded
  useEffect(() => {
    if (questions && questions.length > 0) {
      setIsLoading(false);
    }
  }, [questions]);

  // Load existing answers
  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      const answerMap: Record<string, string> = {};
      existingAnswers.forEach(answer => {
        answerMap[answer.questionId] = answer.answer;
      });
      setAnswers(answerMap);

      // Find first unanswered question
      const firstUnanswered = questions.findIndex(q => !answerMap[q.id]);
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      }
    }
  }, [existingAnswers, questions, isLoading]);

  // Track time spent on each question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Show loading state while questions are being fetched
  if (isLoading || !questions || questions.length === 0) {
    const sectionConfig = {
      aptitude: {
        title: 'Aptitude Assessment',
        icon: Brain,
        color: 'bg-blue-500',
        description: 'Test your logical reasoning and problem-solving abilities'
      },
      personality: {
        title: 'Personality Inventory',
        icon: Heart,
        color: 'bg-purple-500',
        description: 'Discover your personality traits and characteristics'
      },
      interest: {
        title: 'Interest Profiler',
        icon: Lightbulb,
        color: 'bg-green-500',
        description: 'Explore your career interests and preferences'
      }
    };

    const config = sectionConfig[section as keyof typeof sectionConfig];
    const Icon = config.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className={`${config.color} p-2 rounded-xl shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="text-center py-12">
              <div className="flex justify-center mb-6">
                <div className={`${config.color} p-4 rounded-full`}>
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Loading {config.title}
              </h2>
              <p className="text-gray-600 mb-6">
                Preparing your personalized assessment questions...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                <div className={`h-2 rounded-full ${config.color} animate-pulse`} style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have a valid current question AFTER loading is complete
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Question Not Found</h2>
          <p className="text-red-700 mb-4">Unable to load the current question.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const questionDifficulty = currentQuestion.difficulty || 'medium';
  const questionTimeLimit = currentQuestion.timeLimit || 60;
  const questionTrait = currentQuestion.trait || '';
  const questionRiasecCode = currentQuestion.riasecCode || '';

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const sectionConfig = {
    aptitude: {
      title: 'Aptitude Assessment',
      icon: Brain,
      color: 'bg-blue-500',
      description: 'Test your logical reasoning and problem-solving abilities'
    },
    personality: {
      title: 'Personality Inventory',
      icon: Heart,
      color: 'bg-purple-500',
      description: 'Discover your personality traits and characteristics'
    },
    interest: {
      title: 'Interest Profiler',
      icon: Lightbulb,
      color: 'bg-green-500',
      description: 'Explore your career interests and preferences'
    }
  };

  const config = sectionConfig[section as keyof typeof sectionConfig];
  const Icon = config.icon;

  const handleAnswerChange = (value: string) => {
    const questionId = currentQuestion.id;
    const timeOnQuestion = Date.now() - questionStartTime;
    
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setTimeSpent(prev => ({ ...prev, [questionId]: timeOnQuestion }));
    
    // Auto-save after a short delay
    setTimeout(() => {
      autoSave(questionId, value, timeOnQuestion);
    }, 1000);
  };

  const saveAnswer = async (questionId: string, answer: string, timeOnQuestion: number) => {
    try {
      await fetch('/api/assessment/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          answer,
          timeSpent: timeOnQuestion,
          sessionId
        })
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleNext = async () => {
    const questionId = currentQuestion.id;
    const answer = answers[questionId];
    const timeOnQuestion = timeSpent[questionId] || (Date.now() - questionStartTime);

    if (answer !== undefined) {
      await saveAnswer(questionId, answer, timeOnQuestion);
    }

    if (isLastQuestion) {
      await handleSectionComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handlePauseAndSave = async () => {
    setIsSubmitting(true);
    try {
      // Save current answer if exists
      const questionId = currentQuestion.id;
      const answer = answers[questionId];
      const timeOnQuestion = timeSpent[questionId] || (Date.now() - questionStartTime);

      if (answer !== undefined) {
        await saveAnswer(questionId, answer, timeOnQuestion);
      }

      // Update session status to paused
      await fetch('/api/assessment/session/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, currentQuestionIndex })
      });

      router.push('/dashboard?paused=true');
    } catch (error) {
      console.error('Error pausing assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Mark session as completed
      await fetch('/api/assessment/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      // Determine next section or complete assessment
      const sectionOrder = ['aptitude', 'personality', 'interest'];
      const currentIndex = sectionOrder.indexOf(section);
      
      if (currentIndex < sectionOrder.length - 1) {
        // Go to next section
        const nextSection = sectionOrder[currentIndex + 1];
        router.push(`/assessment/section/${nextSection}`);
      } else {
        // Complete assessment and generate report - redirect to unified results route
        await fetch('/api/assessment/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        
        router.push('/results'); // Unified results route
      }
    } catch (error) {
      console.error('Error completing section:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header with Section Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Section Progress Tabs */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-4">
              {['aptitude', 'personality', 'interest'].map((sectionName, index) => {
                const isCompleted = index < ['aptitude', 'personality', 'interest'].indexOf(section);
                const isCurrent = sectionName === section;
                const sectionInfo = {
                  aptitude: { title: 'Think & Solve', emoji: '🧠', color: 'blue' },
                  personality: { title: 'Know Yourself', emoji: '💝', color: 'purple' },
                  interest: { title: 'Explore Interests', emoji: '✨', color: 'green' }
                };
                
                return (
                  <div key={sectionName} className="flex items-center">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : isCurrent 
                        ? `bg-${sectionInfo[sectionName as keyof typeof sectionInfo].color}-100 text-${sectionInfo[sectionName as keyof typeof sectionInfo].color}-700`
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className="text-lg">{sectionInfo[sectionName as keyof typeof sectionInfo].emoji}</span>
                      <span className="hidden sm:inline">{sectionInfo[sectionName as keyof typeof sectionInfo].title}</span>
                      {isCompleted && <CheckCircle className="h-4 w-4" />}
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${config.color} p-2 rounded-xl shadow-sm`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{config.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{config.description}</p>
              </div>
            </div>
            
            {/* Question Counter & Auto-save Status */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {currentQuestionIndex + 1} of {questions.length}
              </div>
              {autoSaveStatus !== 'idle' && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Save className="h-3 w-3 mr-1" />
                  {autoSaveStatus === 'saving' ? 'Saving...' : 'Saved'}
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Section Progress</span>
              <span className="font-medium">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${config.color.replace('bg-', 'from-')} to-opacity-80`}
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full bg-white bg-opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-8 border border-gray-100">
          {/* Question Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentQuestion.difficulty && (
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                )}
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Question {currentQuestionIndex + 1}
                </span>
              </div>
              {currentQuestion.timeLimit && (
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {Math.floor(currentQuestion.timeLimit / 60)}:{String(currentQuestion.timeLimit % 60).padStart(2, '0')} limit
                </div>
              )}
            </div>
            
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            {renderQuestion()}
          </div>

          {/* Navigation with Pause Option */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={handlePauseAndSave}
                disabled={isSubmitting}
                className="flex items-center justify-center px-4 py-2 text-orange-600 hover:text-orange-800 border border-orange-300 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <Pause className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Pause & Save</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span>Responses auto-saved</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] || isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md transition-all transform hover:scale-105 disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  Processing...
                </>
              ) : isLastQuestion ? (
                <>
                  Complete Section
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Motivational Progress Messages */}
        {currentQuestionIndex > 0 && currentQuestionIndex % 10 === 0 && (
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-200">
              <p className="text-green-700 font-medium">
                🎉 Awesome progress! You're {Math.round(progress)}% through this section!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function renderQuestion() {
    const answer = answers[currentQuestion.id];
    
    // Ensure options is properly parsed from JSON
    let questionOptions;
    try {
      if (typeof currentQuestion.options === 'string') {
        questionOptions = JSON.parse(currentQuestion.options);
      } else if (Array.isArray(currentQuestion.options)) {
        questionOptions = currentQuestion.options;
      } else if (typeof currentQuestion.options === 'object' && currentQuestion.options !== null) {
        // Handle case where options might be an object with an options property
        questionOptions = currentQuestion.options.options || Object.values(currentQuestion.options);
      } else {
        console.error('Invalid options format:', currentQuestion.options);
        questionOptions = [];
      }
    } catch (error) {
      console.error('Error parsing options:', error, currentQuestion.options);
      questionOptions = [];
    }

    // Ensure we have an array
    if (!Array.isArray(questionOptions)) {
      console.error('Options is not an array after parsing:', questionOptions);
      questionOptions = [];
    }
    
    if (currentQuestion.type === 'multiple-choice') {
      return (
        <div className="space-y-3">
          {questionOptions.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerChange(index.toString())}
              className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ${
                answer === index.toString()
                  ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm scale-102'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold transition-colors ${
                  answer === index.toString()
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm sm:text-base leading-relaxed">{option}</span>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'likert') {
      return (
        <div className="space-y-2 sm:space-y-3">
          {questionOptions.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerChange(index.toString())}
              className={`w-full text-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                answer === index.toString()
                  ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm sm:text-base font-medium">{option}</span>
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'preference') {
      return (
        <div className="space-y-2 sm:space-y-3">
          {questionOptions.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerChange(index.toString())}
              className={`w-full text-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                answer === index.toString()
                  ? 'border-green-500 bg-green-50 text-green-900 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm sm:text-base font-medium">{option}</span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unsupported question type: {currentQuestion.type}</p>
      </div>
    );
  };
}
