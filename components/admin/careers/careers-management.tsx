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
  Briefcase,
  TrendingUp,
  MapPin,
  DollarSign
} from 'lucide-react';

interface Career {
  id: string;
  title: string;
  description: string;
  industry: string;
  educationLevel: string;
  salaryRange: any;
  growthOutlook: string;
  workEnvironment: string;
  workStyle: string;
  targetAudience: string[];
  schoolSubjects: string[];
  collegePrograms: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Filters {
  industry: string;
  targetAudience: string;
  educationLevel: string;
  isActive: string;
  search: string;
}

interface Props {
  initialCareers: Career[];
}

export function CareersManagement({ initialCareers }: Props) {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>(initialCareers);
  const [loading, setLoading] = useState(false);
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    industry: '',
    targetAudience: '',
    educationLevel: '',
    isActive: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: initialCareers.length,
    totalPages: Math.ceil(initialCareers.length / 20)
  });

  useEffect(() => {
    if (Object.values(filters).some(filter => filter !== '')) {
      fetchCareers();
    } else {
      setCareers(initialCareers);
    }
  }, [filters, pagination.page]);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/admin/careers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCareers(data.careers);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCareer = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchCareers();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  };

  const toggleCareerSelection = (careerId: string) => {
    setSelectedCareers(prev => 
      prev.includes(careerId)
        ? prev.filter(id => id !== careerId)
        : [...prev, careerId]
    );
  };

  const selectAllCareers = () => {
    setSelectedCareers(
      selectedCareers.length === careers.length 
        ? [] 
        : careers.map(c => c.id)
    );
  };

  const getIndustryColor = (industry: string) => {
    const colors: Record<string, string> = {
      technology: 'bg-blue-100 text-blue-800',
      healthcare: 'bg-green-100 text-green-800',
      finance: 'bg-purple-100 text-purple-800',
      education: 'bg-yellow-100 text-yellow-800',
      engineering: 'bg-red-100 text-red-800',
      creative: 'bg-pink-100 text-pink-800',
      business: 'bg-indigo-100 text-indigo-800',
      science: 'bg-teal-100 text-teal-800'
    };
    return colors[industry] || 'bg-gray-100 text-gray-800';
  };

  const getGrowthIcon = (outlook: string) => {
    switch (outlook) {
      case 'high': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'moderate': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'stable': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Careers</h2>
        <button
          onClick={() => router.push('/admin/careers/new')}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Career
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search careers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Industries</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="engineering">Engineering</option>
                <option value="creative">Creative</option>
                <option value="business">Business</option>
                <option value="science">Science</option>
              </select>

              <select
                value={filters.educationLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, educationLevel: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Education Levels</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
              </select>

              <select
                value={filters.targetAudience}
                onChange={(e) => setFilters(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Audiences</option>
                <option value="school_student">School Student</option>
                <option value="college_student">College Student</option>
                <option value="working_professional">Working Professional</option>
              </select>

              <select
                value={filters.isActive}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {careers.map((career) => (
          <div key={career.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => toggleCareerSelection(career.id)}>
                      {selectedCareers.includes(career.id) ? (
                        <CheckSquare className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">{career.title}</h3>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getIndustryColor(career.industry)}`}>
                    {career.industry.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getGrowthIcon(career.growthOutlook)}
                  {career.isActive ? (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ) : (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{career.description}</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="h-4 w-4" />
                  <span>{career.educationLevel.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{career.workEnvironment}</span>
                </div>
                {career.salaryRange && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {career.salaryRange.min && career.salaryRange.max
                        ? `$${career.salaryRange.min.toLocaleString()} - $${career.salaryRange.max.toLocaleString()}`
                        : 'Salary varies'
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {career.targetAudience.map(audience => (
                  <span key={audience} className="inline-block px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                    {audience.replace('_', ' ')}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/careers/${career.id}`)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/careers/${career.id}`)}
                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(career.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs text-gray-400">
                  {career.schoolSubjects.length + career.collegePrograms.length} programs
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {careers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Careers Found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first career</p>
          <button
            onClick={() => router.push('/admin/careers/new')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Career
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Career</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this career? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteCareer(deleteConfirm)}
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
