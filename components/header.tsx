import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { SignInButton } from '@/components/auth/signin-button';
import { SignOutButton } from '@/components/auth/signout-button';
import { User } from 'lucide-react';

export async function Header() {
  const session = await auth();

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Career Assessment"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold text-white">Career Assessment</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#features" 
              className="text-gray-400 hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-400 hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Reviews
            </a>
            <div className="h-4 w-px bg-gray-700"></div>
            
            {session?.user ? (
              <>
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{session.user.name || session.user.email}</span>
                </div>
                <Link 
                  href="/dashboard"
                  className="bg-gray-800 text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-700 border border-gray-700 transition-colors"
                >
                  Dashboard
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <SignInButton />
                <Link 
                  href="/assessment/start"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Assessment
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
