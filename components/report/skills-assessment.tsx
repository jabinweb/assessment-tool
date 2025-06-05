'use client';

import { Target, TrendingUp, AlertCircle } from 'lucide-react';

interface SkillsAssessmentProps {
  assessmentData: {
    targetAudience: string;
    answers: any[];
    sectionStats: any;
  };
}

export function SkillsAssessment({ assessmentData }: SkillsAssessmentProps) {
  const { targetAudience } = assessmentData;

  // Mock skills data - in real implementation, this would be calculated from answers
  const skills = {
    strengths: targetAudience === 'school_student' ? [
      'Mathematics and Logic',
      'Problem Solving',
      'Communication',
      'Time Management'
    ] : targetAudience === 'college_student' ? [
      'Analytical Thinking',
      'Project Management',
      'Technical Skills',
      'Leadership'
    ] : [
      'Strategic Planning',
      'Team Leadership',
      'Decision Making',
      'Innovation'
    ],
    
    development: targetAudience === 'school_student' ? [
      'Public Speaking',
      'Technical Writing',
      'Research Skills'
    ] : targetAudience === 'college_student' ? [
      'Advanced Technical Skills',
      'Industry Knowledge',
      'Networking'
    ] : [
      'Executive Communication',
      'Change Management',
      'Mentoring'
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills Assessment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-900">Your Strengths</h3>
          </div>
          <div className="space-y-3">
            {skills.strengths.map((skill, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <Target className="h-4 w-4 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-orange-900">Areas for Development</h3>
          </div>
          <div className="space-y-3">
            {skills.development.map((skill, index) => (
              <div key={index} className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Target className="h-4 w-4 text-orange-600 mr-3" />
                <span className="text-orange-800 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
