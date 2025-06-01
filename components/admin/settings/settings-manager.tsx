'use client'

import { useState } from 'react'
import { Save, RefreshCw, Database, Mail, Clock, Sliders, Shield, Download } from 'lucide-react'

interface SettingsData {
  systemStats: {
    totalQuestions: number
    totalUsers: number
    questionsBySection: Array<{
      section: string
      _count: { id: number }
    }>
  }
  assessmentSettings: {
    scoringWeights: {
      aptitude: number
      personality: number
      interest: number
    }
    timeouts: {
      sessionTimeout: number
      assessmentTimeout: number
    }
    features: {
      allowRetakes: boolean
      showProgressBar: boolean
      randomizeQuestions: boolean
      emailNotifications: boolean
    }
  }
}

interface SettingsManagerProps {
  data: SettingsData
}

export function SettingsManager({ data }: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState('assessment')
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(data.assessmentSettings)

  const tabs = [
    { id: 'assessment', label: 'Assessment', icon: Sliders },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWeightChange = (section: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      scoringWeights: {
        ...prev.scoringWeights,
        [section]: value
      }
    }))
  }

  const handleFeatureToggle = (feature: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }))
  }

  const handleTimeoutChange = (type: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      timeouts: {
        ...prev.timeouts,
        [type]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-full">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-3xl font-bold text-gray-900">{data.systemStats.totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-full">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{data.systemStats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-full">
              <Sliders className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sections</p>
              <p className="text-3xl font-bold text-gray-900">{data.systemStats.questionsBySection.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'assessment' && (
            <div className="space-y-8">
              {/* Scoring Weights */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Weights</h3>
                <div className="space-y-4">
                  {Object.entries(settings.scoringWeights).map(([section, weight]) => (
                    <div key={section} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 capitalize">
                        {section} Weight
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={weight}
                          onChange={(e) => handleWeightChange(section, parseInt(e.target.value))}
                          className="w-32"
                        />
                        <span className="text-sm font-medium text-gray-900 w-12">{weight}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeouts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Timeouts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.timeouts.sessionTimeout}
                      onChange={(e) => handleTimeoutChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assessment Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.timeouts.assessmentTimeout}
                      onChange={(e) => handleTimeoutChange('assessmentTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Features</h3>
                <div className="space-y-4">
                  {Object.entries(settings.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <button
                        onClick={() => handleFeatureToggle(feature, !enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Configuration</h3>
              <p className="text-gray-500">Configure SMTP settings and email templates</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
              <p className="text-gray-500">Manage password policies and access controls</p>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Database Backup</h3>
                <p className="text-gray-500 mb-4">Export and backup your assessment data</p>
                <div className="flex justify-center gap-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Users
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Reports
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Questions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        {activeTab === 'assessment' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
