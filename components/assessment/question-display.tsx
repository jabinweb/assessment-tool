import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface QuestionDisplayProps {
  question: {
    id: string;
    section: string;
    type: string;
    text: string;
    options: { id: string; text: string }[];
  };
  selectedAnswer: string;
  onAnswerChange: (value: string) => void;
}

export function QuestionDisplay({ 
  question, 
  selectedAnswer, 
  onAnswerChange 
}: QuestionDisplayProps) {
  // For aptitude or multiple choice questions
  if (question.type === 'multiple-choice') {
    return (
      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerChange}
        className="space-y-3"
      >
        {question.options.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors"
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label
              htmlFor={option.id}
              className="flex-1 cursor-pointer py-2 text-base"
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }
  
  // For Likert scale questions (personality assessment)
  if (question.type === 'likert') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between text-sm mb-2 px-4">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button
              key={value}
              type="button"
              variant={selectedAnswer === value.toString() ? "default" : "outline"}
              className="h-12 w-12 rounded-full"
              onClick={() => onAnswerChange(value.toString())}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  // For interest assessment (RIASEC-based)
  if (question.type === 'preference') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={selectedAnswer === '0' ? "default" : "outline"}
            className="py-6"
            onClick={() => onAnswerChange('0')}
          >
            Dislike
          </Button>
          <Button
            type="button"
            variant={selectedAnswer === '1' ? "default" : "outline"}
            className="py-6"
            onClick={() => onAnswerChange('1')}
          >
            Neutral
          </Button>
          <Button
            type="button"
            variant={selectedAnswer === '2' ? "default" : "outline"}
            className="py-6"
            onClick={() => onAnswerChange('2')}
          >
            Like
          </Button>
        </div>
      </div>
    );
  }
  
  // Fallback for unknown question types
  return (
    <div className="p-4 border rounded-md bg-secondary/50">
      <p>This question type is not supported.</p>
    </div>
  );
}