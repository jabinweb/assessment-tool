'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Brain, TrendingUp, Clock, Target } from 'lucide-react';

interface AptitudeResultsProps {
  assessmentData: {
    answers: any[];
    sectionStats: any;
    targetAudience: string;
  };
}

export function AptitudeResults({ assessmentData }: AptitudeResultsProps) {
  // Calculate aptitude scores by subdomain
  const aptitudeAnswers = assessmentData.answers.filter(
    answer => answer.question.section === 'aptitude'
  );

  // Mock data for demonstration - replace with actual calculation
  const aptitudeScores = {
    numerical: 85,
    verbal: 78,
    logical: 92,
    spatial: 73,
    abstract: 80,
    mechanical: 67
  };

  const overallScore = Math.round(
    Object.values(aptitudeScores).reduce((sum, score) => sum + score, 0) / 
    Object.values(aptitudeScores).length
  );

  // Prepare chart data
  const barChartData = Object.entries(aptitudeScores).map(([domain, score]) => ({
    domain: domain.charAt(0).toUpperCase() + domain.slice(1),
    score,
    benchmark: 75 // Average benchmark
  }));

  const radarChartData = Object.entries(aptitudeScores).map(([domain, score]) => ({
    domain: domain.charAt(0).toUpperCase() + domain.slice(1),
    score,
    fullMark: 100
  }));

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Exceptional', color: 'text-green-600' };
    if (score >= 80) return { level: 'Strong', color: 'text-blue-600' };
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600' };
    if (score >= 60) return { level: 'Average', color: 'text-orange-600' };
    return { level: 'Developing', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Overall Aptitude Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Overall Aptitude Score
          </CardTitle>
          <CardDescription>
            Your cognitive abilities assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-4xl font-bold text-blue-600">{overallScore}%</div>
              <Badge className={getPerformanceLevel(overallScore).color}>
                {getPerformanceLevel(overallScore).level}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Questions Answered</div>
              <div className="text-2xl font-semibold">{aptitudeAnswers.length}</div>
            </div>
          </div>
          <Progress value={overallScore} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            You scored higher than {overallScore}% of test takers in your age group
          </p>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Aptitude Breakdown</CardTitle>
            <CardDescription>Performance across different cognitive domains</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="domain" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}%`, 
                    name === 'score' ? 'Your Score' : 'Benchmark'
                  ]}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cognitive Profile</CardTitle>
            <CardDescription>Your strengths across different thinking styles</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="domain" fontSize={12} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Domain Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Domain-Specific Analysis</CardTitle>
          <CardDescription>Detailed breakdown of your performance in each area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(aptitudeScores).map(([domain, score]) => {
              const performance = getPerformanceLevel(score);
              return (
                <div key={domain} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{domain} Reasoning</h4>
                    <Badge variant="outline" className={performance.color}>
                      {score}%
                    </Badge>
                  </div>
                  <Progress value={score} className="h-2 mb-2" />
                  <div className="text-sm text-gray-600">
                    {domain === 'numerical' && 'Ability to work with numbers and mathematical concepts'}
                    {domain === 'verbal' && 'Understanding and reasoning with written information'}
                    {domain === 'logical' && 'Pattern recognition and logical problem-solving'}
                    {domain === 'spatial' && 'Visualizing and manipulating objects in space'}
                    {domain === 'abstract' && 'Working with concepts and theoretical ideas'}
                    {domain === 'mechanical' && 'Understanding mechanical and physical principles'}
                  </div>
                  <div className="mt-2 text-xs">
                    <span className={performance.color}>
                      {performance.level} Performance
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Top Strength</span>
              </div>
              <p className="text-sm text-green-700">
                Logical Reasoning ({aptitudeScores.logical}%) - Excellent pattern recognition
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Time Efficiency</span>
              </div>
              <p className="text-sm text-blue-700">
                Average {Math.round(assessmentData.sectionStats.aptitude.timeSpent / aptitudeAnswers.length)} seconds per question
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Development Area</span>
              </div>
              <p className="text-sm text-yellow-700">
                Consider strengthening mechanical reasoning skills
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}