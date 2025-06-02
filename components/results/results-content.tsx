"use client";

import { BarChart3, TrendingUp, Users, Brain, Target, Award, Download, Share2, Printer, Mail, RefreshCw, Star, Trophy, ArrowUpRight, PieChart } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ResultsContentProps {
  report: any;
  isHistorical?: boolean;
}

export function ResultsContent({ report, isHistorical = false }: ResultsContentProps) {
  const aptitudeChartRef = useRef<HTMLCanvasElement>(null);
  const personalityChartRef = useRef<HTMLCanvasElement>(null);
  const interestChartRef = useRef<HTMLCanvasElement>(null);
  const overviewChartRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const loadChartsAndRender = async () => {
      try {
        const Chart = (await import('chart.js/auto')).default;
        
        // Aptitude Radar Chart
        if (aptitudeChartRef.current) {
          new Chart(aptitudeChartRef.current, {
            type: 'radar',
            data: {
              labels: Object.keys(aptitudeScores).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
              datasets: [{
                label: 'Aptitude Scores',
                data: Object.values(aptitudeScores).map((score: any) => 
                  typeof score === 'object' ? score.adjusted || score.total || 0 : score
                ),
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    stepSize: 20
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }
          });
        }

        // Personality Bar Chart
        if (personalityChartRef.current) {
          new Chart(personalityChartRef.current, {
            type: 'bar',
            data: {
              labels: Object.keys(personalityScores).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
              datasets: [{
                label: 'Personality Scores',
                data: Object.values(personalityScores).map((score: any) => 
                  typeof score === 'object' ? score.adjusted || score.total || 0 : score
                ),
                backgroundColor: [
                  'rgba(147, 51, 234, 0.8)',
                  'rgba(168, 85, 247, 0.8)', 
                  'rgba(196, 181, 253, 0.8)',
                  'rgba(221, 214, 254, 0.8)',
                  'rgba(233, 213, 255, 0.8)'
                ],
                borderColor: [
                  'rgba(147, 51, 234, 1)',
                  'rgba(168, 85, 247, 1)',
                  'rgba(196, 181, 253, 1)',
                  'rgba(221, 214, 254, 1)',
                  'rgba(233, 213, 255, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }
          });
        }

        // Interest Doughnut Chart
        if (interestChartRef.current) {
          new Chart(interestChartRef.current, {
            type: 'doughnut',
            data: {
              labels: Object.keys(interestScores).map(key => key.toUpperCase()),
              datasets: [{
                data: Object.values(interestScores).map((score: any) => 
                  typeof score === 'object' ? score.adjusted || score.total || 0 : score
                ),
                backgroundColor: [
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(147, 51, 234, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(245, 158, 11, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        }

        // Overview Comparison Chart
        if (overviewChartRef.current) {
          const avgAptitude = Object.values(aptitudeScores).reduce((acc: number, val: any) => {
            const score = typeof val === 'object' ? val.adjusted || val.total || 0 : val;
            return acc + score;
          }, 0) / Object.values(aptitudeScores).length;

          const avgPersonality = Object.values(personalityScores).reduce((acc: number, val: any) => {
            const score = typeof val === 'object' ? val.adjusted || val.total || 0 : val;
            return acc + score;
          }, 0) / Object.values(personalityScores).length;

          const avgInterest = Object.values(interestScores).reduce((acc: number, val: any) => {
            const score = typeof val === 'object' ? val.adjusted || val.total || 0 : val;
            return acc + score;
          }, 0) / Object.values(interestScores).length;

          new Chart(overviewChartRef.current, {
            type: 'line',
            data: {
              labels: ['Aptitude', 'Personality', 'Interests'],
              datasets: [{
                label: 'Assessment Overview',
                data: [avgAptitude, avgPersonality, avgInterest],
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading charts:', error);
      }
    };

    loadChartsAndRender();
  }, [aptitudeScores, personalityScores, interestScores]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">Student Assessment Report</h1>
                <p className="text-xl opacity-90 mb-4">Career Guidance Program</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                  <p className="text-lg font-semibold">{report.user?.name || 'Student'}</p>
                  <p className="text-sm opacity-90">Class: {report.user?.gradeLevel || 'Not specified'} | School: {report.user?.schoolName || 'Not specified'}</p>
                </div>
                <div className="flex items-center gap-4 text-sm opacity-80">
                  <span>Assessment Date: {new Date(report.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>Report ID: {report.id.slice(0, 8).toUpperCase()}</span>
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

          {/* Welcome Message */}
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Dear {report.user?.name || 'Student'},</h2>
              <p className="text-gray-700 leading-relaxed">
                Thank you for your association with our Career Guidance Program. You must have been eagerly awaiting 
                the results and interpretation of your assessment. The findings are now here, analyzed and interpreted 
                to comprise this comprehensive report. You will find an elaborate explanation of your Aptitude, Interest 
                and Personality profile in the sections that follow.
              </p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="px-8 py-8 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
              Assessment Overview
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
                <p className="text-sm text-gray-600">Problem-solving and analytical capabilities</p>
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
                <p className="text-sm text-gray-600">Behavioral preferences and work style</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600 block">
                      {Object.entries(interestScores).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]?.charAt(0).toUpperCase() + Object.entries(interestScores).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]?.slice(1) || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">Primary Interest</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interest Profile</h3>
                <p className="text-sm text-gray-600">Areas of natural curiosity and motivation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Overview Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl mr-4">
              <PieChart className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Psychometric Analysis Overview</h2>
              <p className="text-gray-600">Comprehensive performance across all assessment areas</p>
            </div>
          </div>
          
          <div className="h-64 relative">
            <canvas ref={overviewChartRef} className="w-full h-full"></canvas>
          </div>
        </div>

        {/* Section I: Psychometric Analysis */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Brain className="h-6 w-6 mr-3" />
              Section I - Psychometric Analysis
            </h2>
            <p className="text-blue-100 mt-2">Understanding your abilities, personal characteristics, and interests</p>
          </div>

          <div className="p-8">
            {/* Assessment Results Grid with Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* A. Aptitude Analysis */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">A. Aptitude Profile</h3>
                    <p className="text-gray-600">Your potential skills and abilities</p>
                  </div>
                </div>
                
                {/* Radar Chart */}
                <div className="h-64 mb-6 relative bg-white rounded-xl p-4">
                  <canvas ref={aptitudeChartRef} className="w-full h-full"></canvas>
                </div>
                
                {/* Aptitude Analysis */}
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-900 mb-3">Potential Areas Analysis:</h4>
                  {Object.entries(aptitudeScores).map(([key, scoreData]) => {
                    const score = typeof scoreData === 'object' && scoreData !== null 
                      ? (scoreData as any).adjusted || (scoreData as any).total || 0
                      : scoreData as number;
                    
                    let level = 'Medium';
                    let description = 'can be developed further with effort and guidance';
                    let color = 'text-yellow-600';
                    
                    if (score >= 75) {
                      level = 'High';
                      description = 'are your strength areas with respect to your aptitude';
                      color = 'text-green-600';
                    } else if (score < 50) {
                      level = 'Low';
                      description = 'demonstrate lower ability and may need more development';
                      color = 'text-red-600';
                    }
                      
                    return (
                      <div key={key} className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-semibold text-gray-900 capitalize">{key} Aptitude</span>
                          <span className={`text-lg font-bold ${color}`}>{level} ({Math.round(score)}%)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Your {key} aptitude skills {description}.
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min(score, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* B. Personality Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">B. Personality Profile</h3>
                    <p className="text-gray-600">Your personal traits and characteristics</p>
                  </div>
                </div>
                
                {/* Bar Chart */}
                <div className="h-64 mb-6 relative bg-white rounded-xl p-4">
                  <canvas ref={personalityChartRef} className="w-full h-full"></canvas>
                </div>
                
                {/* Personality Orientations */}
                <div className="space-y-4">
                  <h4 className="font-bold text-purple-900 mb-3">Personality Orientations:</h4>
                  {Object.entries(personalityScores).map(([key, scoreData]) => {
                    const score = typeof scoreData === 'object' && scoreData !== null 
                      ? (scoreData as any).adjusted || (scoreData as any).total || 0
                      : scoreData as number;
                    
                    const orientations: {[key: string]: {title: string, low: string, high: string}} = {
                      openness: {
                        title: 'Learning Orientation (Openness)',
                        low: 'Practical, Realistic',
                        high: 'Imaginative, Experimental'
                      },
                      conscientiousness: {
                        title: 'Conscientiousness Orientation',
                        low: 'Easy going, Impulsive',
                        high: 'Focused, Organized'
                      },
                      extraversion: {
                        title: 'Interpersonal Orientation',
                        low: 'Quiet, Introvert',
                        high: 'Social, Extrovert'
                      },
                      agreeableness: {
                        title: 'Attitudinal Orientation',
                        low: 'Tough, Competitive',
                        high: 'Generous, Cooperative'
                      },
                      neuroticism: {
                        title: 'Emotional Orientation',
                        low: 'Strong, Resilient, Calm',
                        high: 'Sensitive, Nervous, Anxious'
                      }
                    };

                    const orientation = orientations[key] || {title: key, low: 'Low', high: 'High'};
                      
                    return (
                      <div key={key} className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-purple-900">{orientation.title}</span>
                          <span className="text-lg font-bold text-purple-600">{Math.round(score)}%</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>{orientation.low}</span>
                          <span>{orientation.high}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 relative">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min(score, 100)}%` }}
                          ></div>
                          <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-gray-400 transform -translate-x-0.5"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {report.personalitySummary && (
                  <div className="mt-6 p-4 bg-white rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Your Personal Profile Indicates
                    </h4>
                    <p className="text-purple-800 leading-relaxed text-sm">{report.personalitySummary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* C. Interest Profile */}
            <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center mb-8">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">C. Interest Profile (RIASEC)</h3>
                  <p className="text-gray-600">Getting familiar with your interests to determine work areas you'll enjoy</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Doughnut Chart */}
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-bold text-green-900 mb-4 text-center">Your Interest Profile Distribution</h4>
                  <div className="h-80 relative">
                    <canvas ref={interestChartRef} className="w-full h-full"></canvas>
                  </div>
                </div>
                
                {/* Interest Types Analysis */}
                <div className="space-y-4">
                  <h4 className="font-bold text-green-900 mb-4">Your Top Interest Themes:</h4>
                  {Object.entries(interestScores)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .slice(0, 3)
                    .map(([key, scoreData], index) => {
                      const score = typeof scoreData === 'object' && scoreData !== null 
                        ? (scoreData as any).adjusted || (scoreData as any).total || 0
                        : scoreData as number;
                      
                      const types: {[key: string]: {title: string, description: string, you: string}} = {
                        realistic: {title: 'Realistic (Doer)', description: 'Practical, hands-on, problem-solvers', you: 'Builder'},
                        investigative: {title: 'Investigative (Thinker)', description: 'Analytical, intellectual, scientific', you: 'Thinker'},
                        artistic: {title: 'Artistic (Creator)', description: 'Creative, expressive, original', you: 'Creator'},
                        social: {title: 'Social (Helper)', description: 'Helpful, caring, teaching-oriented', you: 'Helper'},
                        enterprising: {title: 'Enterprising (Persuader)', description: 'Energetic, ambitious, sociable', you: 'Persuader'},
                        conventional: {title: 'Conventional (Organizer)', description: 'Detail-oriented, organized, clerical', you: 'Organizer'}
                      };

                      const type = types[key] || {title: key, description: '', you: ''};
                        
                      return (
                        <div key={key} className={`bg-white rounded-lg p-4 border-2 ${index === 0 ? 'border-green-400 bg-green-50' : 'border-green-200'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-green-900">{index + 1}. {type.title}</span>
                            <span className="text-2xl font-bold text-green-600">{Math.round(score)}</span>
                          </div>
                          <p className="text-sm text-green-800 mb-2">{type.description}</p>
                          {index === 0 && <p className="text-xs font-semibold text-green-700">You are a {type.you}</p>}
                          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                              style={{ width: `${Math.min(score, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {report.interestSummary && (
                <div className="p-6 bg-white rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Interest Summary
                  </h4>
                  <p className="text-green-800 leading-relaxed">{report.interestSummary}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section II: Career Fitment Analysis */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="h-6 w-6 mr-3" />
              Section II - Career Fitment Analysis
            </h2>
            <p className="text-indigo-100 mt-2">Your overall fitment to broad career fields</p>
          </div>
          
          <div className="p-8">
            {Array.isArray(recommendations) && recommendations.length > 0 ? (
              <>
                {/* Career Cluster Fitment Chart */}
                <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                    Career Cluster Fitment
                  </h3>
                  <div className="space-y-3">
                    {recommendations.slice(0, 10).map((rec: any, index: number) => {
                      // Extract match percentage
                      let matchPercentage = 0;
                      if (rec.description && typeof rec.description === 'string') {
                        const matches = rec.description.match(/(\d+)%\s*compatibility/i) || rec.description.match(/(\d+)%/);
                        if (matches && matches[1]) {
                          matchPercentage = parseInt(matches[1]);
                        }
                      }
                      if (matchPercentage === 0) {
                        matchPercentage = Math.max(80 - (index * 3), 50);
                      }

                      const title = rec.title?.replace('Pursue ', '') || `Career Field ${index + 1}`;
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <span className="text-sm font-semibold text-gray-900 flex-1">{title}</span>
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-4 max-w-xs">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2" 
                                style={{ width: `${Math.min(matchPercentage, 100)}%` }}
                              >
                                <span className="text-white text-xs font-bold">{matchPercentage}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Career Recommendations */}
                <div className="space-y-8">
                  {recommendations.map((rec: any, index: number) => {
                    const title = rec.career ? `${rec.career}` : rec.title || `Career Option ${index + 1}`;
                    
                    // Extract match percentage from description text
                    let matchPercentage = 0;
                    
                    // First, try direct fields
                    const directPercentage = rec.matchPercentage || rec.match || rec.percentage || rec.score || rec.compatibility;
                    if (directPercentage !== undefined && directPercentage !== null && !isNaN(directPercentage)) {
                      if (directPercentage > 100) {
                        matchPercentage = Math.round(directPercentage / 100);
                      } else if (directPercentage <= 1 && directPercentage > 0) {
                        matchPercentage = Math.round(directPercentage * 100);
                      } else {
                        matchPercentage = Math.round(directPercentage);
                      }
                    }
                    
                    // Extract from text fields (this is working correctly)
                    if (matchPercentage === 0) {
                      const textFields = [rec.description, rec.reason, rec.summary, rec.details];
                      for (const text of textFields) {
                        if (text && typeof text === 'string') {
                          const matches = text.match(/(\d+)%\s*compatibility/i) || text.match(/(\d+)%\s*match/i) || text.match(/(\d+)%/);
                          if (matches && matches[1]) {
                            matchPercentage = parseInt(matches[1]);
                            break;
                          }
                        }
                      }
                    }
                    
                    // Default fallback if still 0
                    if (matchPercentage === 0) {
                      matchPercentage = Math.max(75 - (index * 5), 50);
                    }
                    
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
              </>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl border-2 border-dashed border-gray-200">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Career Analysis In Progress</h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                  Complete all sections of your assessment to receive detailed career fitment analysis and recommendations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section III: Summary & Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Award className="h-6 w-6 mr-3" />
              Section III - Summary & Recommendations
            </h2>
            <p className="text-green-100 mt-2">Detailed and comprehensive analysis of your career recommendations</p>
          </div>
          
          <div className="p-8">
            {/* Action Plan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Your Key Strengths
                </h3>
                
                <div className="space-y-3">
                  {Array.isArray(strengths) && strengths.length > 0 ? strengths.slice(0, 5).map((strength: string, index: number) => (
                    <div key={index} className="flex items-start bg-white rounded-lg p-3 border border-yellow-300">
                      <div className="bg-yellow-500 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 font-medium leading-relaxed text-sm">{strength}</p>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-yellow-700">
                      <Award className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                      <p>Your strengths will be identified after completing the assessment.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Development Areas */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Development Areas
                </h3>
                
                <div className="space-y-3">
                  {Array.isArray(developmentAreas) && developmentAreas.length > 0 ? developmentAreas.slice(0, 5).map((area: string, index: number) => (
                    <div key={index} className="flex items-start bg-white rounded-lg p-3 border border-orange-300">
                      <div className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 font-medium leading-relaxed text-sm">{area}</p>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-orange-700">
                      <BarChart3 className="h-12 w-12 mx-auto mb-3 text-orange-400" />
                      <p>Development recommendations will be provided after assessment completion.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Guidance Footer */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-xl border border-indigo-200">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                  <Trophy className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-900 mb-3">Important Recommendations</h4>
                  <div className="space-y-2 text-indigo-800 leading-relaxed">
                    <p>• This report is based on the introspective data provided by you on the assessment tools</p>
                    <p>• Consider multiple factors while finalizing your career options - don't focus on finding a perfect career</p>
                    <p>• Gather as much information as possible when making career decisions</p>
                    <p>• Supplement these results with academic grades and other relevant information</p>
                    <p>• We recommend discussing these results with your parents and career counselors</p>
                  </div>
                </div>
              </div>
            </div>
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
