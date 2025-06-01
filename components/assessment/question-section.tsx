import { BrainCircuit, Users, Lightbulb } from 'lucide-react';

interface QuestionSectionProps {
  currentSection: string;
}

export function QuestionSection({ currentSection }: QuestionSectionProps) {
  const sections = {
    aptitude: {
      icon: BrainCircuit,
      title: 'Aptitude Assessment',
      description: 'Testing your cognitive abilities and problem-solving skills',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    personality: {
      icon: Users,
      title: 'Personality Assessment',
      description: 'Understanding your behavioral traits and preferences',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    interest: {
      icon: Lightbulb,
      title: 'Interest Assessment',
      description: 'Exploring your interests and career preferences',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  };

  const section = sections[currentSection as keyof typeof sections];

  if (!section) return null;

  const Icon = section.icon;

  return (
    <div className={`mb-6 p-4 rounded-lg border ${section.bgColor} ${section.borderColor}`}>
      <div className="flex items-center mb-2">
        <Icon className={`h-6 w-6 ${section.color} mr-3`} />
        <h2 className={`text-xl font-semibold ${section.color}`}>
          {section.title}
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        {section.description}
      </p>
    </div>
  );
}