'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    age: user.age || '',
    gradeLevel: user.gradeLevel || '',
    schoolName: user.schoolName || '',
    counselorEmail: user.counselorEmail || '',
    parentEmail: user.parentEmail || '',
    preferredLanguage: user.preferredLanguage || 'en'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Refresh the page after a delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {message && (
        <div className={`p-4 rounded-md flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="13"
              max="25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
          
          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select grade level</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
              <option value="college_freshman">College Freshman</option>
              <option value="college_sophomore">College Sophomore</option>
              <option value="college_junior">College Junior</option>
              <option value="college_senior">College Senior</option>
              <option value="graduate">Graduate Student</option>
            </select>
          </div>

          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
              School/Institution Name
            </label>
            <input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your school or institution name"
            />
          </div>

          <div>
            <label htmlFor="counselorEmail" className="block text-sm font-medium text-gray-700 mb-2">
              School Counselor Email
            </label>
            <input
              type="email"
              id="counselorEmail"
              name="counselorEmail"
              value={formData.counselorEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="counselor@school.edu"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: For sharing assessment results</p>
          </div>

          <div>
            <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Email
            </label>
            <input
              type="email"
              id="parentEmail"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="parent@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: For sharing assessment results</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Account Created:</span>
            <span className="ml-2 text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Account Type:</span>
            <span className="ml-2 text-gray-600 capitalize">{user.role}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email Verified:</span>
            <span className="ml-2 text-gray-600">
              {user.emailVerified ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Active:</span>
            <span className="ml-2 text-gray-600">
              {user.lastActiveAt 
                ? new Date(user.lastActiveAt).toLocaleDateString()
                : 'Not recorded'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
