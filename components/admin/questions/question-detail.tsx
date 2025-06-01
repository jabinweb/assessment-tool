'use client';

import { Question, Answer, User } from '@prisma/client';
import { ArrowLeft, Edit, BarChart3, Users, Clock, Target } from 'lucide-react';

interface Props {
  question: Question & {
    answers: (Answer & {
      user: Pick<User, 'id' | 'name' | 'email'>;
    })[];
  };
  answerStats: Array<{
    answer: string;
    _count: {
      id: number;
    };
  }>;
}

export function QuestionDetail({ question, answerStats }: Props) {
  const options = question.options as any;
  const questionOptions = Array.isArray(options) ? options : options?.options || [];
  const correctAnswer = options?.correctAnswer;
  const isReversed = options?.isReversed;

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'aptitude':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'personality':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'interest':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAnswerDistribution = (): Array<{option: string, count: number, percentage: number}> => {
    const distribution = questionOptions.map((option: string, index: number) => {
      const stat = answerStats.find(s => s.answer === index.toString());
      return {
        option,
        count: stat?._count.id || 0,
        percentage: question.answers.length > 0 
          ? Math.round((stat?._count.id || 0) / question.answers.length * 100)
          : 0
      };
    });
    return distribution;
  };

  const getCorrectAnswerPercentage = () => {
    if (correctAnswer === undefined || question.section !== 'aptitude') return null;
    
    const correctCount = answerStats.find(s => s.answer === correctAnswer.toString())?._count.id || 0;
    return question.answers.length > 0 
      ? Math.round(correctCount / question.answers.length * 100)
      : 0;
  };

  const getAverageTimeSpent = () => {
    const validTimes = question.answers.filter(a => a.timeSpent).map(a => a.timeSpent!);
    if (validTimes.length === 0) return null;
    
    const average = validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length;
    return Math.round(average);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => window.location.href = '/admin/questions'}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Question Details</h1>
          <p className="text-gray-600">Analyze question performance and responses</p>
        </div>
        <button
          onClick={() => window.location.href = `/admin/questions/${question.id}/edit`}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Question
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getSectionColor(question.section)}`}>
                  {question.section}
                </span>
                {question.difficulty && (
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs rounded-full ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Order: {question.order}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {question.text}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Type:</span>
                <span className="ml-2 capitalize">{question.type.replace('-', ' ')}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Domain/Trait:</span>
                <span className="ml-2">{question.subDomain || question.trait || question.riasecCode || 'N/A'}</span>
              </div>
              {question.timeLimit && (
                <div>
                  <span className="font-medium text-gray-500">Time Limit:</span>
                  <span className="ml-2">{Math.floor(question.timeLimit / 60)}:{String(question.timeLimit % 60).padStart(2, '0')}</span>
                </div>
              )}
              {correctAnswer !== undefined && (
                <div>
                  <span className="font-medium text-gray-500">Correct Answer:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {String.fromCharCode(65 + correctAnswer)} - {questionOptions[correctAnswer]}
                  </span>
                </div>
              )}
              {isReversed && (
                <div>
                  <span className="font-medium text-gray-500">Scoring:</span>
                  <span className="ml-2 text-orange-600">Reverse Scored</span>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Options</h3>
            <div className="space-y-3">
              {questionOptions.map((option: string, index: number) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border-2 ${
                    correctAnswer === index 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {correctAnswer === index && (
                      <Target className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Distribution */}
          {question.answers.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Answer Distribution
              </h3>
              <div className="space-y-3">
                {getAnswerDistribution().map((item: {option: string, count: number, percentage: number}, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="truncate max-w-xs">{item.option}</span>
                        <span>{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Response Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Response Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Total Responses</div>
                <div className="text-2xl font-bold text-gray-900">{question.answers.length}</div>
              </div>
              
              {getCorrectAnswerPercentage() !== null && (
                <div>
                  <div className="text-sm text-gray-500">Correct Answers</div>
                  <div className="text-2xl font-bold text-green-600">{getCorrectAnswerPercentage()}%</div>
                </div>
              )}
              
              {getAverageTimeSpent() && (
                <div>
                  <div className="text-sm text-gray-500">Avg. Time Spent</div>
                  <div className="text-2xl font-bold text-blue-600 flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    {getAverageTimeSpent()}s
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Created:</span>
                <div className="font-medium">{new Date(question.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <div className="font-medium">{new Date(question.updatedAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Question ID:</span>
                <div className="font-mono text-xs break-all">{question.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
