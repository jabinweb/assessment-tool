'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface Props {
  nextOrderBySections: {
    aptitude: number;
    personality: number;
    interest: number;
  };
  question?: any; // For edit mode
}

export function QuestionForm({ nextOrderBySections, question }: Props) {
  const router = useRouter();
  const isEditMode = !!question;

  const [formData, setFormData] = useState({
    section: question?.section || 'aptitude',
    subDomain: question?.subDomain || '',
    type: question?.type || 'multiple-choice',
    text: question?.text || '',
    options: question?.options?.options || ['', '', '', ''],
    correctAnswer: question?.options?.correctAnswer || 0,
    isReversed: question?.options?.isReversed || false,
    order: question?.order || nextOrderBySections.aptitude,
    timeLimit: question?.timeLimit || 60,
    difficulty: question?.difficulty || 'medium',
    trait: question?.trait || '',
    riasecCode: question?.riasecCode || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionOptions = {
    aptitude: {
      subDomains: ['logical', 'numerical', 'verbal', 'spatial'],
      types: ['multiple-choice'],
      hasTimeLimit: true,
      hasDifficulty: true,
      hasCorrectAnswer: true
    },
    personality: {
      traits: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
      types: ['likert'],
      hasReversed: true,
      defaultOptions: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
    },
    interest: {
      riasecCodes: ['R', 'I', 'A', 'S', 'E', 'C'],
      types: ['preference'],
      defaultOptions: ['Not at all', 'A little', 'Somewhat', 'Very much', 'Extremely']
    }
  };

  const handleSectionChange = (section: string) => {
    const newFormData = {
      ...formData,
      section,
      order: nextOrderBySections[section as keyof typeof nextOrderBySections],
      subDomain: '',
      trait: '',
      riasecCode: ''
    };

    if (section === 'personality') {
      newFormData.type = 'likert';
      newFormData.options = sectionOptions.personality.defaultOptions;
    } else if (section === 'interest') {
      newFormData.type = 'preference';
      newFormData.options = sectionOptions.interest.defaultOptions;
    } else {
      newFormData.type = 'multiple-choice';
      newFormData.options = ['', '', '', ''];
    }

    setFormData(newFormData);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_: string, i: number) => i !== index);
      setFormData({
        ...formData,
        options: newOptions,
        correctAnswer: formData.correctAnswer >= newOptions.length ? 0 : formData.correctAnswer
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare options based on section
      let finalOptions;
      if (formData.section === 'aptitude') {
        finalOptions = {
          options: formData.options,
          correctAnswer: formData.correctAnswer
        };
      } else if (formData.section === 'personality') {
        finalOptions = {
          options: formData.options,
          isReversed: formData.isReversed
        };
      } else {
        finalOptions = formData.options;
      }

      const submitData = {
        section: formData.section,
        subDomain: formData.section === 'aptitude' ? formData.subDomain : null,
        type: formData.type,
        text: formData.text,
        options: finalOptions,
        order: formData.order,
        timeLimit: formData.section === 'aptitude' ? formData.timeLimit : null,
        difficulty: formData.section === 'aptitude' ? formData.difficulty : null,
        trait: formData.section === 'personality' ? formData.trait : null,
        riasecCode: formData.section === 'interest' ? formData.riasecCode : null
      };

      const url = isEditMode ? `/api/admin/questions/${question.id}` : '/api/admin/questions';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        router.push('/admin/questions');
      } else {
        throw new Error('Failed to save question');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/admin/questions')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </button>
        <h2 className="text-xl font-semibold">
          {isEditMode ? 'Edit Question' : 'Create New Question'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Section *
          </label>
          <select
            value={formData.section}
            onChange={(e) => handleSectionChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="aptitude">Aptitude</option>
            <option value="personality">Personality</option>
            <option value="interest">Interest</option>
          </select>
        </div>

        {/* Section-specific fields */}
        {formData.section === 'aptitude' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-domain *
              </label>
              <select
                value={formData.subDomain}
                onChange={(e) => setFormData({ ...formData, subDomain: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select domain</option>
                {sectionOptions.aptitude.subDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="10"
                max="300"
              />
            </div>
          </div>
        )}

        {formData.section === 'personality' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personality Trait *
              </label>
              <select
                value={formData.trait}
                onChange={(e) => setFormData({ ...formData, trait: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select trait</option>
                {sectionOptions.personality.traits.map(trait => (
                  <option key={trait} value={trait}>{trait}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isReversed"
                checked={formData.isReversed}
                onChange={(e) => setFormData({ ...formData, isReversed: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isReversed" className="text-sm text-gray-700">
                Reverse scored item
              </label>
            </div>
          </div>
        )}

        {formData.section === 'interest' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RIASEC Code *
            </label>
            <select
              value={formData.riasecCode}
              onChange={(e) => setFormData({ ...formData, riasecCode: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Select RIASEC code</option>
              {sectionOptions.interest.riasecCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        )}

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text *
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            required
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer Options *
          </label>
          <div className="space-y-3">
            {formData.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-medium">
                  {formData.section === 'aptitude' ? String.fromCharCode(65 + index) : index + 1}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {formData.section === 'aptitude' && (
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() => setFormData({ ...formData, correctAnswer: index })}
                    className="text-green-600"
                    title="Correct answer"
                  />
                )}
                {formData.options.length > 2 && formData.section === 'aptitude' && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {formData.section === 'aptitude' && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </button>
          )}
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Order
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            min="1"
            required
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/questions')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
}
