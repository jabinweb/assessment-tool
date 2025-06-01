'use client';

import Link from 'next/link';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function NotFound() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Professional Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
        </div>

        {/* Professional Message */}
        <div className="mb-10">
          <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
        </div>

        {/* Professional Action Buttons */}
        <div className="space-y-3 mb-8">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          )}
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Professional Footer */}
        <div className="text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p>If you continue to experience issues, please contact our support team.</p>
          <p className="mt-1">
            <a href="mailto:info@sciolabs.com" className="text-indigo-600 hover:text-indigo-700">
              info@sciolabs.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
