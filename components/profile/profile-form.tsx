'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { User, School, Mail, Settings, Globe, Save, ArrowLeft, Shield, Calendar, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    age: number | null;
    role: string;
    image: string | null;
    gradeLevel: string | null;
    schoolName: string | null;
    counselorEmail: string | null;
    parentEmail: string | null;
    educationLevel: string | null;
    targetAudience: string | null;
    assessmentProfile: string | null;
    preferredLanguage: string | null;
    createdAt: Date | string;
    [key: string]: any;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || '',
    gradeLevel: user.gradeLevel || '',
    schoolName: user.schoolName || '',
    counselorEmail: user.counselorEmail || '',
    parentEmail: user.parentEmail || '',
    educationLevel: user.educationLevel || '',
    targetAudience: user.targetAudience || '',
    assessmentProfile: user.assessmentProfile || '',
    preferredLanguage: user.preferredLanguage || 'en'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age.toString()) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate profile completion and strength
  const calculateProfileStrength = () => {
    const fields = [
      { key: 'name', weight: 15, required: true },
      { key: 'age', weight: 10, required: false },
      { key: 'educationLevel', weight: 15, required: true },
      { key: 'targetAudience', weight: 15, required: true },
      { key: 'gradeLevel', weight: 10, required: false },
      { key: 'schoolName', weight: 10, required: false },
      { key: 'parentEmail', weight: 8, required: false },
      { key: 'counselorEmail', weight: 7, required: false },
      { key: 'assessmentProfile', weight: 10, required: false }
    ];

    let totalScore = 0;
    let completedFields = 0;
    let requiredFieldsCompleted = 0;
    let totalRequiredFields = 0;

    fields.forEach(field => {
      const value = formData[field.key as keyof typeof formData];
      const isCompleted = value && value.toString().trim() !== '';
      
      if (field.required) {
        totalRequiredFields++;
        if (isCompleted) requiredFieldsCompleted++;
      }
      
      if (isCompleted) {
        totalScore += field.weight;
        completedFields++;
      }
    });

    const completionPercentage = Math.round((totalScore / 100) * 100);
    const requiredCompletion = totalRequiredFields > 0 ? (requiredFieldsCompleted / totalRequiredFields) * 100 : 100;

    let strengthLevel = 'Weak';
    let strengthColor = 'text-red-500';
    let strengthBgColor = 'bg-red-50';
    let strengthBorderColor = 'border-red-200';

    if (completionPercentage >= 80) {
      strengthLevel = 'Excellent';
      strengthColor = 'text-green-500';
      strengthBgColor = 'bg-green-50';
      strengthBorderColor = 'border-green-200';
    } else if (completionPercentage >= 60) {
      strengthLevel = 'Good';
      strengthColor = 'text-blue-500';
      strengthBgColor = 'bg-blue-50';
      strengthBorderColor = 'border-blue-200';
    } else if (completionPercentage >= 40) {
      strengthLevel = 'Fair';
      strengthColor = 'text-yellow-500';
      strengthBgColor = 'bg-yellow-50';
      strengthBorderColor = 'border-yellow-200';
    }

    return {
      percentage: completionPercentage,
      level: strengthLevel,
      color: strengthColor,
      bgColor: strengthBgColor,
      borderColor: strengthBorderColor,
      completedFields,
      totalFields: fields.length,
      requiredCompletion
    };
  };

  const profileStrength = calculateProfileStrength();

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'education', label: 'Education', icon: School },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.name || 'Welcome, Student'}
            </h1>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
            </span>
          </div>
        </div>

        {/* Profile Strength Card */}
        <div className={`mb-8 p-6 rounded-2xl border-2 ${profileStrength.bgColor} ${profileStrength.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${profileStrength.bgColor}`}>
                <TrendingUp className={`h-6 w-6 ${profileStrength.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Strength</h3>
                <p className="text-gray-600 text-sm">Complete your profile for better career recommendations</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${profileStrength.color} mb-1`}>
                {profileStrength.percentage}%
              </div>
              <div className={`text-sm font-medium ${profileStrength.color}`}>
                {profileStrength.level}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall Completion</span>
              <span>{profileStrength.completedFields} of {profileStrength.totalFields} fields</span>
            </div>
            <Progress value={profileStrength.percentage} className="h-3" />
            
            {profileStrength.percentage < 100 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>
                  {profileStrength.percentage < 60 
                    ? "Complete more fields to improve career matching accuracy"
                    : "Add remaining details for the best assessment experience"
                  }
                </span>
              </div>
            )}
            
            {profileStrength.percentage >= 80 && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Your profile is well-optimized for accurate career recommendations!</span>
              </div>
            )}
          </div>
        </div>

        {/* Completion Insights */}
        {profileStrength.percentage < 100 && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Wins to Improve Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {!formData.name && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Add Your Name</span>
                  </div>
                  <p className="text-sm text-blue-700">Help us personalize your experience</p>
                </div>
              )}
              
              {!formData.educationLevel && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <School className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Education Level</span>
                  </div>
                  <p className="text-sm text-green-700">Essential for career matching</p>
                </div>
              )}
              
              {!formData.assessmentProfile && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Assessment Preference</span>
                  </div>
                  <p className="text-sm text-purple-700">Customize your assessment experience</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-2 rounded-xl shadow-sm border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <p className="text-gray-600">Update your basic personal details</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      placeholder="Enter your age"
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel" className="text-sm font-medium text-gray-700">
                      Education Level
                    </Label>
                    <Select
                      value={formData.educationLevel}
                      onValueChange={(value) => handleChange('educationLevel', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school">School Student</SelectItem>
                        <SelectItem value="college">College Student</SelectItem>
                        <SelectItem value="professional">Working Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-700">
                      Target Audience
                    </Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) => handleChange('targetAudience', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="school_student">School Student (13-18)</SelectItem>
                        <SelectItem value="college_student">College Student (18-22)</SelectItem>
                        <SelectItem value="working_professional">Working Professional (22+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <School className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Educational Information</h2>
                    <p className="text-gray-600">Provide details about your educational background</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel" className="text-sm font-medium text-gray-700">
                      Grade Level / Class
                    </Label>
                    <Input
                      id="gradeLevel"
                      type="text"
                      value={formData.gradeLevel}
                      onChange={(e) => handleChange('gradeLevel', e.target.value)}
                      placeholder="e.g., 10th Grade, Bachelor's, etc."
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">
                      School/College/University Name
                    </Label>
                    <Input
                      id="schoolName"
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => handleChange('schoolName', e.target.value)}
                      placeholder="Enter your institution name"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                    <p className="text-gray-600">Emergency contacts and counselor information</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="h-12 bg-gray-50 text-gray-500"
                    />
                    <p className="text-sm text-gray-500">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="parentEmail" className="text-sm font-medium text-gray-700">
                        Parent/Guardian Email
                      </Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={(e) => handleChange('parentEmail', e.target.value)}
                        placeholder="parent@example.com"
                        className="h-12"
                      />
                      <p className="text-sm text-gray-500">
                        For school students (optional)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="counselorEmail" className="text-sm font-medium text-gray-700">
                        Counselor Email
                      </Label>
                      <Input
                        id="counselorEmail"
                        type="email"
                        value={formData.counselorEmail}
                        onChange={(e) => handleChange('counselorEmail', e.target.value)}
                        placeholder="counselor@school.edu"
                        className="h-12"
                      />
                      <p className="text-sm text-gray-500">
                        School/career counselor (optional)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Settings className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Assessment Preferences</h2>
                    <p className="text-gray-600">Customize your assessment experience</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="assessmentProfile" className="text-sm font-medium text-gray-700">
                      Assessment Complexity
                    </Label>
                    <Select
                      value={formData.assessmentProfile}
                      onValueChange={(value) => handleChange('assessmentProfile', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select assessment complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - Simplified questions and interface</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Standard assessment</SelectItem>
                        <SelectItem value="advanced">Advanced - Comprehensive evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage" className="text-sm font-medium text-gray-700">
                      Preferred Language
                    </Label>
                    <Select
                      value={formData.preferredLanguage}
                      onValueChange={(value) => handleChange('preferredLanguage', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border p-6">
            <div className="text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${profileStrength.percentage >= 60 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span>
                  Profile strength: {profileStrength.level} ({profileStrength.percentage}% complete)
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
