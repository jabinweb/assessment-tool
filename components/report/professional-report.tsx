'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, ScatterChart, Scatter, ComposedChart, Area, AreaChart
} from 'recharts';
import { TrendingUp, Award, Users, BookOpen, Briefcase, Target, BarChart3, PieChart } from 'lucide-react';
import { PDFDownloadButton } from '@/components/pdf/pdf-download-button';

interface ProfessionalReportProps {
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
  variant?: 'standard' | 'executive' | 'detailed';
  includeLeadershipAnalysis?: boolean;
  showTransitionPlanning?: boolean;
}

export function ProfessionalReport({ 
  data, 
  variant = 'standard',
  includeLeadershipAnalysis = true,
  showTransitionPlanning = true 
}: ProfessionalReportProps) {
  const [activeSection, setActiveSection] = React.useState('executive');

  // Use the same logic as CollegeStudentReport but with more professional styling
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Executive Career Assessment Report</h1>
              <p className="text-gray-600 mt-2">Professional analysis for {data.user.name || 'Professional'}</p>
              <p className="text-gray-500 text-sm mt-1">Executive Summary • Confidential</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Report ID</div>
                <div className="font-mono text-sm">{data.sessionId.slice(0, 8)}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString()}</div>
              </div>
              
              {/* PDF Download Button */}
              <PDFDownloadButton
                reportData={{
                  user: data.user,
                  scores: data.scores,
                  careerMatches: data.careerMatches,
                  sessionId: data.sessionId,
                  targetAudience: 'working_professional',
                  reportType: variant,
                  includeLeadershipAnalysis,
                  showTransitionPlanning
                }}
                filename={`executive-career-report-${data.user.name?.replace(/\s+/g, '-') || 'professional'}-${new Date().toISOString().split('T')[0]}.pdf`}
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'executive', label: 'Executive Summary', icon: Target },
              { id: 'competency', label: 'Competency Analysis', icon: BarChart3 },
              { id: 'leadership', label: 'Leadership Profile', icon: Users },
              { id: 'transitions', label: 'Career Transitions', icon: TrendingUp },
              { id: 'development', label: 'Strategic Development', icon: Award }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? 'border-indigo-500 text-indigo-600'
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
        {/* Executive Summary */}
        {activeSection === 'executive' && (
          <div className="space-y-8">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Career Alignment</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {data.careerMatches[0]?.matchPercentage || 90}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Growth Potential</p>
                    <p className="text-2xl font-semibold text-gray-900">High</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Leadership Score</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round(aptitudeData.reduce((acc, curr) => acc + curr.score, 0) / aptitudeData.length)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Market Fit</p>
                    <p className="text-2xl font-semibold text-gray-900">Excellent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Career Positioning */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Career Positioning</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={careerFitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="career" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="match" fill="#4F46E5" name="Career Fit %" />
                  <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#059669" strokeWidth={3} name="Growth Trajectory" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Other sections would go here with similar professional styling */}
        {activeSection !== 'executive' && (
          <div className="bg-white p-8 rounded-lg shadow border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Analysis
            </h3>
            <p className="text-gray-600">Detailed {activeSection} analysis coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
