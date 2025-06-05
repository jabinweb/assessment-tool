'use client';

import { Briefcase, ArrowRight, Star } from 'lucide-react';

interface CareerMatchesProps {
  assessmentData: {
    userId: string;
    sessionId: string;
    targetAudience: string;
    answers: any[];
    sectionStats: any;
    assessmentType: any;
  };
  recommendations?: any[];
}

export function CareerMatches({ assessmentData }: CareerMatchesProps) {
  const { targetAudience } = assessmentData;

  // Mock career data - in real implementation, this would be calculated from answers
  const getCareerMatches = () => {
    if (targetAudience === 'school_student') {
      return [
        { name: 'Computer Science', match: 92, description: 'Technology and problem-solving', category: 'STEM' },
        { name: 'Engineering', match: 88, description: 'Design and innovation', category: 'STEM' },
        { name: 'Business Management', match: 84, description: 'Leadership and strategy', category: 'Business' },
        { name: 'Medicine', match: 79, description: 'Healthcare and helping others', category: 'Healthcare' }
      ];
    } else if (targetAudience === 'college_student') {
      return [
        { name: 'Software Developer', match: 94, description: 'Build applications and systems', category: 'Technology' },
        { name: 'Data Analyst', match: 89, description: 'Analyze trends and patterns', category: 'Analytics' },
        { name: 'Product Manager', match: 86, description: 'Guide product development', category: 'Management' },
        { name: 'UX Designer', match: 82, description: 'Design user experiences', category: 'Design' }
      ];
    } else {
      return [
        { name: 'Senior Software Engineer', match: 96, description: 'Lead technical projects', category: 'Technology' },
        { name: 'Data Science Manager', match: 91, description: 'Manage analytics teams', category: 'Management' },
        { name: 'Technical Consultant', match: 87, description: 'Advise on technology solutions', category: 'Consulting' },
        { name: 'Product Director', match: 84, description: 'Strategic product leadership', category: 'Leadership' }
      ];
    }
  };

  const careerMatches = getCareerMatches();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <Briefcase className="h-6 w-6 text-indigo-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          {targetAudience === 'school_student' ? 'Academic Paths' : 'Career Matches'}
        </h3>
      </div>
      <div className="space-y-4">
        {careerMatches.map((career, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{career.name}</h4>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-gray-600">{career.match}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{career.description}</p>
            <div className="flex items-center justify-between">
              <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {career.category}
              </span>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                Learn more <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${career.match}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}