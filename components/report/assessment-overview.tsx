import { TrendingUp, Target, Trophy } from 'lucide-react';

interface AssessmentOverviewProps {
  assessmentData: {
    userId: string;
    sessionId: string;
    targetAudience: string;
    answers: any[];
    sectionStats: any;
    assessmentType: any;
  };
}

export function AssessmentOverview({ assessmentData }: AssessmentOverviewProps) {
  const { targetAudience, sectionStats } = assessmentData;

  // Calculate overall performance
  const overallScore = Math.round(
    (Object.values(sectionStats).reduce((sum: number, section: any) => 
      sum + (section.completed / section.total * 100), 0) / 3)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Results Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-blue-900 mb-1">{overallScore}%</div>
          <div className="text-sm text-blue-700">Overall Performance</div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <Target className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-green-900 mb-1">
            {targetAudience === 'school_student' ? 'Beginner' : 
             targetAudience === 'college_student' ? 'Intermediate' : 'Advanced'}
          </div>
          <div className="text-sm text-green-700">Assessment Level</div>
        </div>
        
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-purple-900 mb-1">Ready</div>
          <div className="text-sm text-purple-700">Career Exploration</div>
        </div>
      </div>

      <div className="prose max-w-none">
        <p className="text-gray-600 leading-relaxed">
          {targetAudience === 'school_student' ? 
            "Great job completing your first career assessment! Your results show areas where you naturally excel and subjects that interest you. This is the beginning of your career exploration journey." :
            targetAudience === 'college_student' ?
            "Your assessment results provide valuable insights into your strengths, personality traits, and career interests. Use these findings to guide your academic choices and career planning." :
            "Your comprehensive assessment reveals your professional strengths, work style preferences, and career alignment. These insights can help guide your career development and job search strategy."
          }
        </p>
      </div>
    </div>
  );
}
