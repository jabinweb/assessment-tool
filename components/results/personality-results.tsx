import { Progress } from '@/components/ui/progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface PersonalityResultsProps {
  scores: Record<string, number>;
  summary: string;
}

export function PersonalityResults({ scores, summary }: PersonalityResultsProps) {
  // Transform scores for radar chart
  const radarData = Object.entries(scores).map(([trait, score]) => ({
    trait: formatPersonalityTrait(trait),
    value: score,
  }));
  
  return (
    <div className="space-y-8">
      {/* Personality Radar Chart */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Personality Profile</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="trait" />
              <Radar
                name="Personality"
                dataKey="value"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Personality Summary */}
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Your Personality Summary</h3>
        <p className="text-muted-foreground">{summary}</p>
      </div>
      
      {/* Detailed Trait Breakdown */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Personality Traits Breakdown</h3>
        
        {Object.entries(scores).map(([trait, score]) => (
          <div key={trait} className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{formatPersonalityTrait(trait)}</h4>
              <span>{score}/100</span>
            </div>
            <Progress value={score} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {getTraitDescription(trait, score)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function formatPersonalityTrait(trait: string): string {
  const formattedTraits: Record<string, string> = {
    'openness': 'Openness',
    'conscientiousness': 'Conscientiousness',
    'extraversion': 'Extraversion',
    'agreeableness': 'Agreeableness',
    'neuroticism': 'Emotional Stability',
  };
  
  return formattedTraits[trait] || trait;
}

function getTraitDescription(trait: string, score: number): string {
  const traitDescriptions: Record<string, Record<string, string>> = {
    'openness': {
      high: 'You\'re curious, imaginative, and open to new experiences. You enjoy exploring creative pursuits and abstract concepts.',
      medium: 'You appreciate a balance between tradition and new experiences. You\'re moderately open to exploring new ideas.',
      low: 'You prefer familiarity and convention. You tend to be practical and focused on concrete rather than abstract thinking.'
    },
    'conscientiousness': {
      high: 'You\'re organized, responsible, and detail-oriented. You prefer planning ahead and following through on commitments.',
      medium: 'You balance structure with flexibility. You\'re reasonably organized but can adapt to spontaneity when needed.',
      low: 'You prefer a flexible, spontaneous approach to life. You may find rigid schedules and detailed planning restrictive.'
    },
    'extraversion': {
      high: 'You\'re outgoing, energetic, and draw energy from social interactions. You enjoy being around others and seek stimulation.',
      medium: 'You enjoy social settings but also value your alone time. You\'re comfortable in groups but don\'t always seek them out.',
      low: 'You\'re more reserved and prefer deeper one-on-one connections. You recharge through quiet, reflective activities.'
    },
    'agreeableness': {
      high: 'You\'re compassionate, cooperative, and value harmony. You prioritize others\' needs and avoid conflict.',
      medium: 'You balance cooperation with standing up for yourself. You\'re generally warm but can be firm when necessary.',
      low: 'You\'re direct, straightforward, and prioritize logic over emotional concerns. You\'re comfortable with healthy disagreement.'
    },
    'neuroticism': {
      high: 'You\'re emotionally stable, calm under pressure, and generally optimistic. You recover quickly from setbacks.',
      medium: 'You experience normal emotional ups and downs. You\'re reasonably resilient but can be affected by significant stress.',
      low: 'You experience emotions intensely and may be more sensitive to stress. You\'re often self-reflective and perceptive.'
    }
  };
  
  let level;
  if (score >= 70) level = 'high';
  else if (score >= 40) level = 'medium';
  else level = 'low';
  
  return traitDescriptions[trait]?.[level] || 'No description available.';
}