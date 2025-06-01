'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface SampleAssessmentProps {
  onBack: () => void;
}

const sampleQuestions = [
  {
    section: 'Aptitude',
    question: 'If 2x + 5 = 15, what is the value of x?',
    options: ['3', '5', '7', '10'],
    correct: 1
  },
  {
    section: 'Personality',
    question: 'I prefer working in teams rather than alone',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
    type: 'likert'
  },
  {
    section: 'Interest',
    question: 'Which activity would you find most engaging?',
    options: ['Analyzing financial data', 'Creating artwork', 'Teaching others', 'Building something with your hands'],
    type: 'preference'
  }
];

export function SampleAssessment({ onBack }: SampleAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < sampleQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setCompleted(true);
      }, 500);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Demo Complete!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Great job! You've completed our sample assessment. 
              The full assessment includes 60+ questions across all three sections 
              and provides detailed career matching and recommendations.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Your Sample Results Preview:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-gray-600">Logical Reasoning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">High</div>
                  <div className="text-gray-600">Team Orientation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Creative</div>
                  <div className="text-gray-600">Interest Profile</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <a
                href="/auth/register"
                className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Sign Up for Full Assessment
              </a>
              <button
                onClick={onBack}
                className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Demo Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className="flex items-center text-indigo-100 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demo
              </button>
              <span className="text-indigo-100">
                {currentQuestion + 1} of {sampleQuestions.length}
              </span>
            </div>
            
            <div className="w-full bg-indigo-700 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="mb-6">
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {question.section} Sample
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {question.question}
              </h2>
              <p className="text-gray-600">
                Select the option that best represents your answer or preference.
              </p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-indigo-900">{option}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
