import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Career {
  title: string;
  match: number;
  description: string;
}

interface CareerMatchesProps {
  careers: Career[];
}

export function CareerMatches({ careers }: CareerMatchesProps) {
  // Sort careers by match percentage (highest first)
  const sortedCareers = [...careers].sort((a, b) => b.match - a.match);
  
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground">
        Based on your aptitude, personality traits, and interests, the following career paths may be well-suited for you.
        Each match percentage indicates how well your profile aligns with typical traits for success in that career.
      </p>
      
      <div className="space-y-6">
        {sortedCareers.map((career, index) => (
          <div key={index} className="bg-card p-6 rounded-lg border">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <h3 className="text-xl font-semibold">{career.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Match:</span>
                <span className="font-bold">{career.match}%</span>
              </div>
            </div>
            
            <Progress value={career.match} className="h-2 mb-4" />
            
            <p className="text-muted-foreground mb-4">{career.description}</p>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                asChild
              >
                <a 
                  href={`https://www.onetonline.org/find/quick?s=${encodeURIComponent(career.title)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Learn More <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-secondary/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> These career suggestions are based on your assessment results and should be used as a
          starting point for exploration. Consider conducting additional research, speaking with professionals in these
          fields, or consulting with a career counselor for more personalized guidance.
        </p>
      </div>
    </div>
  );
}