'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

interface QuestionFormData {
  section: string;
  subDomain: string;
  type: string;
  text: string;
  options: any;
  order: number;
  timeLimit?: number;
  difficulty?: string;
  trait?: string;
  riasecCode?: string;
  targetAudience: string[];
  ageGroup: string[];
  educationLevel: string[];
  complexity: string;
  visualAid?: any;
  schoolFriendlyText?: string;
  examples?: string[];
  isActive: boolean;
  questionGroup?: string;
  prerequisites: string[];
  assessmentTypeId?: string;
}

const initialFormData: QuestionFormData = {
  section: 'aptitude',
  subDomain: '',
  type: 'multiple-choice',
  text: '',
  options: { options: ['', '', '', ''], correctAnswer: 0 },
  order: 1,
  targetAudience: ['college_student'],
  ageGroup: ['18-22'],
  educationLevel: ['college'],
  complexity: 'basic',
  isActive: true,
  prerequisites: []
};

export default function QuestionForm() {
  const router = useRouter();
  const params = useParams();
  const isEditing = params.id !== 'new';
  const [formData, setFormData] = useState<QuestionFormData>(initialFormData);
  const [assessmentTypes, setAssessmentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAssessmentTypes();
    if (isEditing) {
      fetchQuestion();
    }
  }, [isEditing]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/questions/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessmentTypes = async () => {
    try {
      const response = await fetch('/api/admin/assessment-types');
      if (response.ok) {
        const data = await response.json();
        setAssessmentTypes(data);
      }
    } catch (error) {
      console.error('Error fetching assessment types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing 
        ? `/api/admin/questions/${params.id}` 
        : '/api/admin/questions';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/admin/questions');
      }
    } catch (error) {
      console.error('Error saving question:', error);
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

  const addOption = () => {
    if (formData.type === 'multiple-choice') {
      const newOptions = [...formData.options.options, ''];
      updateFormData('options.options', newOptions);
    }
  };

  const removeOption = (index: number) => {
    if (formData.type === 'multiple-choice' && formData.options.options.length > 2) {
      const newOptions = formData.options.options.filter((_: any, i: number) => i !== index);
      updateFormData('options.options', newOptions);
      if (formData.options.correctAnswer >= newOptions.length) {
        updateFormData('options.correctAnswer', 0);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options.options];
    newOptions[index] = value;
    updateFormData('options.options', newOptions);
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
            onClick={() => router.push('/admin/questions')}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Question' : 'Create Question'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Modify question content and settings' : 'Add a new question to the assessment'}
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
                Section *
              </label>
              <select
                value={formData.section}
                onChange={(e) => updateFormData('section', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="aptitude">Aptitude</option>
                <option value="personality">Personality</option>
                <option value="interest">Interest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Domain
              </label>
              <input
                type="text"
                value={formData.subDomain}
                onChange={(e) => updateFormData('subDomain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., logical, numerical, openness"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => updateFormData('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="likert">Likert Scale</option>
                <option value="preference">Preference</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order *
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => updateFormData('order', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Type
              </label>
              <select
                value={formData.assessmentTypeId || ''}
                onChange={(e) => updateFormData('assessmentTypeId', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Assessment Type</option>
                {assessmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity
              </label>
              <select
                value={formData.complexity}
                onChange={(e) => updateFormData('complexity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => updateFormData('text', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {formData.schoolFriendlyText !== undefined && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School-Friendly Text
              </label>
              <textarea
                value={formData.schoolFriendlyText || ''}
                onChange={(e) => updateFormData('schoolFriendlyText', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Simplified version for younger students"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Answer Options</h2>
          
          {formData.type === 'multiple-choice' && (
            <div className="space-y-4">
              {formData.options.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.options.correctAnswer === index}
                    onChange={() => updateFormData('options.correctAnswer', index)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  {formData.options.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </button>
            </div>
          )}

          {(formData.type === 'likert' || formData.type === 'preference') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scale Options (comma-separated)
              </label>
              <input
                type="text"
                value={Array.isArray(formData.options) ? formData.options.join(', ') : ''}
                onChange={(e) => updateFormData('options', e.target.value.split(', '))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree"
              />
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit || ''}
                onChange={(e) => updateFormData('timeLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty || ''}
                onChange={(e) => updateFormData('difficulty', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RIASEC Code
              </label>
              <select
                value={formData.riasecCode || ''}
                onChange={(e) => updateFormData('riasecCode', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select RIASEC</option>
                <option value="R">Realistic</option>
                <option value="I">Investigative</option>
                <option value="A">Artistic</option>
                <option value="S">Social</option>
                <option value="E">Enterprising</option>
                <option value="C">Conventional</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => updateFormData('isActive', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Question
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/questions')}
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
            {isEditing ? 'Update' : 'Create'} Question
          </button>
        </div>
      </form>
    </div>
  );
}
