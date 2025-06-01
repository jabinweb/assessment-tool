'use client';

import { Career } from '@prisma/client';
import { ArrowLeft, Edit, Trash2, Users, DollarSign, GraduationCap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CareerDetailViewProps {
  career: Career;
}

export function CareerDetailView({ career }: CareerDetailViewProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this career? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/careers/${career.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/careers');
      } else {
        alert('Failed to delete career');
      }
    } catch (error) {
      alert('An error occurred while deleting the career');
    }
  };

  const riasecProfile = career.riasecProfile as any;
  const requiredSkills = career.requiredSkills as string[];
  const salaryRange = career.salaryRange as any;
  const personalityFit = career.personalityFit as any;

  const riasecLabels = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <button
              onClick={() => router.push('/admin/careers')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Careers
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{career.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  career.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {career.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-gray-500 text-sm">
                  Created: {new Date(career.createdAt).toLocaleDateString()}
                </span>
                <span className="text-gray-500 text-sm">
                  Updated: {new Date(career.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link
              href={`/admin/careers/${career.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Education Level</p>
              <p className="text-2xl font-semibold text-gray-900">
                {career.educationLevel.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Salary Range</p>
              <p className="text-lg font-semibold text-gray-900">
                {salaryRange?.min && salaryRange?.max ? (
                  `$${salaryRange.min.toLocaleString()} - $${salaryRange.max.toLocaleString()}`
                ) : (
                  'Not specified'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Growth Outlook</p>
              <p className="text-2xl font-semibold text-gray-900 capitalize">
                {career.growthOutlook}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Work Style</p>
              <p className="text-2xl font-semibold text-gray-900 capitalize">
                {career.workStyle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description & Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Description</h2>
          <p className="text-gray-700 leading-relaxed mb-6">{career.description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Industry</h3>
              <p className="text-lg text-gray-900 mt-1">{career.industry}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Work Environment</h3>
              <p className="text-lg text-gray-900 mt-1 capitalize">{career.workEnvironment}</p>
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
          <div className="grid grid-cols-1 gap-2">
            {requiredSkills && requiredSkills.length > 0 ? (
              requiredSkills.map((skill, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                  <span className="text-gray-900">{skill}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No skills specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RIASEC Profile */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">RIASEC Interest Profile</h2>
          <div className="space-y-3">
            {riasecProfile && Object.keys(riasecLabels).map((code) => {
              const score = riasecProfile[code] || 0;
              return (
                <div key={code} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {code}
                    </div>
                    <span className="text-gray-900">{riasecLabels[code as keyof typeof riasecLabels]}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-10">{score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personality Fit */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personality Requirements</h2>
          <div className="space-y-3">
            {personalityFit && Object.entries(personalityFit).map(([trait, score]: [string, any]) => (
              <div key={trait} className="flex items-center justify-between">
                <span className="text-gray-900 capitalize">{trait}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-10">{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Details */}
      {salaryRange && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Minimum</p>
              <p className="text-2xl font-bold text-gray-900">
                ${salaryRange.min?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Median</p>
              <p className="text-2xl font-bold text-green-600">
                ${salaryRange.median?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Maximum</p>
              <p className="text-2xl font-bold text-gray-900">
                ${salaryRange.max?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
