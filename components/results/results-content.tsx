"use client";

import { BarChart3, TrendingUp, Users, Brain, Target, Award, Download, Share2, Printer, Mail, RefreshCw, Star, Trophy, ArrowUpRight } from 'lucide-react';

interface ResultsContentProps {
  report: any;
  isHistorical?: boolean;
}

export function ResultsContent({ report, isHistorical = false }: ResultsContentProps) {
  // Safely parse JSON data with fallbacks
  const aptitudeScores = typeof report.aptitudeScores === 'string' 
    ? JSON.parse(report.aptitudeScores) 
    : report.aptitudeScores || {};
    
  const personalityScores = typeof report.personalityScores === 'string'
    ? JSON.parse(report.personalityScores)
    : report.personalityScores || {};
    
  const interestScores = typeof report.interestScores === 'string'
    ? JSON.parse(report.interestScores)
    : report.interestScores || {};
    
  const careerMatches = typeof report.careerMatches === 'string'
    ? JSON.parse(report.careerMatches)
    : report.careerMatches || [];
    
  const strengths = typeof report.strengths === 'string'
    ? JSON.parse(report.strengths)
    : report.strengths || [];
    
  const recommendations = typeof report.recommendations === 'string'
    ? JSON.parse(report.recommendations)
    : report.recommendations || [];
    
  const developmentAreas = typeof report.developmentAreas === 'string'
    ? JSON.parse(report.developmentAreas)
    : report.developmentAreas || [];

  const handleDownloadPDF = async () => {
    try {
      // Import your PDF generator directly for client-side generation
      const { generateProfessionalPDF } = await import('@/components/pdf/pdf-generator');
      
      await generateProfessionalPDF(
        report,
        report.user?.name || 'Student',
        () => console.log('Starting PDF generation...'),
        () => console.log('PDF generated successfully'),
        (error) => console.error('PDF generation failed:', error)
      );
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Career Assessment Results',
          text: 'Check out my career assessment results!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReport = () => {
    const subject = encodeURIComponent('My Career Assessment Results');
    const body = encodeURIComponent(`Hi,\n\nI wanted to share my career assessment results with you. You can view them at: ${window.location.href}\n\nBest regards`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">Career Assessment Report</h1>
                <p className="text-xl opacity-90 mb-4">Comprehensive Professional Analysis</p>
                <div className="flex items-center gap-4 text-sm opacity-80">
                  <span>Generated: {new Date(report.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>Report ID: {report.id.slice(0, 8).toUpperCase()}</span>
                  {isHistorical && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500 bg-opacity-20 text-orange-100 border border-orange-300">
                        Historical Report
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </button>
                
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-6 py-3 bg-white bg-opacity-10 text-white text-sm font-semibold rounded-xl hover:bg-opacity-20 transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
                
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-6 py-3 bg-white bg-opacity-10 text-white text-sm font-semibold rounded-xl hover:bg-opacity-20 transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="px-8 py-8 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
              Executive Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-600">
                    {Object.values(aptitudeScores).length > 0 ? 
                      Math.round(Object.values(aptitudeScores).reduce((acc: number, val: any) => {
                        const score = typeof val === 'object' ? val.adjusted || val.total || 0 : val;
                        return acc + score;
                      }, 0) / Object.values(aptitudeScores).length) : 0}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cognitive Aptitude</h3>
                <p className="text-sm text-gray-600">Overall problem-solving and analytical capabilities</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="text-right">
                    <span className="text-xl font-bold text-purple-600 block">
                      {Object.entries(personalityScores).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]?.charAt(0).toUpperCase() + Object.entries(personalityScores).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]?.slice(1) || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">Dominant Trait</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personality Profile</h3>
                <p className="text-sm text-gray-600">Primary behavioral and work style preferences</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    {recommendations.length}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Career Matches</h3>
                <p className="text-sm text-gray-600">Personalized career recommendations identified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Aptitude Scores */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Aptitude Assessment</h2>
                <p className="text-gray-600">Cognitive abilities and problem-solving skills</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {Object.entries(aptitudeScores).map(([key, scoreData]) => {
                const score = typeof scoreData === 'object' && scoreData !== null 
                  ? (scoreData as any).adjusted || (scoreData as any).total || 0
                  : scoreData as number;
                  
                return (
                  <div key={key} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-900 capitalize">{key}</span>
                      <span className="text-2xl font-bold text-blue-600">{Math.round(score)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(score, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Developing</span>
                      <span>Proficient</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personality Profile */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personality Profile</h2>
                <p className="text-gray-600">Big Five personality dimensions</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {Object.entries(personalityScores).map(([key, scoreData]) => {
                const score = typeof scoreData === 'object' && scoreData !== null 
                  ? (scoreData as any).adjusted || (scoreData as any).total || 0
                  : scoreData as number;
                  
                return (
                  <div key={key} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-900 capitalize">{key}</span>
                      <span className="text-2xl font-bold text-purple-600">{Math.round(score)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(score, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {report.personalitySummary && (
              <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Personality Summary
                </h3>
                <p className="text-purple-800 leading-relaxed">{report.personalitySummary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Interest Profile */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-8">
            <div className="bg-green-100 p-3 rounded-xl mr-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Interest Profile (RIASEC)</h2>
              <p className="text-gray-600">Holland's career interest inventory results</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {Object.entries(interestScores).map(([key, scoreData]) => {
              const score = typeof scoreData === 'object' && scoreData !== null 
                ? (scoreData as any).adjusted || (scoreData as any).total || 0
                : scoreData as number;
                
              return (
                <div key={key} className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(score)}%</div>
                  <div className="text-sm font-semibold text-gray-900 capitalize mb-2">{key}</div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(score, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {report.interestSummary && (
            <div className="p-6 bg-green-50 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Interest Summary
              </h3>
              <p className="text-green-800 leading-relaxed">{report.interestSummary}</p>
            </div>
          )}
        </div>

        {/* Strengths and Development */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 p-3 rounded-xl mr-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Key Strengths</h2>
                <p className="text-gray-600">Your areas of excellence</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(strengths) && strengths.length > 0 ? strengths.map((strength: string, index: number) => (
                <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="bg-yellow-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-900 font-medium leading-relaxed">{strength}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Complete your assessment to discover your strengths.</p>
                </div>
              )}
            </div>
          </div>

          {/* Development Areas */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 p-3 rounded-xl mr-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Development Areas</h2>
                <p className="text-gray-600">Opportunities for growth</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(developmentAreas) && developmentAreas.length > 0 ? developmentAreas.map((area: string, index: number) => (
                <div key={index} className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="bg-orange-500 w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-900 font-medium leading-relaxed">{area}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Complete your assessment to see development recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-8">
            <div className="flex items-center text-white">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Career Recommendations</h2>
                <p className="text-xl opacity-90">Your personalized career pathway analysis</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {Array.isArray(recommendations) && recommendations.length > 0 ? (
              <div className="space-y-8">
                {recommendations.map((rec: any, index: number) => {
                  const title = rec.career ? `${rec.career}` : rec.title || `Career Option ${index + 1}`;
                  const matchPercentage = Math.round(rec.matchPercentage / 100);
                  const description = rec.reason ? 
                    `This career path shows strong alignment with your personality profile and interests. ${rec.reason}` :
                    rec.description || 'Complete more sections of your assessment to receive detailed recommendations.';
                  const actionItems = rec.nextSteps || rec.actionItems || [];
                  
                  // Get corresponding career data for additional details
                  const careerData = Array.isArray(careerMatches) ? 
                    careerMatches.find(career => career.title === rec.career) : null;
                  
                  return (
                    <div key={index} className="border-2 border-gray-100 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-indigo-100 text-indigo-600 font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                                  {matchPercentage}% Match
                                </span>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < Math.round(matchPercentage / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {careerData?.description && (
                            <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                              <p className="text-gray-700 leading-relaxed">{careerData.description}</p>
                            </div>
                          )}
                          
                          <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
                        </div>
                        
                        <div className="ml-8 text-center bg-white rounded-xl p-4 shadow-md border border-gray-100">
                          <div className="text-4xl font-bold text-indigo-600 mb-1">{matchPercentage}%</div>
                          <div className="text-sm text-gray-500 font-medium">Compatibility</div>
                        </div>
                      </div>

                      {/* Career Details */}
                      {careerData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-6 bg-white rounded-xl border border-gray-100">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 mb-1">Education</div>
                            <div className="text-indigo-600 font-semibold capitalize">{careerData.educationLevel?.replace('_', ' ') || 'Not specified'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 mb-1">Salary Range</div>
                            <div className="text-green-600 font-semibold">
                              {careerData.salaryRange?.min && careerData.salaryRange?.max 
                                ? `$${careerData.salaryRange.min.toLocaleString()} - $${careerData.salaryRange.max.toLocaleString()}`
                                : 'Not specified'
                              }
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 mb-1">Growth Outlook</div>
                            <div className="text-purple-600 font-semibold capitalize">{careerData.growthOutlook || 'Not specified'}</div>
                          </div>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                            style={{ width: `${Math.min(matchPercentage, 100)}%` }}
                          >
                            <span className="text-white text-xs font-semibold">{matchPercentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Items */}
                      {Array.isArray(actionItems) && actionItems.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <ArrowUpRight className="h-5 w-5 mr-2 text-indigo-600" />
                            Recommended Next Steps
                          </h4>
                          <div className="grid gap-4">
                            {actionItems.map((item: string, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-start group p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-all duration-200">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-4 font-bold">
                                  {itemIndex + 1}
                                </div>
                                <span className="text-gray-900 font-medium leading-relaxed">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl border-2 border-dashed border-gray-200">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Recommendations Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                  Complete all sections of your assessment to receive personalized career recommendations tailored to your unique profile.
                </p>
              </div>
            )}

            {/* Professional Guidance Footer */}
            {Array.isArray(recommendations) && recommendations.length > 0 && (
              <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-100">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                    <Trophy className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-indigo-900 mb-3">Professional Guidance</h4>
                    <p className="text-indigo-800 leading-relaxed text-lg">
                      These recommendations are based on scientifically validated assessment methods. Consider discussing these options with a career counselor or mentor for additional insights and personalized guidance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <button
            onClick={handleEmailReport}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Mail className="h-6 w-6 mr-3" />
            Email Report
          </button>
          
          {!isHistorical && (
            <a
              href="/assessment/start"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="h-6 w-6 mr-3" />
              Retake Assessment
            </a>
          )}
        </div>

        {isHistorical && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center">
            <p className="text-orange-800 font-semibold text-lg">
              This is a historical assessment report. For the most current results, please view your latest assessment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
