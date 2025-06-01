'use client';

import { useState } from 'react';
import { ChevronDown, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface AssessmentHistoryDropdownProps {
  history: Array<{
    id: string;
    version: number;
    createdAt: string;
    isLatest: boolean;
  }>;
  currentVersion: number;
}

export function AssessmentHistoryDropdown({ history, currentVersion }: AssessmentHistoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Assessment History
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                Previous Assessments
              </div>
              
              {history.map((report) => (
                <div key={report.id} className="px-4 py-2 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Version {report.version}
                        {report.isLatest && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {!report.isLatest && (
                      <Link
                        href={`/results/${report.id}`}
                        className="text-indigo-600 hover:text-indigo-700"
                        onClick={() => setIsOpen(false)}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
