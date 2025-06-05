import { BarChart3, Lightbulb } from 'lucide-react';

export function NextSteps() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-900">Report Generation</h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Your comprehensive assessment report is being generated with detailed insights from all three sections.
          </p>
          <div className="text-xs text-blue-600">
            ⏱️ Estimated completion: 2-3 minutes
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-900">Personalized Recommendations</h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Based on your responses across aptitude, personality, and interest sections, you'll receive tailored career suggestions.
          </p>
          <div className="text-xs text-green-600">
            📧 Report will be emailed to you shortly
          </div>
        </div>
      </div>
    </div>
  );
}
