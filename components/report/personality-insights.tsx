'use client';

import { Heart, TrendingUp, Users } from 'lucide-react';

interface PersonalityInsightsProps {
  assessmentData: {
    targetAudience: string;
    answers: any[];
    sectionStats: any;
  };
}

export function PersonalityInsights({ assessmentData }: PersonalityInsightsProps) {
  const { targetAudience } = assessmentData;

  // Mock personality data - in real implementation, this would be calculated from answers
  const personalityTraits = [
    { name: 'Analytical', score: 85, description: 'Strong logical thinking' },
    { name: 'Creative', score: 78, description: 'Innovative problem solving' },
    { name: 'Leadership', score: 72, description: 'Natural leader qualities' },
    { name: 'Teamwork', score: 88, description: 'Collaborative approach' }
  ];

  const workStyle = targetAudience === 'school_student' ? 
    'You work best in structured environments with clear goals and regular feedback.' :
    targetAudience === 'college_student' ?
    'You thrive in collaborative settings with opportunities for creative problem-solving.' :
    'You excel in leadership roles with strategic responsibilities and team management.';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <Heart className="h-6 w-6 text-pink-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">Personality Insights</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        {personalityTraits.map((trait, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{trait.name}</span>
              <span className="text-sm text-gray-600">{trait.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${trait.score}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{trait.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Users className="h-5 w-5 text-pink-600 mr-2" />
          <h4 className="font-semibold text-pink-900">Your Work Style</h4>
        </div>
        <p className="text-sm text-pink-700">{workStyle}</p>
      </div>
    </div>
  );
}
