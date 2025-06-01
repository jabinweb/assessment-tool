import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AptitudeResultsProps {
  scores: Record<string, number>;
}

export function AptitudeResults({ scores }: AptitudeResultsProps) {
  // Transform scores object into array for chart
  const chartData = Object.entries(scores).map(([name, value]) => ({
    name: formatAptitudeName(name),
    value,
  }));
  
  // Get overall score (average)
  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / 
    Object.values(scores).length
  );
  
  // Get strengths (scores >= 70)
  const strengths = Object.entries(scores)
    .filter(([_, score]) => score >= 70)
    .map(([name, _]) => formatAptitudeName(name));
  
  // Get areas for improvement (scores < 50)
  const improvements = Object.entries(scores)
    .filter(([_, score]) => score < 50)
    .map(([name, _]) => formatAptitudeName(name));
  
  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Overall Aptitude Score</h3>
        <div className="flex items-center gap-4">
          <Progress value={overallScore} className="flex-1" />
          <span className="text-xl font-bold w-16 text-right">{overallScore}/100</span>
        </div>
      </div>
      
      {/* Aptitude Chart */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Aptitude Breakdown</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(scores).map(([name, score]) => (
          <Card key={name} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{formatAptitudeName(name)}</h4>
                <span className="font-bold">{score}/100</span>
              </div>
              <Progress value={score} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                {getAptitudeDescription(name, score)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Strengths</h3>
          {strengths.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Continue developing your skills to unlock your key strengths.
            </p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
          {improvements.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Great job! You're performing well across all aptitude areas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions for formatting and descriptions
function formatAptitudeName(name: string): string {
  const formattedNames: Record<string, string> = {
    'verbal': 'Verbal Reasoning',
    'numerical': 'Numerical Reasoning',
    'abstract': 'Abstract Reasoning',
    'spatial': 'Spatial Reasoning',
    'logical': 'Logical Reasoning',
    'mechanical': 'Mechanical Reasoning',
  };
  
  return formattedNames[name] || name;
}

function getAptitudeDescription(name: string, score: number): string {
  // Basic descriptions based on score ranges
  if (score >= 80) {
    return `Excellent aptitude in this area. This is a significant strength for you.`;
  } else if (score >= 60) {
    return `Good aptitude level. You have solid capabilities in this area.`;
  } else if (score >= 40) {
    return `Average aptitude. With practice, you can improve in this area.`;
  } else {
    return `This may be challenging for you. Consider focused practice to develop this skill.`;
  }
}