import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InterestResultsProps {
  scores: Record<string, number>;
  summary: string;
}

export function InterestResults({ scores, summary }: InterestResultsProps) {
  // Transform scores for chart
  const chartData = Object.entries(scores).map(([type, score]) => ({
    type: formatInterestType(type),
    score,
    fill: getInterestTypeColor(type),
  }));
  
  // Sort by score (highest first)
  chartData.sort((a, b) => b.score - a.score);
  
  return (
    <div className="space-y-8">
      {/* Interest Chart */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">RIASEC Interest Profile</h3>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                dataKey="type" 
                type="category" 
                width={100}
                tick={{ fontSize: 14 }}
              />
              <Tooltip />
              <Bar 
                dataKey="score" 
                radius={[0, 4, 4, 0]}
                background={{ fill: '#f5f5f5' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Interest Summary */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Your Interest Summary</h3>
        <p className="text-muted-foreground">{summary}</p>
      </div>
      
      {/* RIASEC Type Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(scores)
          .sort((a, b) => b[1] - a[1]) // Sort by score (highest first)
          .map(([type, score]) => (
            <div key={type} className="bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getInterestTypeColor(type) }}
                ></div>
                <h4 className="font-semibold">{formatInterestType(type)}</h4>
                <span className="ml-auto font-medium">{score}/100</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getInterestTypeDescription(type)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

// Helper functions
function formatInterestType(type: string): string {
  const types: Record<string, string> = {
    'realistic': 'Realistic',
    'investigative': 'Investigative',
    'artistic': 'Artistic',
    'social': 'Social',
    'enterprising': 'Enterprising',
    'conventional': 'Conventional',
  };
  
  return types[type] || type;
}

function getInterestTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'realistic': 'hsl(var(--chart-1))',
    'investigative': 'hsl(var(--chart-2))',
    'artistic': 'hsl(var(--chart-3))',
    'social': 'hsl(var(--chart-4))',
    'enterprising': 'hsl(var(--chart-5))',
    'conventional': 'hsl(var(--primary))',
  };
  
  return colors[type] || 'hsl(var(--primary))';
}

function getInterestTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'realistic': 'You enjoy working with your hands, tools, machines, or nature. You prefer practical, hands-on problem-solving and creating tangible results.',
    'investigative': 'You like to analyze, evaluate, and solve complex problems. You\'re drawn to intellectual challenges and scientific or research-oriented activities.',
    'artistic': 'You value self-expression, creativity, and aesthetics. You enjoy unstructured environments that allow for creative thinking and innovation.',
    'social': 'You enjoy working with and helping others. You\'re drawn to teaching, counseling, or providing service to people and communities.',
    'enterprising': 'You like to lead, persuade, and influence others. You\'re drawn to leadership roles, entrepreneurship, and achieving economic objectives.',
    'conventional': 'You enjoy organizing, managing data, and working with clear processes. You\'re detail-oriented and prefer structured environments with clear guidelines.',
  };
  
  return descriptions[type] || 'No description available.';
}