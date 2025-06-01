'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Check your email
          </h1>

          <p className="text-gray-300 mb-6">
            A sign-in link has been sent to your email address.
            Click the link in the email to complete your sign-in.
          </p>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-blue-200 text-sm">
              💡 The link will expire in 24 hours for security reasons.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
