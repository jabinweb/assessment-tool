'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  Clock,
  Users,
  BookOpen,
  Star
} from 'lucide-react';

interface AssessmentType {
  id: string;
  name: string;
  code: string;
  description: string;
  targetAudience: string;
  ageGroup: string[];
  educationLevel: string;
  isActive: boolean;
  isDefault: boolean;
  totalDuration: number;
  sectionsConfig: any;
  displayStyle: string;
  languageLevel: string;
  reportStyle: string;
  _count?: {
    questions: number;
    assessmentSessions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AssessmentTypesManagement() {
  const router = useRouter();
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchAssessmentTypes();
  }, []);

  const fetchAssessmentTypes = async () => {
    try {
      const response = await fetch('/api/admin/assessment-types');
      if (response.ok) {
        const data = await response.json();
        setAssessmentTypes(data);
      }
    } catch (error) {
      console.error('Error fetching assessment types:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/assessment-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        fetchAssessmentTypes();
      }
    } catch (error) {
      console.error('Error toggling assessment type:', error);
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/assessment-types/${id}/set-default`, {
        method: 'POST'
      });

      if (response.ok) {
        fetchAssessmentTypes();
      }
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  const deleteAssessmentType = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/assessment-types/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchAssessmentTypes();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting assessment type:', error);
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'school_student': return 'bg-blue-100 text-blue-800';
      case 'college_student': return 'bg-green-100 text-green-800';
      case 'working_professional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessment Types</h1>
            <p className="text-gray-600 mt-2">Manage different assessment configurations for various audiences</p>
          </div>
          <button
            onClick={() => router.push('/admin/assessment-types/new')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Assessment Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assessmentTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                    {type.isDefault && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAudienceColor(type.targetAudience)}`}>
                    {type.targetAudience.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => toggleActive(type.id, type.isActive)}
                  className="flex-shrink-0"
                >
                  {type.isActive ? (
                    <ToggleRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{type.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{type.totalDuration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{type.ageGroup.join(', ')} years</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="h-4 w-4" />
                  <span>{type._count?.questions || 0} questions</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                <span>Language: {type.languageLevel}</span>
                <span>•</span>
                <span>Style: {type.displayStyle}</span>
                <span>•</span>
                <span>Report: {type.reportStyle}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/assessment-types/${type.id}`)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/assessment-types/${type.id}`)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(type.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {!type.isDefault && (
                  <button
                    onClick={() => setAsDefault(type.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              {type._count?.assessmentSessions && type._count.assessmentSessions > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {type._count.assessmentSessions} active session{type._count.assessmentSessions !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {assessmentTypes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Types</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first assessment type</p>
          <button
            onClick={() => router.push('/admin/assessment-types/new')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Assessment Type
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Assessment Type</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this assessment type? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteAssessmentType(deleteConfirm)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
