'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreateQuestionButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/admin/questions/create')}
      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Question
    </button>
  );
}
