'use client';

import { Question } from '@prisma/client';
import { useState } from 'react';
import { Eye, Edit, Trash2, Filter } from 'lucide-react';

interface Props {
  questions: Question[];
}

export function QuestionsTable({ questions }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchesFilter = filter === 'all' || q.section === filter;
    const matchesSearch = search === '' || 
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.section.toLowerCase().includes(search.toLowerCase()) ||
      (q.subDomain && q.subDomain.toLowerCase().includes(search.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getQuestionTypeDisplay = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'likert':
        return 'Likert Scale';
      case 'preference':
        return 'Preference';
      default:
        return question.type;
    }
  };

  const getOptionsPreview = (options: any) => {
    if (Array.isArray(options)) {
      return `${options.length} options`;
    }
    if (options?.options) {
      return `${options.options.length} options`;
    }
    return 'N/A';
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'aptitude':
        return 'bg-blue-100 text-blue-800';
      case 'personality':
        return 'bg-purple-100 text-purple-800';
      case 'interest':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Sections</option>
            <option value="aptitude">Aptitude</option>
            <option value="personality">Personality</option>
            <option value="interest">Interest</option>
          </select>
        </div>
        
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain/Trait
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-xs truncate" title={question.text}>
                    {question.text}
                  </div>
                  {question.difficulty && (
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full mt-1 ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSectionColor(question.section)}`}>
                    {question.section}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getQuestionTypeDisplay(question)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {question.subDomain || question.trait || question.riasecCode || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {getOptionsPreview(question.options)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {question.order}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = `/admin/questions/${question.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="View/Edit"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.location.href = `/admin/questions/${question.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this question?')) {
                          // TODO: Implement delete functionality
                          alert('Delete functionality will be implemented');
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No questions found matching your criteria.
        </div>
      )}
    </div>
  );
}
