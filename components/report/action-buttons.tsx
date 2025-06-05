'use client';

import { BarChart3, CheckCircle, Download, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  sessionId: string;
}

export function ActionButtons({ sessionId }: ActionButtonsProps) {
  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download report for session:', sessionId);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share results for session:', sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-sm"
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          Go to Dashboard
        </a>
        
        <a
          href="/assessment"
          className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Take Another Assessment
        </a>
      </div>
    </div>
  );
}
