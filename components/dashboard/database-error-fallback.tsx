import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DatabaseErrorFallbackProps {
  user: any;
}

export function DatabaseErrorFallback({ user }: DatabaseErrorFallbackProps) {
  // Check if we're using fallback data
  const isDatabaseError = user.id === 'offline';

  if (!isDatabaseError) {
    // If database is working, show normal dashboard content
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">
              Database Connection Issue
            </h3>
            <p className="text-yellow-700 mt-1">
              We're experiencing temporary connectivity issues. Some features may be limited.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome back, {user.name}!
        </h2>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Limited Mode Active</h3>
            <p className="text-blue-700 text-sm">
              You can still browse the application, but assessment features are temporarily unavailable.
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </button>
            
            <a
              href="/demo"
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Try Demo Mode
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
