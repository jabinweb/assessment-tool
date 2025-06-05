'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Target, Wrench, Search, Palette, Users, TrendingUp, Building } from 'lucide-react';

interface InterestResultsProps {
  assessmentData: {
    answers: any[];
    sectionStats: any;
    targetAudience: string;
  };
}

export function InterestResults({ assessmentData }: InterestResultsProps) {
  // Mock RIASEC data - replace with actual calculation
  const riasecScores = {
    realistic: 45,
    investigative: 88,
    artistic: 72,
    social: 85,
    enterprising: 58,
    conventional: 42
  };

  const interestAnswers = assessmentData.answers.filter(
    answer => answer.question.section === 'interest'
  );

  // Get top 3 interests
  const topInterests = Object.entries(riasecScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Prepare chart data
  const pieChartData = Object.entries(riasecScores).map(([code, score], index) => ({
    name: getRiasecName(code),
    value: score,
    code: code.toUpperCase(),
    color: getRiasecColor(code)
  }));

  const radarChartData = Object.entries(riasecScores).map(([code, score]) => ({
    code: code.charAt(0).toUpperCase(),
    name: getRiasecName(code),
    score,
    fullMark: 100
  }));

  const careerClusterData = [
    { cluster: 'STEM', score: (riasecScores.realistic + riasecScores.investigative) / 2 },
    { cluster: 'Creative Arts', score: riasecScores.artistic },
    { cluster: 'People & Service', score: riasecScores.social },
    { cluster: 'Business', score: riasecScores.enterprising },
    { cluster: 'Data & Analysis', score: riasecScores.conventional }
  ].sort((a, b) => b.score - a.score);

  function getRiasecName(code: string) {
    const names = {
      realistic: 'Realistic',
      investigative: 'Investigative', 
      artistic: 'Artistic',
      social: 'Social',
      enterprising: 'Enterprising',
      conventional: 'Conventional'
    };
    return names[code as keyof typeof names];
  }

  function getRiasecColor(code: string) {
    const colors = {
      realistic: '#8b5cf6',
      investigative: '#3b82f6',
      artistic: '#f59e0b',
      social: '#10b981',
      enterprising: '#ef4444',
      conventional: '#6b7280'
    };
    return colors[code as keyof typeof colors];
  }

  function getRiasecDescription(code: string) {
    const descriptions = {
      realistic: 'Hands-on work with tools, machines, and physical materials',
      investigative: 'Research, analysis, and problem-solving activities',
      artistic: 'Creative expression and innovative design work',
      social: 'Helping others and working in service-oriented roles',
      enterprising: 'Leadership, sales, and business development',
      conventional: 'Organized, detail-oriented administrative work'
    };
    return descriptions[code as keyof typeof descriptions];
  }

  function getRiasecIcon(code: string) {
    const icons = {
      realistic: <Wrench className="h-5 w-5" />,
      investigative: <Search className="h-5 w-5" />,
      artistic: <Palette className="h-5 w-5" />,
      social: <Users className="h-5 w-5" />,
      enterprising: <TrendingUp className="h-5 w-5" />,
      conventional: <Building className="h-5 w-5" />
    };
    return icons[code as keyof typeof icons];
  }

  return (
    <div className="space-y-6">
      {/* Interest Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Interest Profile Overview
          </CardTitle>
          <CardDescription>
            Based on Holland's RIASEC career interest model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{topInterests[0][0].toUpperCase()}</div>
              <div className="text-sm font-medium">{getRiasecName(topInterests[0][0])}</div>
              <div className="text-2xl font-bold text-gray-800">{topInterests[0][1]}%</div>
              <Badge className="mt-1">Primary Interest</Badge>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{topInterests[1][0].toUpperCase()}</div>
              <div className="text-sm font-medium">{getRiasecName(topInterests[1][0])}</div>
              <div className="text-2xl font-bold text-gray-800">{topInterests[1][1]}%</div>
              <Badge variant="secondary" className="mt-1">Secondary</Badge>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{topInterests[2][0].toUpperCase()}</div>
              <div className="text-sm font-medium">{getRiasecName(topInterests[2][0])}</div>
              <div className="text-2xl font-bold text-gray-800">{topInterests[2][1]}%</div>
              <Badge variant="outline" className="mt-1">Tertiary</Badge>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              Your Interest Code: <span className="text-blue-600 font-bold">
                {topInterests.map(([code]) => code.charAt(0).toUpperCase()).join('')}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              This combination suggests careers in research, technology, and people-focused roles
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RIASEC Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Interest Distribution</CardTitle>
            <CardDescription>Your interest levels across all RIASEC categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ code, value }) => `${code}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Interest Level']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RIASEC Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Interest Profile</CardTitle>
            <CardDescription>Visual representation of your interest strengths</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="code" fontSize={14} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={false}
                />
                <Radar
                  name="Interest"
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`, 
                    props.payload.name
                  ]} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Career Clusters */}
      <Card>
        <CardHeader>
          <CardTitle>Career Cluster Alignment</CardTitle>
          <CardDescription>How your interests align with major career clusters</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={careerClusterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cluster" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Alignment']} />
              <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed RIASEC Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Interest Analysis</CardTitle>
          <CardDescription>Understanding what each interest area means for your career</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(riasecScores)
              .sort(([,a], [,b]) => b - a)
              .map(([code, score]) => (
                <div key={code} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${getRiasecColor(code)}20` }}>
                        <div style={{ color: getRiasecColor(code) }}>
                          {getRiasecIcon(code)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{getRiasecName(code)} ({code.toUpperCase()})</h4>
                        <p className="text-sm text-gray-600">{getRiasecDescription(code)}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={score > 80 ? 'default' : score > 60 ? 'secondary' : 'outline'}
                      className="text-lg px-3 py-1"
                    >
                      {score}%
                    </Badge>
                  </div>
                  <Progress value={score} className="h-2 mb-2" />
                  <div className="text-sm text-gray-700">
                    {score > 80 && 'Strong interest - This is a primary area of focus for you'}
                    {score > 60 && score <= 80 && 'Moderate interest - You enjoy some activities in this area'}
                    {score > 40 && score <= 60 && 'Average interest - Some appeal but not a primary focus'}
                    {score <= 40 && 'Lower interest - May not be energizing for daily work'}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Interest-Based Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Based on Your Interests</CardTitle>
          <CardDescription>Recommendations for exploration and development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-3">Explore These Areas</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Data science and research methodology
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Human-centered design projects
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Community service and volunteering
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Creative problem-solving workshops
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-700 mb-3">Development Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Join research or innovation clubs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Participate in hackathons or competitions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Shadow professionals in your interest areas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Take on leadership roles in group projects
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}