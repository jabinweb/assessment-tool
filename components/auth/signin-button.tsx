'use client';

import { handleSignIn } from '@/lib/auth-actions';

export function SignInButton() {
  const handleFormSubmit = async (formData: FormData) => {
    await handleSignIn();
  };

  return (
    <form action={handleFormSubmit}>
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
    </form>
  );
}
