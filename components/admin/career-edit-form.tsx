'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Career } from '@prisma/client';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

interface CareerEditFormProps {
  career: Career;
}

export function CareerEditForm({ career }: CareerEditFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: career.title,
    description: career.description,
    industry: career.industry,
    educationLevel: career.educationLevel,
    workStyle: career.workStyle,
    workEnvironment: career.workEnvironment,
    growthOutlook: career.growthOutlook,
    requiredSkills: JSON.stringify(career.requiredSkills, null, 2),
    riasecProfile: JSON.stringify(career.riasecProfile, null, 2),
    personalityFit: JSON.stringify(career.personalityFit, null, 2),
    salaryRange: JSON.stringify(career.salaryRange, null, 2),
    isActive: career.isActive
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validate JSON fields
      const jsonFields = ['requiredSkills', 'riasecProfile', 'personalityFit', 'salaryRange'];
      const parsedData: any = { ...formData };

      for (const field of jsonFields) {
        try {
          parsedData[field] = JSON.parse(formData[field as keyof typeof formData] as string);
        } catch {
          setMessage({ type: 'error', text: `Invalid JSON format for ${field}` });
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/admin/careers/${career.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Career updated successfully!' });
        setTimeout(() => {
          router.push(`/admin/careers/${career.id}`);
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update career' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-8">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Career Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div className="lg:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Describe the career role, responsibilities, and requirements..."
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Technology, Healthcare, Finance"
          />
        </div>

        <div>
          <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Education Level *
          </label>
          <select
            id="educationLevel"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="high_school">High School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD/Doctorate</option>
          </select>
        </div>

        <div>
          <label htmlFor="workStyle" className="block text-sm font-medium text-gray-700 mb-2">
            Work Style *
          </label>
          <select
            id="workStyle"
            name="workStyle"
            value={formData.workStyle}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="independent">Independent</option>
            <option value="team">Team-based</option>
            <option value="leadership">Leadership</option>
            <option value="collaborative">Collaborative</option>
          </select>
        </div>

        <div>
          <label htmlFor="workEnvironment" className="block text-sm font-medium text-gray-700 mb-2">
            Work Environment *
          </label>
          <input
            type="text"
            id="workEnvironment"
            name="workEnvironment"
            value={formData.workEnvironment}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., office, remote, outdoor, laboratory"
          />
        </div>

        <div>
          <label htmlFor="growthOutlook" className="block text-sm font-medium text-gray-700 mb-2">
            Growth Outlook *
          </label>
          <select
            id="growthOutlook"
            name="growthOutlook"
            value={formData.growthOutlook}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Active (visible in career matching)
          </label>
        </div>
      </div>

      {/* JSON Configuration Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills (JSON Array) *
          </label>
          <textarea
            id="requiredSkills"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder='["Programming", "Problem Solving", "Communication"]'
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter as JSON array of skill strings.
          </p>
        </div>

        <div>
          <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range (JSON Object) *
          </label>
          <textarea
            id="salaryRange"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder='{"min": 50000, "max": 120000, "median": 80000}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Salary information in USD.
          </p>
        </div>

        <div>
          <label htmlFor="riasecProfile" className="block text-sm font-medium text-gray-700 mb-2">
            RIASEC Profile (JSON Object) *
          </label>
          <textarea
            id="riasecProfile"
            name="riasecProfile"
            value={formData.riasecProfile}
            onChange={handleChange}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder='{"R": 20, "I": 85, "A": 30, "S": 40, "E": 60, "C": 70}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Interest profile scores (0-100) for R-I-A-S-E-C categories.
          </p>
        </div>

        <div>
          <label htmlFor="personalityFit" className="block text-sm font-medium text-gray-700 mb-2">
            Personality Fit (JSON Object) *
          </label>
          <textarea
            id="personalityFit"
            name="personalityFit"
            value={formData.personalityFit}
            onChange={handleChange}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder='{"openness": 75, "conscientiousness": 80, "extraversion": 50, "agreeableness": 60, "neuroticism": 30}'
          />
          <p className="text-xs text-gray-500 mt-1">
            Big Five personality requirements (0-100).
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push(`/admin/careers/${career.id}`)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Career
        </button>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Career
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
