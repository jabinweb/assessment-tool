'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question } from '@prisma/client';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';

interface QuestionEditFormProps {
  question: Question;
}

export function QuestionEditForm({ question }: QuestionEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    text: question.text,
    section: question.section,
    subDomain: question.subDomain || '',
    type: question.type,
    options: JSON.stringify(question.options, null, 2),
    order: question.order,
    timeLimit: question.timeLimit || '',
    difficulty: question.difficulty || '',
    trait: question.trait || '',
    riasecCode: question.riasecCode || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      let parsedOptions;
      try {
        parsedOptions = JSON.parse(formData.options);
      } catch {
        setMessage({ type: 'error', text: 'Invalid JSON format for options' });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/questions/${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          options: parsedOptions,
          order: parseInt(formData.order.toString()),
          timeLimit: formData.timeLimit ? parseInt(formData.timeLimit.toString()) : null
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Question updated successfully!' });
        setTimeout(() => {
          router.push('/admin/questions');
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update question' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/questions/${question.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/questions');
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to delete question' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter the question text"
          />
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
            Section *
          </label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="aptitude">Aptitude</option>
            <option value="personality">Personality</option>
            <option value="interest">Interest</option>
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Question Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="likert">Likert Scale</option>
            <option value="preference">Preference</option>
          </select>
        </div>

        <div>
          <label htmlFor="subDomain" className="block text-sm font-medium text-gray-700 mb-2">
            Sub Domain
          </label>
          <input
            type="text"
            id="subDomain"
            name="subDomain"
            value={formData.subDomain}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., logical, numerical, openness"
          />
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
            Order *
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (seconds)
          </label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="trait" className="block text-sm font-medium text-gray-700 mb-2">
            Trait (for personality questions)
          </label>
          <input
            type="text"
            id="trait"
            name="trait"
            value={formData.trait}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., extraversion, conscientiousness"
          />
        </div>

        <div>
          <label htmlFor="riasecCode" className="block text-sm font-medium text-gray-700 mb-2">
            RIASEC Code (for interest questions)
          </label>
          <select
            id="riasecCode"
            name="riasecCode"
            value={formData.riasecCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select RIASEC code</option>
            <option value="R">R - Realistic</option>
            <option value="I">I - Investigative</option>
            <option value="A">A - Artistic</option>
            <option value="S">S - Social</option>
            <option value="E">E - Enterprising</option>
            <option value="C">C - Conventional</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-2">
            Options (JSON format) *
          </label>
          <textarea
            id="options"
            name="options"
            value={formData.options}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder='["Option 1", "Option 2", "Option 3", "Option 4"]'
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter options as a JSON array. For likert questions, use numbers like [1, 2, 3, 4, 5].
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/admin/questions')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </button>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>

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
                Save Question
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
