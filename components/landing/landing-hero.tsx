import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BadgeCheck, BrainCircuit, Lightbulb } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Professional
            <span className="text-blue-400"> Assessment </span>
            Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Streamlined assessment creation and management for educators and professionals. 
            Build, deploy, and analyze assessments with powerful analytics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link 
              href="/assessment/start"
              className="bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 rounded-md transition-colors"
            >
              Start Assessment
            </Link>
            <Link 
              href="/demo"
              className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors"
            >
              View Demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        
        {/* Tool Preview */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="rounded-md bg-gray-800/50 p-2 ring-1 ring-gray-700 lg:rounded-2xl lg:p-4">
            <div className="aspect-[16/10] w-full rounded bg-gray-800 border border-gray-700">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}