'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  CheckSquare,
  Square,
  BookOpen,
  Clock,
  Award
} from 'lucide-react';

interface Question {
  id: string;
  section: string;
  subDomain?: string;
  type: string;
  text: string;
  order: number;
  timeLimit?: number;
  difficulty?: string;
  complexity: string;
  targetAudience: string[];
  ageGroup: string[];
  isActive: boolean;
  assessmentType?: {
    id: string;
    name: string;
    code: string;
  };
  _count?: {
    answers: number;
  };
}

interface Filters {
  section: string;
  assessmentTypeId: string;
  targetAudience: string;
  complexity: string;
  isActive: string;
  search: string;
}

interface Props {
  initialQuestions: Question[];
}

export function QuestionsManagement({ initialQuestions }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [assessmentTypes, setAssessmentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    section: '',
    assessmentTypeId: '',
    targetAudience: '',
    complexity: '',
    isActive: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: initialQuestions.length,
    totalPages: Math.ceil(initialQuestions.length / 20)
  });

  useEffect(() => {
    fetchAssessmentTypes();
  }, []);

  useEffect(() => {
    if (Object.values(filters).some(filter => filter !== '')) {
      fetchQuestions();
    } else {
      // Use initial questions if no filters
      setQuestions(initialQuestions);
    }
  }, [filters, pagination.page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/admin/questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
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

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedQuestions.length === 0) return;

    try {
      const response = await fetch('/api/admin/questions/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          questionIds: selectedQuestions,
          data
        })
      });

      if (response.ok) {
        fetchQuestions();
        setSelectedQuestions([]);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const selectAllQuestions = () => {
    setSelectedQuestions(
      selectedQuestions.length === questions.length 
        ? [] 
        : questions.map(q => q.id)
    );
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'aptitude': return 'bg-blue-100 text-blue-800';
      case 'personality': return 'bg-green-100 text-green-800';
      case 'interest': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'basic': return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'intermediate': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      case 'advanced': return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
              Questions Database
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage and organize assessment questions across all sections
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Questions</div>
              <div className="text-lg font-semibold text-gray-900">{questions.length}</div>
            </div>
            <button
              onClick={() => router.push('/admin/questions/new')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Question
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search questions by text, section, or domain..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-3 border rounded-lg transition-colors ${
              showFilters 
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {Object.values(filters).some(f => f !== '') && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Enhanced filter dropdowns with better styling */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={filters.section}
                  onChange={(e) => setFilters(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">All Sections</option>
                  <option value="aptitude">🧠 Aptitude</option>
                  <option value="personality">❤️ Personality</option>
                  <option value="interest">🧭 Interest</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Assessment Type</label>
                <select
                  value={filters.assessmentTypeId}
                  onChange={(e) => setFilters(prev => ({ ...prev, assessmentTypeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">All Assessment Types</option>
                  {assessmentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={filters.targetAudience}
                  onChange={(e) => setFilters(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">All Audiences</option>
                  <option value="school_student">🎓 School Student</option>
                  <option value="college_student">🏫 College Student</option>
                  <option value="working_professional">💼 Working Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Complexity</label>
                <select
                  value={filters.complexity}
                  onChange={(e) => setFilters(prev => ({ ...prev, complexity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">All Complexity</option>
                  <option value="basic">🔹 Basic</option>
                  <option value="intermediate">⚪ Intermediate</option>
                  <option value="advanced">🔸 Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.isActive}
                  onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="true">✅ Active</option>
                  <option value="false">❌ Inactive</option>
                </select>
              </div>
            </div>

            {Object.values(filters).some(f => f !== '') && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => 
                    value && (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {key}: {value}
                      </span>
                    )
                  )}
                </div>
                <button
                  onClick={() => setFilters({
                    section: '',
                    assessmentTypeId: '',
                    targetAudience: '',
                    complexity: '',
                    isActive: '',
                    search: ''
                  })}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Bulk Actions */}
        {selectedQuestions.length > 0 && (
          <div className="mt-4 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">
                {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                ✓ Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                ⏸ Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Questions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <button 
                  onClick={selectAllQuestions}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {selectedQuestions.length === questions.length ? (
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section & Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Audience
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={question.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-6 py-4">
                  <button onClick={() => toggleQuestionSelection(question.id)}>
                    {selectedQuestions.includes(question.id) ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </td>
                
                {/* Question Details */}
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-start gap-3">
                    {getComplexityIcon(question.complexity)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate" title={question.text}>
                        {question.text.length > 80 ? question.text.substring(0, 80) + '...' : question.text}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">#{question.order}</span>
                        </span>
                        {question.timeLimit && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {question.timeLimit}min
                          </span>
                        )}
                        {question.difficulty && (
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {question.difficulty}
                          </span>
                        )}
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          question.complexity === 'basic' ? 'bg-green-100 text-green-700' :
                          question.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Section & Type */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSectionColor(question.section)}`}>
                      {question.section}
                    </span>
                    {question.subDomain && (
                      <p className="text-xs text-gray-500">{question.subDomain}</p>
                    )}
                    {question.assessmentType ? (
                      <p className="text-xs text-gray-600 font-medium">{question.assessmentType.name}</p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No assessment type</p>
                    )}
                  </div>
                </td>

                {/* Target Audience */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {question.targetAudience.slice(0, 2).map(audience => (
                      <span key={audience} className="inline-block px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 font-medium">
                        {audience.replace('_', ' ')}
                      </span>
                    ))}
                    {question.targetAudience.length > 2 && (
                      <span className="inline-block px-2 py-1 rounded-md text-xs bg-gray-200 text-gray-600" title={question.targetAudience.slice(2).join(', ')}>
                        +{question.targetAudience.length - 2}
                      </span>
                    )}
                  </div>
                  {question.ageGroup && question.ageGroup.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      Ages: {question.ageGroup.slice(0, 2).join(', ')}
                      {question.ageGroup.length > 2 && ` +${question.ageGroup.length - 2}`}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {question.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                        Inactive
                      </span>
                    )}
                    {question._count?.answers !== undefined && (
                      <p className="text-xs text-gray-500">
                        {question._count.answers} response{question._count.answers !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => router.push(`/admin/questions/${question.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/questions/${question.id}`)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Question"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this question?')) {
                          // Handle delete
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Question"
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

      {/* Enhanced Empty State */}
      {questions.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Questions Found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {Object.values(filters).some(f => f !== '') 
              ? "No questions match your current filters. Try adjusting your search criteria."
              : "Get started by creating your first assessment question to build your question bank."
            }
          </p>
          <div className="flex items-center justify-center gap-3">
            {Object.values(filters).some(f => f !== '') && (
              <button
                onClick={() => setFilters({
                  section: '',
                  assessmentTypeId: '',
                  targetAudience: '',
                  complexity: '',
                  isActive: '',
                  search: ''
                })}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => router.push('/admin/questions/new')}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Question
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Pagination */}
      {questions.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> questions
            </span>
            {selectedQuestions.length > 0 && (
              <span className="text-indigo-600 font-medium">
                {selectedQuestions.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pagination.page === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
