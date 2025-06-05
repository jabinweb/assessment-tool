'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  Clock,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';

interface SectionConfig {
  questionCount: number;
  timeLimit: number;
  weight: number;
  subdomains?: string[];
  traits?: string[];
  categories?: string[];
}

interface AssessmentTypeFormData {
  name: string;
  code: string;
  description: string;
  targetAudience: string;
  ageGroup: string[];
  educationLevel: string;
  isActive: boolean;
  isDefault: boolean;
  totalDuration: number;
  sectionsConfig: {
    aptitude: SectionConfig;
    personality: SectionConfig;
    interest: SectionConfig;
  };
  scoringWeights: {
    aptitude: number;
    personality: number;
    interest: number;
  };
  displayStyle: string;
  useVisualAids: boolean;
  useGamification: boolean;
  languageLevel: string;
  reportStyle: string;
  includeParentSummary: boolean;
  includeCounselorNotes: boolean;
}

const initialFormData: AssessmentTypeFormData = {
  name: '',
  code: '',
  description: '',
  targetAudience: 'school_student',
  ageGroup: ['13-15', '16-18'],
  educationLevel: 'school',
  isActive: true,
  isDefault: false,
  totalDuration: 90,
  sectionsConfig: {
    aptitude: {
      questionCount: 25,
      timeLimit: 35,
      weight: 0.3,
      subdomains: ['logical', 'numerical', 'verbal', 'spatial']
    },
    personality: {
      questionCount: 25,
      timeLimit: 20,
      weight: 0.3,
      traits: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    },
    interest: {
      questionCount: 30,
      timeLimit: 25,
      weight: 0.4,
      categories: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
    }
  },
  scoringWeights: {
    aptitude: 0.3,
    personality: 0.3,
    interest: 0.4
  },
  displayStyle: 'visual',
  useVisualAids: true,
  useGamification: true,
  languageLevel: 'simple',
  reportStyle: 'simplified',
  includeParentSummary: true,
  includeCounselorNotes: true
};

export default function AssessmentTypeForm() {
  const router = useRouter();
  const params = useParams();
  const isEditing = params.id !== 'new';
  const [formData, setFormData] = useState<AssessmentTypeFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchAssessmentType();
    }
  }, [isEditing]);

  const fetchAssessmentType = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/assessment-types/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching assessment type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing 
        ? `/api/admin/assessment-types/${params.id}` 
        : '/api/admin/assessment-types';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/assessment-types');
      }
    } catch (error) {
      console.error('Error saving assessment type:', error);
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

  const handleTargetAudienceChange = (audience: string) => {
    let defaultData = { ...initialFormData };
    
    if (audience === 'college_student') {
      defaultData = {
        ...defaultData,
        targetAudience: 'college_student',
        ageGroup: ['18-22', '22+'],
        educationLevel: 'college',
        totalDuration: 120,
        displayStyle: 'standard',
        useVisualAids: false,
        useGamification: false,
        languageLevel: 'intermediate',
        reportStyle: 'standard',
        includeParentSummary: false,
        includeCounselorNotes: false,
        sectionsConfig: {
          aptitude: {
            questionCount: 35,
            timeLimit: 50,
            weight: 0.35,
            subdomains: ['logical', 'numerical', 'verbal', 'spatial', 'analytical']
          },
          personality: {
            questionCount: 35,
            timeLimit: 30,
            weight: 0.35,
            traits: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism', 'leadership', 'teamwork']
          },
          interest: {
            questionCount: 40,
            timeLimit: 35,
            weight: 0.3,
            categories: ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
          }
        },
        scoringWeights: {
          aptitude: 0.35,
          personality: 0.35,
          interest: 0.3
        }
      };
    }

    setFormData(prev => ({
      ...prev,
      ...defaultData,
      name: prev.name,
      code: prev.code,
      description: prev.description
    }));
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
            onClick={() => router.push('/admin/assessment-types')}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Assessment Type' : 'Create Assessment Type'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Modify assessment configuration' : 'Configure a new assessment for specific audience'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => updateFormData('code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => handleTargetAudienceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="school_student">School Student</option>
                <option value="college_student">College Student</option>
                <option value="working_professional">Working Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateFormData('educationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assessment Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.totalDuration}
                onChange={(e) => updateFormData('totalDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Sections Configuration */}
          <div className="space-y-6">
            {Object.entries(formData.sectionsConfig).map(([section, config]) => (
              <div key={section} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3 capitalize">{section}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Questions
                    </label>
                    <input
                      type="number"
                      value={config.questionCount}
                      onChange={(e) => updateFormData(`sectionsConfig.${section}.questionCount`, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Limit (min)
                    </label>
                    <input
                      type="number"
                      value={config.timeLimit}
                      onChange={(e) => updateFormData(`sectionsConfig.${section}.timeLimit`, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={config.weight}
                      onChange={(e) => updateFormData(`sectionsConfig.${section}.weight`, parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UI/UX Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">UI/UX Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Style
              </label>
              <select
                value={formData.displayStyle}
                onChange={(e) => updateFormData('displayStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="visual">Visual</option>
                <option value="standard">Standard</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language Level
              </label>
              <select
                value={formData.languageLevel}
                onChange={(e) => updateFormData('languageLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="simple">Simple</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Style
              </label>
              <select
                value={formData.reportStyle}
                onChange={(e) => updateFormData('reportStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="simplified">Simplified</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { key: 'useVisualAids', label: 'Use Visual Aids' },
              { key: 'useGamification', label: 'Use Gamification' },
              { key: 'includeParentSummary', label: 'Include Parent Summary' },
              { key: 'includeCounselorNotes', label: 'Include Counselor Notes' },
              { key: 'isActive', label: 'Active' },
              { key: 'isDefault', label: 'Set as Default' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={formData[key as keyof AssessmentTypeFormData] as boolean}
                  onChange={(e) => updateFormData(key, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/assessment-types')}
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
            {isEditing ? 'Update' : 'Create'} Assessment Type
          </button>
        </div>
      </form>
    </div>
  );
}
