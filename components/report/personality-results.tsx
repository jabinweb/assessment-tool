'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Heart, Users, Lightbulb, Shield, Zap } from 'lucide-react';

interface PersonalityResultsProps {
  assessmentData: {
    answers: any[];
    sectionStats: any;
    targetAudience: string;
  };
}

export function PersonalityResults({ assessmentData }: PersonalityResultsProps) {
  // Mock Big Five personality data - replace with actual calculation
  const personalityTraits = {
    openness: 82,
    conscientiousness: 75,
    extraversion: 68,
    agreeableness: 89,
    neuroticism: 25 // Lower is better for neuroticism
  };

  const personalityAnswers = assessmentData.answers.filter(
    answer => answer.question.section === 'personality'
  );

  // Prepare chart data
  const traitData = Object.entries(personalityTraits).map(([trait, score]) => ({
    trait: trait.charAt(0).toUpperCase() + trait.slice(1),
    score,
    description: getTraitDescription(trait)
  }));

  const workStyleData = [
    { name: 'Team Player', value: 85, color: '#3b82f6' },
    { name: 'Independent', value: 15, color: '#e5e7eb' }
  ];

  const leadershipStyleData = [
    { name: 'Collaborative', value: personalityTraits.agreeableness },
    { name: 'Decisive', value: personalityTraits.conscientiousness },
    { name: 'Innovative', value: personalityTraits.openness },
    { name: 'Energetic', value: personalityTraits.extraversion }
  ];

  function getTraitDescription(trait: string) {
    const descriptions = {
      openness: 'Creativity and willingness to try new experiences',
      conscientiousness: 'Organization, responsibility, and self-discipline',
      extraversion: 'Social energy and comfort with interaction',
      agreeableness: 'Cooperation, trust, and consideration for others',
      neuroticism: 'Emotional stability and stress management'
    };
    return descriptions[trait as keyof typeof descriptions];
  }

  function getTraitInsight(trait: string, score: number) {
    const insights = {
      openness: score > 75 ? 'Highly creative and open to new ideas' : score > 50 ? 'Balanced approach to new experiences' : 'Prefers familiar and proven methods',
      conscientiousness: score > 75 ? 'Very organized and reliable' : score > 50 ? 'Generally well-organized' : 'More flexible with structure',
      extraversion: score > 75 ? 'Highly social and energetic' : score > 50 ? 'Comfortable in social situations' : 'Prefers quieter environments',
      agreeableness: score > 75 ? 'Very cooperative and trusting' : score > 50 ? 'Generally cooperative' : 'More competitive and skeptical',
      neuroticism: score < 30 ? 'Very emotionally stable' : score < 50 ? 'Generally stable under pressure' : 'May experience stress more intensely'
    };
    return insights[trait as keyof typeof insights];
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Personality Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-500" />
            Personality Profile Overview
          </CardTitle>
          <CardDescription>
            Based on the Big Five personality model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(personalityTraits).map(([trait, score], index) => (
              <div key={trait} className="text-center">
                <div className="mb-2">
                  {trait === 'openness' && <Lightbulb className="h-8 w-8 mx-auto text-blue-500" />}
                  {trait === 'conscientiousness' && <Shield className="h-8 w-8 mx-auto text-green-500" />}
                  {trait === 'extraversion' && <Zap className="h-8 w-8 mx-auto text-yellow-500" />}
                  {trait === 'agreeableness' && <Users className="h-8 w-8 mx-auto text-purple-500" />}
                  {trait === 'neuroticism' && <Heart className="h-8 w-8 mx-auto text-red-500" />}
                </div>
                <h4 className="font-medium capitalize text-sm">{trait}</h4>
                <div className="text-2xl font-bold text-gray-900">{score}%</div>
                <Progress value={score} className="h-2 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Traits Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Personality Trait Profile</CardTitle>
            <CardDescription>Your scores across the Big Five dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={traitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="trait" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Work Style Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Work Style Preference</CardTitle>
            <CardDescription>How you prefer to work with others</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workStyleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workStyleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leadership Potential */}
      <Card>
        <CardHeader>
          <CardTitle>Leadership Potential</CardTitle>
          <CardDescription>Your leadership style based on personality traits</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={leadershipStyleData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trait Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Trait Analysis</CardTitle>
          <CardDescription>What your personality profile means for your career</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(personalityTraits).map(([trait, score]) => (
              <div key={trait} className="border-l-4 border-purple-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold capitalize">{trait}</h4>
                  <Badge variant={score > 75 ? 'default' : score > 50 ? 'secondary' : 'outline'}>
                    {score}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {getTraitDescription(trait)}
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {getTraitInsight(trait, score)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Career Implications */}
      <Card>
        <CardHeader>
          <CardTitle>Career Implications</CardTitle>
          <CardDescription>How your personality traits align with different work environments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-3">Ideal Work Environments</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Collaborative team settings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Creative and innovative projects
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Supportive and cooperative culture
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Structured but flexible environment
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">Natural Strengths</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Building relationships and trust
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Creative problem-solving
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Maintaining calm under pressure
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Organizing and planning
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}