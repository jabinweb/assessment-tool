

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Plus,
  Trash2
} from 'lucide-react';

interface CareerFormData {
  title: string;
  description: string;
  industry: string;
  educationLevel: string;
  salaryRange: {
    min?: number;
    max?: number;
    currency: string;
  };
  growthOutlook: string;
  workEnvironment: string;
  workStyle: string;
  targetAudience: string[];
  schoolSubjects: string[];
  collegePrograms: string[];
  isActive: boolean;
  riasecProfile: Record<string, number>;
  requiredSkills: Record<string, string[]>;
  personalityFit: Record<string, any>;
  entryPaths: Record<string, any>;
  skillDevelopment: Record<string, any>;
  realWorldExamples: Record<string, any>;
  careerProgression: Record<string, any>;
  alternativePaths: Record<string, any>;
  internships?: any;
}

const initialFormData: CareerFormData = {
  title: '',
  description: '',
  industry: 'technology',
  educationLevel: 'bachelor',
  salaryRange: {
    currency: 'USD'
  },
  growthOutlook: 'stable',
  workEnvironment: 'office',
  workStyle: 'independent',
  targetAudience: ['college_student'],
  schoolSubjects: [],
  collegePrograms: [],
  isActive: true,
  riasecProfile: {},
  requiredSkills: {},
  personalityFit: {},
  entryPaths: {},
  skillDevelopment: {},
  realWorldExamples: {},
  careerProgression: {},
  alternativePaths: {}
};

export default function CareerForm() {
  const router = useRouter();
  const params = useParams();
  const isEditing = params.id !== 'new';
  const [formData, setFormData] = useState<CareerFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchCareer();
    }
  }, [isEditing]);

  const fetchCareer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/careers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching career:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing 
        ? `/api/admin/careers/${params.id}` 
        : '/api/admin/careers';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/careers');
      }
    } catch (error) {
      console.error('Error saving career:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (field: string, value: string) => {
    if (value.trim()) {
      const currentArray = (formData as any)[field] || [];
      updateFormData(field, [...currentArray, value.trim()]);
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = (formData as any)[field] || [];
    updateFormData(field, currentArray.filter((_: any, i: number) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push('/admin/careers')}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Career' : 'Create Career'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Modify career information and details' : 'Add a new career to the database'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="engineering">Engineering</option>
                <option value="creative">Creative</option>
                <option value="business">Business</option>
                <option value="science">Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateFormData('educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Growth Outlook
              </label>
              <select
                value={formData.growthOutlook}
                onChange={(e) => updateFormData('growthOutlook', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="high">High Growth</option>
                <option value="moderate">Moderate Growth</option>
                <option value="stable">Stable</option>
                <option value="declining">Declining</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Environment
              </label>
              <select
                value={formData.workEnvironment}
                onChange={(e) => updateFormData('workEnvironment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="field">Field Work</option>
                <option value="laboratory">Laboratory</option>
                <option value="hospital">Hospital</option>
                <option value="classroom">Classroom</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary
              </label>
              <input
                type="number"
                value={formData.salaryRange.min || ''}
                onChange={(e) => updateFormData('salaryRange.min', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary
              </label>
              <input
                type="number"
                value={formData.salaryRange.max || ''}
                onChange={(e) => updateFormData('salaryRange.max', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 80000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.salaryRange.currency}
                onChange={(e) => updateFormData('salaryRange.currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Educational Pathways */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Educational Pathways</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relevant School Subjects
              </label>
              <div className="space-y-2">
                {formData.schoolSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => {
                        const newSubjects = [...formData.schoolSubjects];
                        newSubjects[index] = e.target.value;
                        updateFormData('schoolSubjects', newSubjects);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('schoolSubjects', index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('schoolSubjects', 'New Subject')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Programs
              </label>
              <div className="space-y-2">
                {formData.collegePrograms.map((program, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={program}
                      onChange={(e) => {
                        const newPrograms = [...formData.collegePrograms];
                        newPrograms[index] = e.target.value;
                        updateFormData('collegePrograms', newPrograms);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('collegePrograms', index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('collegePrograms', 'New Program')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="flex flex-wrap gap-4">
                {['school_student', 'college_student', 'working_professional'].map(audience => (
                  <label key={audience} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targetAudience.includes(audience)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData('targetAudience', [...formData.targetAudience, audience]);
                        } else {
                          updateFormData('targetAudience', formData.targetAudience.filter(a => a !== audience));
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">{audience.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => updateFormData('isActive', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Career
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/careers')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update' : 'Create'} Career
          </button>
        </div>
      </form>
    </div>
  );
}
