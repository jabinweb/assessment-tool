import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AT</span>
              </div>
              <span className="font-semibold text-white">Assessment Tool</span>
            </div>
            <p className="text-sm leading-6 text-gray-400">
              Professional assessment platform for educators and organizations.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">API</a></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-sm leading-6 text-gray-400 hover:text-white">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-800 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2024 Assessment Tool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}