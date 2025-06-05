'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

interface NotificationFiltersProps {
  currentFilters: {
    type: string;
    status: string;
    priority: string;
  };
}

export function NotificationFilters({ currentFilters }: NotificationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`/notifications?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/notifications');
  };

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'assessment_reminder', label: 'Reminders' },
    { value: 'report_ready', label: 'Reports' },
    { value: 'system_update', label: 'Updates' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'low', label: 'Low' },
  ];

  const hasActiveFilters = currentFilters.type !== 'all' || 
                          currentFilters.status !== 'all' || 
                          currentFilters.priority !== 'all';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          Filters
          {hasActiveFilters && (
            <Button onClick={clearAllFilters} variant="ghost" size="sm">
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Type</label>
          <div className="space-y-1">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('type', option.value)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                  currentFilters.type === option.value
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Status</label>
          <div className="space-y-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('status', option.value)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                  currentFilters.status === option.value
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">Priority</label>
          <div className="space-y-1">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter('priority', option.value)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                  currentFilters.priority === option.value
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
