"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { QuestionSection } from '@/components/assessment/question-section';
import { QuestionDisplay } from '@/components/assessment/question-display';

type Question = {
  id: string;
  section: string;
  type: string;
  text: string;
  options: { id: string; text: string }[];
};

export default function QuestionPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState<string>('aptitude');
  
  // Fetch questions on component mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/assessment/questions?userId=${params.userId}`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const data = await response.json();
        setQuestions(data.questions);
        
        // Set initial section
        if (data.questions.length > 0) {
          setCurrentSection(data.questions[0].section);
        }
        
        // Load previously saved answers if any
        if (data.answers) {
          setAnswers(data.answers);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    fetchQuestions();
  }, [params.userId, toast]);
  
  // Get the current question
  const currentQuestion = questions[currentIndex];
  
  // Calculate progress
  const progress = questions.length ? Math.round((currentIndex / questions.length) * 100) : 0;
  
  // Handle answer selection
  function handleAnswerChange(value: string) {
    if (!currentQuestion) return;
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
    
    // Auto-save answer after selection
    saveAnswer(currentQuestion.id, value);
  }
  
  // Save answer to the backend
  async function saveAnswer(questionId: string, answer: string) {
    try {
      await fetch('/api/assessment/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: params.userId,
          questionId,
          answer,
        }),
      });
    } catch (error) {
      console.error('Failed to save answer:', error);
      // We don't show an error toast here to avoid disrupting the user experience
      // The answer will still be tracked in the local state
    }
  }
  
  // Handle navigation
  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Update section if necessary
      if (questions[currentIndex - 1]) {
        setCurrentSection(questions[currentIndex - 1].section);
      }
    }
  }
  
  async function handleNext() {
    // Make sure the current question is answered
    if (!currentQuestion || !answers[currentQuestion.id]) {
      toast({
        title: "Please answer the question",
        description: "You need to select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentIndex < questions.length - 1) {
      // Move to next question
      setCurrentIndex(currentIndex + 1);
      // Update section if necessary
      if (questions[currentIndex + 1]) {
        setCurrentSection(questions[currentIndex + 1].section);
      }
    } else {
      // This is the last question, complete the assessment
      setSubmitting(true);
      
      try {
        const response = await fetch('/api/assessment/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: params.userId,
          }),
        });
        
        if (!response.ok) throw new Error('Failed to complete assessment');
        
        const data = await response.json();
        
        // Redirect to results page
        router.push(`/assessment/results/${params.userId}`);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to complete your assessment. Please try again.",
          variant: "destructive",
        });
        setSubmitting(false);
      }
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading your assessment...</p>
        </div>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>
              There was an error loading the assessment questions.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => router.push('/assessment/start')}
              className="w-full"
            >
              Return to Start
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-secondary/10 py-8 px-4">
      <div className="container max-w-3xl mx-auto">
        <QuestionSection currentSection={currentSection} />
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <QuestionDisplay 
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] || ''}
              onAnswerChange={handleAnswerChange}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || submitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : currentIndex === questions.length - 1 ? (
                <>
                  Complete
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}