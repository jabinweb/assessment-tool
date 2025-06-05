'use client';

import { Report } from '@prisma/client';
import { useState } from 'react';
import { Trophy, TrendingUp, Users, Briefcase, Download, RotateCcw, Star, Target, BookOpen, Lightbulb } from 'lucide-react';
import { generateProfessionalPDF } from '@/components/pdf/pdf-generator';

interface Props {
  report: Report;
  userName?: string;
}

export function ResultsDisplay({ report, userName = 'Student' }: Props) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const aptitudeScores = report.aptitudeScores as any;
  const personalityScores = report.personalityScores as any;
  const interestScores = report.interestScores as any;
  const careerMatches = report.careerMatches as any[];
  const strengths = report.strengths as string[];
  const recommendations = report.recommendations as any[];

  const getTopPersonalityTrait = () => {
    if (!personalityScores) return 'N/A';
    const traits = Object.entries(personalityScores);
    if (traits.length === 0) return 'N/A';
    const topTrait = traits.sort(([,a], [,b]) => (b as number) - (a as number))[0];
    return topTrait[0].charAt(0).toUpperCase() + topTrait[0].slice(1);
  };

  const getTopInterests = () => {
    if (!interestScores) return [];
    return Object.entries(interestScores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([interest, score]) => ({ interest, score }));
  };

  // Helper function to extract numeric value from score objects
  const getScoreValue = (score: any): number => {
    if (typeof score === 'number') return score;
    if (typeof score === 'object' && score !== null) {
      return score.adjusted || score.total || score.raw || 0;
    }
    return 0;
  };

  // Create visual progress bars
  const ProgressBar = ({ label, value, color, maxValue = 100 }: { label: string; value: number; color: string; maxValue?: number }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${Math.min((value / maxValue) * 100, 100)}%` }}
        >
          <div className="w-full h-full bg-white bg-opacity-30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const handleGeneratePDF = async () => {
    try {
      await generateProfessionalPDF(
        report,
        userName,
        () => setIsGeneratingPDF(true),
        () => setIsGeneratingPDF(false),
        (error) => {
          setIsGeneratingPDF(false);
          alert(`Error generating PDF: ${error}`);
        }
      );
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Header - adjusted for new layout */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <span className="text-5xl mb-4 block">🎯</span>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Career Discovery Results
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Congratulations! Here's your personalized career roadmap based on your unique strengths and interests.
            </p>
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Aptitude</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {aptitudeScores?.overall ? getScoreValue(aptitudeScores.overall) : 0}%
            </div>
            <p className="text-gray-600 text-sm">
              Problem-solving strength
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-purple-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Personality</h3>
            </div>
            <div className="text-xl font-bold text-purple-600 mb-2">
              {getTopPersonalityTrait()}
            </div>
            <p className="text-gray-600 text-sm">
              Your strongest trait
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Top Interest</h3>
            </div>
            <div className="text-xl font-bold text-green-600 mb-2">
              {getTopInterests()[0]?.interest.charAt(0).toUpperCase() + getTopInterests()[0]?.interest.slice(1) || 'N/A'}
            </div>
            <p className="text-gray-600 text-sm">
              What excites you most
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center mb-4">
              <Briefcase className="h-8 w-8 text-orange-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Career Matches</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {careerMatches?.length || 0}
            </div>
            <p className="text-gray-600 text-sm">
              Perfect career fits
            </p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-3" />
              Your Personality Profile
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">{report.personalitySummary}</p>
            
            {/* Personality Radar Chart Simulation */}
            <div className="space-y-3">
              {personalityScores && Object.entries(personalityScores).map(([trait, score]: [string, any]) => (
                <ProgressBar 
                  key={trait}
                  label={trait.charAt(0).toUpperCase() + trait.slice(1)}
                  value={getScoreValue(score)}
                  color="bg-gradient-to-r from-purple-400 to-purple-600"
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Target className="h-6 w-6 text-green-500 mr-3" />
              Your Interest Profile
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">{report.interestSummary}</p>
            
            {/* Interest Chart */}
            <div className="space-y-3">
              {interestScores && Object.entries(interestScores)
                .sort(([,a], [,b]) => getScoreValue(b) - getScoreValue(a))
                .map(([interest, score]: [string, any]) => (
                  <ProgressBar 
                    key={interest}
                    label={interest.charAt(0).toUpperCase() + interest.slice(1)}
                    value={getScoreValue(score)}
                    color="bg-gradient-to-r from-green-400 to-green-600"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Aptitude Breakdown */}
        {aptitudeScores && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <BookOpen className="h-6 w-6 text-blue-500 mr-3" />
              Your Thinking Strengths
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {Object.entries(aptitudeScores)
                  .filter(([key]) => key !== 'overall')
                  .slice(0, Math.ceil(Object.keys(aptitudeScores).length / 2))
                  .map(([domain, score]: [string, any]) => (
                    <ProgressBar 
                      key={domain}
                      label={domain.charAt(0).toUpperCase() + domain.slice(1) + ' Reasoning'}
                      value={getScoreValue(score)}
                      color="bg-gradient-to-r from-blue-400 to-blue-600"
                    />
                  ))}
              </div>
              <div className="space-y-4">
                {Object.entries(aptitudeScores)
                  .filter(([key]) => key !== 'overall')
                  .slice(Math.ceil(Object.keys(aptitudeScores).length / 2))
                  .map(([domain, score]: [string, any]) => (
                    <ProgressBar 
                      key={domain}
                      label={domain.charAt(0).toUpperCase() + domain.slice(1) + ' Reasoning'}
                      value={getScoreValue(score)}
                      color="bg-gradient-to-r from-blue-400 to-blue-600"
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Career Matches */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <Briefcase className="h-6 w-6 text-indigo-500 mr-3" />
            Your Perfect Career Matches
          </h3>
          <div className="grid gap-6">
            {careerMatches?.slice(0, 5).map((career, index) => (
              <div key={index} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-indigo-200 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{career.title}</h4>
                      <p className="text-gray-600">{career.industry}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                      {career.matchPercentage}% match
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{career.description}</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-gray-50 rounded-xl p-4">
                  <div>
                    <span className="font-semibold text-gray-800">Education:</span>
                    <div className="text-gray-600 mt-1">{career.educationLevel}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Work Style:</span>
                    <div className="text-gray-600 mt-1">{career.workStyle}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Environment:</span>
                    <div className="text-gray-600 mt-1">{career.workEnvironment}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Salary Range:</span>
                    <div className="text-gray-600 mt-1">${career.salaryRange?.median?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Next Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3" />
              Your Superpowers
            </h3>
            <ul className="space-y-4">
              {strengths?.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-2xl mr-3">💪</span>
                  <span className="text-green-700 font-medium leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-3" />
              Your Next Steps
            </h3>
            <ul className="space-y-4">
              {recommendations?.slice(0, 3).map((rec, index) => (
                <li key={index} className="border-l-4 border-blue-400 pl-4 bg-white rounded-r-lg p-4">
                  <div className="font-bold text-blue-800 mb-2">{rec.career}</div>
                  <div className="text-blue-700 text-sm mb-2">{rec.reason}</div>
                  <div className="text-blue-600 text-xs">
                    🎯 Next: {rec.nextSteps?.[0]}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Download className="h-5 w-5 mr-3" />
              {isGeneratingPDF ? 'Generating Professional Report...' : 'Download Professional Report'}
            </button>
            <button 
              onClick={() => window.location.href = '/assessment/start'}
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-800 rounded-2xl hover:bg-gray-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <RotateCcw className="h-5 w-5 mr-3" />
              Retake Assessment
            </button>
          </div>
          
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            🌟 Share your professional report with parents, counselors, or mentors to help plan your educational and career journey!
          </p>
        </div>
      </div>
    </div>
  );
}
