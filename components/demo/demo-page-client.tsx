'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ChevronRight, Target, Brain, TrendingUp, Users, Shield, Award, Clock, BarChart3 } from 'lucide-react';
import { SampleAssessment } from './sample-assessment';

export function DemoPageClient() {
  const [showSampleAssessment, setShowSampleAssessment] = useState(false);

  if (showSampleAssessment) {
    return <SampleAssessment onBack={() => setShowSampleAssessment(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Career Assessment</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Career Path</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Take our comprehensive career assessment to discover careers that match your interests, 
            personality, and aptitudes. Get personalized recommendations backed by science.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSampleAssessment(true)}
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Try Sample Assessment
            </button>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-lg"
            >
              Sign Up for Full Access
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Career Discovery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our scientifically-backed assessment evaluates multiple dimensions 
              to provide you with accurate career recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aptitude Testing</h3>
              <p className="text-gray-600">
                Measure your logical, numerical, verbal, and spatial reasoning abilities 
                to identify your cognitive strengths.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personality Analysis</h3>
              <p className="text-gray-600">
                Discover your personality traits using the Big Five model to find 
                careers that match your work style and preferences.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interest Profiling</h3>
              <p className="text-gray-600">
                Explore your interests using the RIASEC model to identify 
                career fields that will keep you engaged and motivated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Simple steps to discover your ideal career path</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Create Account", desc: "Sign up and complete your profile" },
              { icon: BarChart3, title: "Take Assessment", desc: "Complete our comprehensive 3-part assessment" },
              { icon: TrendingUp, title: "Get Results", desc: "Receive detailed analysis and career matches" },
              { icon: Award, title: "Plan Your Future", desc: "Follow personalized recommendations" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Assessment?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Scientifically Validated</h3>
                    <p className="text-gray-600">Based on established psychological models and research</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick & Efficient</h3>
                    <p className="text-gray-600">Complete assessment in 45-60 minutes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-6 w-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Accurate Matching</h3>
                    <p className="text-gray-600">Advanced algorithms for precise career recommendations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-6 w-6 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Actionable Insights</h3>
                    <p className="text-gray-600">Detailed reports with next steps and recommendations</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-indigo-100 mb-6">
                Join thousands of students who have discovered their ideal career paths 
                through our comprehensive assessment.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/register"
                  className="block w-full bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-50 transition-colors"
                >
                  Start Full Assessment
                </Link>
                <button
                  onClick={() => setShowSampleAssessment(true)}
                  className="block w-full border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Try Demo First
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <span className="ml-2 text-xl font-bold">Career Assessment</span>
              </div>
              <p className="text-gray-400">
                Helping students discover their ideal career paths through 
                scientifically-backed assessments.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/demo" className="block text-gray-400 hover:text-white">Demo</Link>
                <Link href="/auth/register" className="block text-gray-400 hover:text-white">Sign Up</Link>
                <Link href="/auth/login" className="block text-gray-400 hover:text-white">Sign In</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <p className="text-gray-400">Email: info@sciolabs.com</p>
                <p className="text-gray-400">Help Center: Available 24/7</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Career Assessment Tool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
