'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ScatterChart, Scatter, ComposedChart, Area, AreaChart, PieChart, Cell
} from 'recharts';
import { TrendingUp, Award, Users, BookOpen, Briefcase, Target, BarChart3 } from 'lucide-react';
import { PDFDownloadButton } from '@/components/pdf/pdf-download-button';

interface CollegeStudentReportProps {
  data: {
    user: any;
    scores: {
      aptitude: Record<string, any>;
      personality: Record<string, number>;
      interest: Record<string, number>;
    };
    careerMatches: any[];
    sessionId: string;
  };
  variant?: 'standard' | 'detailed' | 'academic';
  includeAcademicPlanning?: boolean;
  showInternshipGuide?: boolean;
}

export function CollegeStudentReport({ 
  data, 
  variant = 'standard',
  includeAcademicPlanning = true,
  showInternshipGuide = true 
}: CollegeStudentReportProps) {
  const [activeSection, setActiveSection] = React.useState('summary');

  // Prepare data for professional charts
  const aptitudeData = Object.entries(data.scores.aptitude).map(([key, value]) => ({
    skill: key.charAt(0).toUpperCase() + key.slice(1),
    score: typeof value === 'object' ? (value as any).adjusted || 0 : value as number,
    percentile: typeof value === 'object' ? (value as any).percentile || 50 : 50
  }));

  const careerFitData = data.careerMatches.slice(0, 8).map((career, index) => ({
    career: career.title,
    match: career.matchPercentage || (90 - index * 3),
    salary: career.salaryRange?.median || 50000,
    growth: career.growthOutlook === 'excellent' ? 85 : career.growthOutlook === 'good' ? 70 : 55
  }));

  const skillsAnalysis = Object.entries(data.scores.personality).map(([key, value]) => ({
    trait: key.charAt(0).toUpperCase() + key.slice(1),
    current: value as number,
    industry: Math.min(100, (value as number) + Math.random() * 20 - 10)
  }));

  // Enhanced data for college students
  const industryAnalysis = data.careerMatches.reduce((acc, career) => {
    const industry = career.industry || 'Other';
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const industryData = Object.entries(industryAnalysis).map(([industry, count]) => ({
    industry,
    opportunities: count,
    avgSalary: data.careerMatches
      .filter(c => c.industry === industry)
      .reduce((sum, c) => sum + (c.salaryRange?.median || 50000), 0) / (count as number)
  }));

  const skillGapAnalysis = Object.entries(data.scores.aptitude).map(([skill, value]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    current: typeof value === 'object' ? (value as any).adjusted || 0 : value as number,
    market: Math.min(100, (typeof value === 'object' ? (value as any).adjusted || 0 : value as number) + Math.random() * 30),
    gap: Math.max(0, Math.min(100, (typeof value === 'object' ? (value as any).adjusted || 0 : value as number) + Math.random() * 30) - 
                     (typeof value === 'object' ? (value as any).adjusted || 0 : value as number))
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Assessment Report</h1>
              <p className="text-gray-600 mt-2">Comprehensive analysis for {data.user.name || 'Student'}</p>
              {data.user.age && (
                <p className="text-gray-500 text-sm mt-1">Age: {data.user.age} • College Student</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Generated on</div>
                <div className="font-semibold">{new Date().toLocaleDateString()}</div>
                <div className="text-xs text-gray-400 mt-1">Report ID: {data.sessionId.slice(0, 8)}</div>
              </div>
              
              {/* PDF Download Button */}
              <PDFDownloadButton
                reportData={{
                  user: data.user,
                  scores: data.scores,
                  careerMatches: data.careerMatches,
                  sessionId: data.sessionId,
                  targetAudience: 'college_student',
                  reportType: variant,
                  includeAcademicPlanning,
                  showInternshipGuide
                }}
                filename={`career-assessment-${data.user.name?.replace(/\s+/g, '-') || 'student'}-${new Date().toISOString().split('T')[0]}.pdf`}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[{
              id: 'summary',
              label: 'Executive Summary',
              icon: Target
            },
            {
              id: 'aptitude',
              label: 'Aptitude Analysis',
              icon: BarChart3
            },
            {
              id: 'personality',
              label: 'Personality Profile',
              icon: Users
            },
            {
              id: 'careers',
              label: 'Career Matching',
              icon: Briefcase
            },
            {
              id: 'industries',
              label: 'Industry Analysis',
              icon: TrendingUp
            },
            ...(includeAcademicPlanning ? [{ id: 'academic', label: 'Academic Planning', icon: BookOpen }] : []),
            ...(showInternshipGuide ? [{ id: 'internships', label: 'Internship Guide', icon: Award }] : []),
            {
              id: 'development',
              label: 'Development Plan',
              icon: Target
            }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <section.icon className="w-4 h-4 inline mr-2" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Executive Summary */}
        {activeSection === 'summary' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Career Match</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.careerMatches[0]?.matchPercentage || 90}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Aptitude</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round(aptitudeData.reduce((acc, curr) => acc + curr.score, 0) / aptitudeData.length)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Personality Fit</p>
                    <p className="text-2xl font-semibold text-gray-900">Strong</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Career Options</p>
                    <p className="text-2xl font-semibold text-gray-900">{data.careerMatches.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Fit Overview */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Match Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={careerFitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="career" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="match" fill="#3B82F6" name="Match %" />
                  <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#10B981" name="Growth Potential" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Aptitude Analysis */}
        {activeSection === 'aptitude' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aptitude Assessment Results</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={aptitudeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3B82F6" name="Your Score" />
                  <Bar dataKey="percentile" fill="#10B981" name="Percentile Rank" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aptitudeData.map((skill) => (
                <div key={skill.skill} className="bg-white p-6 rounded-lg shadow border">
                  <h4 className="font-semibold text-gray-900 mb-2">{skill.skill} Reasoning</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-medium">{skill.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${skill.score}%`}}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Percentile</span>
                        <span className="font-medium">{skill.percentile}th</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${skill.percentile}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Matching */}
        {activeSection === 'careers' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Match vs Salary Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={careerFitData}>
                  <CartesianGrid />
                  <XAxis dataKey="match" name="Match %" />
                  <YAxis dataKey="salary" name="Salary" />
                  <Tooltip cursor={{strokeDasharray: '3 3'}} />
                  <Scatter name="Careers" data={careerFitData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Career Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.careerMatches.slice(0, 6).map((career, index) => (
                <div key={career.id} className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{career.title}</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {career.matchPercentage || (90 - index * 3)}% match
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{career.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Industry:</span>
                      <span className="font-medium">{career.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Education:</span>
                      <span className="font-medium">{career.educationLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Growth:</span>
                      <span className="font-medium capitalize">{career.growthOutlook}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Industry Analysis Section */}
        {activeSection === 'industries' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Landscape Analysis</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Salary vs Growth Potential</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <ScatterChart data={careerFitData}>
                      <CartesianGrid />
                      <XAxis dataKey="salary" name="Salary" />
                      <YAxis dataKey="growth" name="Growth %" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'salary' ? `$${value.toLocaleString()}` : `${value}%`,
                          name === 'salary' ? 'Median Salary' : 'Growth Potential'
                        ]}
                      />
                      <Scatter name="Careers" data={careerFitData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Top Industries for You</h4>
                  {industryData.map((industry, index) => (
                    <div key={industry.industry} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-800">{industry.industry}</h5>
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Opportunities:</span>
                          <span className="ml-2 font-medium">{Number(industry.opportunities)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg. Salary:</span>
                          <span className="ml-2 font-medium">${Math.round(industry.avgSalary).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Planning Section */}
        {includeAcademicPlanning && activeSection === 'academic' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Planning & Course Selection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recommended Courses */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Recommended Courses</h4>
                  <div className="space-y-3">
                    {data.careerMatches.slice(0, 3).map((career, index) => (
                      <div key={career.id} className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-semibold text-gray-800 mb-2">{career.title}</h5>
                        <div className="flex flex-wrap gap-2">
                          {(career.requiredSkills || ['Programming', 'Statistics', 'Communication']).slice(0, 4).map((skill: string) => (
                            <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GPA Impact Analysis */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Academic Performance Impact</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-800 mb-2">High Performance (3.5+ GPA)</h5>
                      <p className="text-sm text-green-700">Access to top-tier companies and graduate programs</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h5 className="font-semibold text-yellow-800 mb-2">Good Performance (3.0-3.5 GPA)</h5>
                      <p className="text-sm text-yellow-700">Solid opportunities with skill demonstration</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-2">Focus Areas</h5>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Build a strong portfolio</li>
                        <li>• Gain practical experience</li>
                        <li>• Develop networking skills</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Internship Guide Section */}
        {showInternshipGuide && activeSection === 'internships' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Internship & Experience Guide</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Freshman/Sophomore', 'Junior', 'Senior'].map((year, index) => (
                  <div key={year} className={`p-6 rounded-lg border-2 ${
                    index === 0 ? 'border-green-200 bg-green-50' :
                    index === 1 ? 'border-blue-200 bg-blue-50' :
                    'border-purple-200 bg-purple-50'
                  }`}>
                    <h4 className={`font-bold text-lg mb-4 ${
                      index === 0 ? 'text-green-800' :
                      index === 1 ? 'text-blue-800' :
                      'text-purple-800'
                    }`}>{year}</h4>
                    
                    <div className="space-y-3">
                      {index === 0 && (
                        <>
                          <div className="text-sm">
                            <div className="font-medium text-green-700">Focus Areas:</div>
                            <ul className="text-green-600 mt-1 space-y-1">
                              <li>• Explore different fields</li>
                              <li>• Build foundational skills</li>
                              <li>• Join relevant clubs</li>
                            </ul>
                          </div>
                        </>
                      )}
                      
                      {index === 1 && (
                        <>
                          <div className="text-sm">
                            <div className="font-medium text-blue-700">Action Items:</div>
                            <ul className="text-blue-600 mt-1 space-y-1">
                              <li>• Apply for internships</li>
                              <li>• Attend career fairs</li>
                              <li>• Network with professionals</li>
                            </ul>
                          </div>
                        </>
                      )}
                      
                      {index === 2 && (
                        <>
                          <div className="text-sm">
                            <div className="font-medium text-purple-700">Prepare for:</div>
                            <ul className="text-purple-600 mt-1 space-y-1">
                              <li>• Full-time job search</li>
                              <li>• Graduate school applications</li>
                              <li>• Professional certifications</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Company Target List */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-700 mb-4">Target Companies by Industry</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {industryData.slice(0, 6).map((industry) => (
                    <div key={industry.industry} className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">{industry.industry}</h5>
                      <div className="text-sm text-gray-600">
                        <div>Companies to target:</div>
                        <ul className="mt-1 space-y-1">
                          <li>• Research top employers</li>
                          <li>• Check university partnerships</li>
                          <li>• Attend industry events</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Development Plan */}
        {activeSection === 'development' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Strategic Development Plan</h3>
              
              {/* Skill Gap Analysis */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-700 mb-4">Skill Development Priorities</h4>
                <div className="space-y-4">
                  {skillGapAnalysis.slice(0, 5).map((skill) => (
                    <div key={skill.skill} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{skill.skill}</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          skill.gap > 20 ? 'bg-red-100 text-red-700' :
                          skill.gap > 10 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {skill.gap > 20 ? 'High Priority' :
                           skill.gap > 10 ? 'Medium Priority' :
                           'Low Priority'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Your Level</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${skill.current}%`}}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{Math.round(skill.current)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Market Demand</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{width: `${skill.market}%`}}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{Math.round(skill.market)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium text-gray-700 mb-4">Development Timeline</h4>
                <div className="space-y-6">
                  {[{
                    period: 'Next 3 Months', focus: 'Foundation Building', items: ['Complete online courses', 'Join study groups', 'Start personal projects'] },
                    { period: 'Next 6 Months', focus: 'Skill Application', items: ['Apply for internships', 'Build portfolio', 'Attend workshops'] },
                    { period: 'Next Year', focus: 'Professional Growth', items: ['Gain work experience', 'Network with professionals', 'Seek mentorship'] }
                  ].map((phase, index) => (
                    <div key={phase.period} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 2 && <div className="w-px h-16 bg-gray-300 mt-2"></div>}
                      </div>
                      <div className="flex-1 pb-8">
                        <h5 className="font-semibold text-gray-800">{phase.period}</h5>
                        <p className="text-sm text-gray-600 mb-2">{phase.focus}</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {phase.items.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ...existing sections with enhanced content... */}
      </div>
    </div>
  );
}
