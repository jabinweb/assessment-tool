'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Star, Heart, Zap, Trophy, BookOpen, Users, Sparkles, Target, Award, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { PDFDownloadButton } from '@/components/pdf/pdf-download-button';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
const EMOJI_MAP = {
  realistic: '🔧',
  investigative: '🔬', 
  artistic: '🎨',
  social: '👥',
  enterprising: '💼',
  conventional: '📊'
};

interface SchoolStudentReportProps {
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
  variant?: 'basic' | 'comprehensive' | 'visual';
  showParentSection?: boolean;
  includeGamification?: boolean;
}

export function SchoolStudentReport({ 
  data, 
  variant = 'comprehensive',
  showParentSection = true,
  includeGamification = true 
}: SchoolStudentReportProps) {
  const [activeTab, setActiveTab] = React.useState('overview');

  // Prepare data for charts
  const interestData = Object.entries(data.scores.interest).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value as number,
    emoji: EMOJI_MAP[key as keyof typeof EMOJI_MAP] || '⭐'
  }));

  const personalityData = Object.entries(data.scores.personality).map(([key, value]) => ({
    trait: key.charAt(0).toUpperCase() + key.slice(1),
    score: value as number
  }));

  const topCareers = data.careerMatches.slice(0, variant === 'basic' ? 3 : 6);

  // Enhanced data preparation
  const aptitudeData = Object.entries(data.scores.aptitude).map(([key, value]) => ({
    skill: key.charAt(0).toUpperCase() + key.slice(1),
    score: typeof value === 'object' ? (value as any).adjusted || 0 : value as number,
    level: typeof value === 'object' && (value as any).adjusted > 70 ? 'Super Star! ⭐' : 
           typeof value === 'object' && (value as any).adjusted > 50 ? 'Great Job! 👍' : 'Keep Learning! 📚'
  }));

  const subjectSuggestions = topCareers.flatMap(career => career.schoolSubjects || [])
    .reduce((acc, subject) => {
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const subjectData = Object.entries(subjectSuggestions)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 6)
    .map(([subject, count]) => ({ subject, importance: (count as number) * 20 }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div> */}
              <div>
                <h1 className="text-3xl font-bold">🎉 Your Amazing Career Report!</h1>
                <p className="text-purple-100">Hey {data.user.name || 'there'}! Let&apos;s discover your superpowers! ✨</p>
                {data.user.gradeLevel && (
                  <p className="text-purple-200 text-sm mt-1">Grade {data.user.gradeLevel} Student</p>
                )}
              </div>
            </div>
            
            {/* PDF Download Button */}
            <div className="flex items-center gap-4">
              <PDFDownloadButton
                reportData={{
                  user: data.user,
                  scores: data.scores,
                  careerMatches: data.careerMatches,
                  sessionId: data.sessionId,
                  targetAudience: 'school_student',
                  reportType: variant === 'basic' ? 'simplified' : 'comprehensive'
                }}
                filename={`career-report-${data.user.name || 'student'}-${new Date().toISOString().split('T')[0]}.pdf`}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              />
            </div>
          </div>
          
          {includeGamification && (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Level: Future Star!</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">Achievement Unlocked: Assessment Complete!</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white border-b-2 border-purple-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: '🌟 Overview', icon: Star },
              { id: 'interests', label: '❤️ What You Love', icon: Heart },
              { id: 'personality', label: '⚡ Your Powers', icon: Zap },
              { id: 'careers', label: '🏆 Dream Jobs', icon: Trophy },
              { id: 'school', label: '📚 School Guide', icon: BookOpen },
              ...(showParentSection ? [{ id: 'parents', label: '👨‍👩‍👧 For Parents', icon: Users }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Enhanced Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-400 to-red-400 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-2xl font-bold">{topCareers[0]?.matchPercentage || 90}%</div>
                  <div className="text-pink-100">Best Career Match</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-400 to-purple-400 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">💪</div>
                  <div className="text-2xl font-bold">{Object.keys(data.scores.personality).length}</div>
                  <div className="text-blue-100">Personality Traits</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-400 to-teal-400 text-white p-6 rounded-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌟</div>
                  <div className="text-2xl font-bold">{Object.keys(data.scores.interest).length}</div>
                  <div className="text-green-100">Interest Areas</div>
                </div>
              </div>
            </div>

            {/* Career Path Visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🛤️ Your Career Journey Map
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="font-bold text-lg mb-2">Step 1: School Success</h3>
                  <p className="text-sm text-gray-600">Focus on subjects you love and build strong foundations</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                  <div className="text-4xl mb-4">🏫</div>
                  <h3 className="font-bold text-lg mb-2">Step 2: Higher Education</h3>
                  <p className="text-sm text-gray-600">Choose college programs that match your interests</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="font-bold text-lg mb-2">Step 3: Dream Career</h3>
                  <p className="text-sm text-gray-600">Land your perfect job and make a difference!</p>
                </div>
              </div>
            </div>

            {/* Top Career Match */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🏆 Your Top Career Match!
              </h2>
              {topCareers[0] && (
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-3xl">
                    🎮
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{topCareers[0].title}</h3>
                    <p className="text-gray-600 mb-2">{topCareers[0].description}</p>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {topCareers[0].matchPercentage || 90}% Match!
                      </div>
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {topCareers[0].industry}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interests Tab */}
        {activeTab === 'interests' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ❤️ Things You Love Doing!
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interest Pie Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">Your Interest Rainbow 🌈</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={interestData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, emoji }) => `${emoji} ${name}`}
                      >
                        {interestData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Interest Level']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Interest Cards */}
                <div className="space-y-4">
                  {interestData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map((interest, index) => (
                    <div key={interest.name} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="text-3xl">{interest.emoji}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{interest.name}</div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${interest.value}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-purple-600">{interest.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personality Tab */}
        {activeTab === 'personality' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ⚡ Your Awesome Powers!
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Radar Chart */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">Your Personality Web 🕸️</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={personalityData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="trait" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Your Score"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Personality Bars */}
                <div className="space-y-4">
                  {personalityData
                    .sort((a, b) => b.score - a.score)
                    .map((trait, index) => (
                    <div key={trait.trait} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{trait.trait}</span>
                        <span className="text-lg font-bold text-blue-600">{trait.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${trait.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Careers Tab */}
        {activeTab === 'careers' && (
          <div className="space-y-8">
            {/* Career Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCareers.map((career, index) => (
                <div key={career.id} className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' :
                  index === 1 ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-300' :
                  'bg-gradient-to-br from-green-100 to-teal-100 border-green-300'
                }`}>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="text-lg font-bold text-gray-800">{career.title}</div>
                    <div className={`text-2xl font-bold ${
                      index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {career.matchPercentage || (90 - index * 5)}% Match!
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 text-center">{career.description}</p>
                  
                  <div className="space-y-2">
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-600 mb-1">Industry</div>
                      <div className="font-semibold">{career.industry}</div>
                    </div>
                    
                    {career.schoolSubjects && (
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">School Subjects</div>
                        <div className="flex flex-wrap gap-1">
                          {career.schoolSubjects.slice(0, 3).map((subject: string) => (
                            <span key={subject} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* College Programs Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🏫 College Programs to Consider
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topCareers.flatMap(career => career.collegePrograms || [])
                  .filter((program, index, arr) => arr.indexOf(program) === index)
                  .slice(0, 9)
                  .map((program, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-800">{program}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Relevant for multiple career paths
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* School Guide Tab */}
        {activeTab === 'school' && (
          <div className="space-y-8">
            {/* Subject Recommendations */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                📚 Subjects That Matter for Your Dreams
              </h2>
              
              {variant !== 'basic' && (
                <div className="mb-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
                      <Bar dataKey="importance" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(subjectSuggestions).slice(0, 6).map(([subject, count]) => (
                  <div key={subject} className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-2xl">
                      {subject.includes('Math') ? '🔢' :
                       subject.includes('Science') ? '🔬' :
                       subject.includes('Art') ? '🎨' :
                       subject.includes('English') ? '📝' :
                       subject.includes('Computer') ? '💻' : '📖'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{subject}</div>
                      <div className="text-sm text-gray-600">
                        Important for {count as number} of your top careers
                      </div>
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      {(count as number) > 2 ? '🌟' : (count as number) > 1 ? '⭐' : '✨'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracurricular Activities */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🎯 Fun Activities to Try
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topCareers.slice(0, 3).map((career, index) => (
                  <div key={career.id} className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <h3 className="font-bold text-lg mb-3 text-gray-800">{career.title}</h3>
                    <div className="space-y-2">
                      {career.skillDevelopment?.activities?.slice(0, 3).map((activity: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-sm">🎲</span>
                          <span className="text-sm text-gray-700">{activity}</span>
                        </div>
                      )) || (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🎲</span>
                            <span className="text-sm text-gray-700">Join relevant clubs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🏆</span>
                            <span className="text-sm text-gray-700">Participate in competitions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📚</span>
                            <span className="text-sm text-gray-700">Read about this field</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Parents Section */}
        {showParentSection && activeTab === 'parents' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                👨‍👩‍👧 Dear Parents
              </h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">
                  Your child has completed a comprehensive career assessment. Here are the key insights 
                  and recommendations for supporting their future career development:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-3 text-blue-800">🌟 Key Strengths</h3>
                    <ul className="space-y-2">
                      {Object.entries(data.scores.personality)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 3)
                        .map(([trait, score]) => (
                          <li key={trait} className="text-sm text-blue-700">
                            • Strong {trait} characteristics ({Math.round(score as number)}%)
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-3 text-green-800">📚 How to Support</h3>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• Encourage exploration of recommended subjects</li>
                      <li>• Support participation in relevant extracurricular activities</li>
                      <li>• Discuss career options without pressure</li>
                      <li>• Arrange meetings with professionals in fields of interest</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-yellow-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-3 text-yellow-800">⏰ Timeline Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-yellow-700 mb-2">This Year</h4>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        <li>• Focus on core subjects</li>
                        <li>• Join relevant clubs</li>
                        <li>• Explore interests</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-700 mb-2">Next 2 Years</h4>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        <li>• Build specialized skills</li>
                        <li>• Volunteer in areas of interest</li>
                        <li>• Research college programs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-700 mb-2">High School Graduation</h4>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        <li>• Apply to relevant programs</li>
                        <li>• Seek internships</li>
                        <li>• Connect with mentors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ...existing tabs with enhanced content... */}
      </div>
    </div>
  );
}
