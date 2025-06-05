import { CheckCircle } from 'lucide-react';

interface ResultsHeaderProps {
  assessmentName: string;
}

export function ResultsHeader({ assessmentName }: ResultsHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Assessment Completed Successfully!
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">
          Thank you for completing the {assessmentName}
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4 mr-2" />
          All sections completed
        </div>
      </div>
    </div>
  );
}
