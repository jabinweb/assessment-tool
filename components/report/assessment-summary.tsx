import { BarChart3, Clock, CheckCircle } from 'lucide-react';

interface AssessmentSummaryProps {
  totalAnswers: number;
  totalTimeSpent: number;
}

export function AssessmentSummary({ totalAnswers, totalTimeSpent }: AssessmentSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <BarChart3 className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalAnswers}</div>
          <div className="text-sm text-gray-600">Total Questions Answered</div>
        </div>
        
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <Clock className="h-10 w-10 text-indigo-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {Math.round(totalTimeSpent / 60)}
          </div>
          <div className="text-sm text-gray-600">Minutes Spent</div>
        </div>
        
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
    </div>
  );
}
