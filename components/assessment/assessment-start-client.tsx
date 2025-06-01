'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Brain,
	Heart,
	Lightbulb,
	Clock,
	CheckCircle,
	Play,
	Users,
	Target,
} from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface User {
	id: string;
	name: string | null;
	email: string;
	role: string;
	// Add other user properties as needed
}

interface Report {
	id: string;
	version: number;
	createdAt: Date;
	// Add other report properties as needed
}

interface AssessmentStartClientProps {
	user: User;
	existingReport: Report | null;
}

export function AssessmentStartClient({
	user,
	existingReport,
}: AssessmentStartClientProps) {
	const router = useRouter();
	const [isStarting, setIsStarting] = useState(false);

	const sections = [
		{
			id: 'aptitude',
			title: 'Think & Solve',
			emoji: '🧠',
			description:
				'Test your problem-solving superpowers with fun puzzles and brain teasers',
			icon: Brain,
			questions: 30,
			timeEstimate: '25-30 minutes',
			features: [
				'Logic puzzles',
				'Number challenges',
				'Word games',
				'Visual problems',
			],
			color: 'from-blue-400 to-blue-600',
			bgColor:
				'bg-gradient-to-br from-blue-50 to-blue-100',
		},
		{
			id: 'personality',
			title: 'Know Yourself',
			emoji: '💝',
			description:
				'Discover what makes you unique and how you interact with the world',
			icon: Heart,
			questions: 40,
			timeEstimate: '15-20 minutes',
			features: [
				'About your style',
				'How you work',
				'Your strengths',
				'What motivates you',
			],
			color: 'from-purple-400 to-purple-600',
			bgColor:
				'bg-gradient-to-br from-purple-50 to-purple-100',
		},
		{
			id: 'interest',
			title: 'Explore Interests',
			emoji: '✨',
			description: 'Find out what activities and careers excite you the most',
			icon: Lightbulb,
			questions: 30,
			timeEstimate: '10-15 minutes',
			features: [
				'Fun activities',
				'Dream jobs',
				'Hobby exploration',
				'Future planning',
			],
			color: 'from-green-400 to-green-600',
			bgColor:
				'bg-gradient-to-br from-green-50 to-green-100',
		},
	];

	const handleStartAssessment = async () => {
		setIsStarting(true);
		try {
			router.push('/assessment/section/aptitude');
		} catch (error) {
			console.error('Error starting assessment:', error);
			setIsStarting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
			<div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<div className="mb-6">
						<span className="text-6xl mb-4 block">🚀</span>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
							Discover Your Future
						</h1>
						<p className="text-lg sm:text-xl text-gray-600 mb-2 max-w-3xl mx-auto leading-relaxed">
							Take our fun and easy career assessment to explore your strengths,
							interests, and find careers you'll love!
						</p>
						<p className="text-gray-500 flex items-center justify-center gap-2">
							<Users className="h-4 w-4" />
							<span>Perfect for high school students</span>
						</p>
					</div>
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
					<div className="text-center p-4 bg-white rounded-2xl shadow-sm">
						<div className="text-2xl font-bold text-indigo-600">100</div>
						<div className="text-sm text-gray-600">Questions</div>
					</div>
					<div className="text-center p-4 bg-white rounded-2xl shadow-sm">
						<div className="text-2xl font-bold text-purple-600">50-65</div>
						<div className="text-sm text-gray-600">Minutes</div>
					</div>
					<div className="text-center p-4 bg-white rounded-2xl shadow-sm">
						<div className="text-2xl font-bold text-green-600">Free</div>
						<div className="text-sm text-gray-600">Forever</div>
					</div>
				</div>

				{/* Assessment Sections */}
				<div className="mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
						Three Fun Sections to Complete
					</h2>

					<div className="grid md:grid-cols-3 gap-6 lg:gap-8">
						{sections.map((section, index) => {
							const Icon = section.icon;
							return (
								<div
									key={section.id}
									className={`${section.bgColor} rounded-3xl p-6 sm:p-8 relative overflow-hidden transform hover:scale-105 transition-all duration-300`}
								>
									{/* Section Number */}
									<div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
										{index + 1}
									</div>

									<div className="text-center mb-6">
										<div className="text-4xl mb-3">{section.emoji}</div>
										<h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
											{section.title}
										</h3>
										<div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
											<Clock className="h-4 w-4" />
											{section.timeEstimate}
										</div>
									</div>

									<p className="text-gray-700 text-center mb-6 leading-relaxed">
										{section.description}
									</p>

									<div className="space-y-2">
										{section.features.map((feature, idx) => (
											<div
												key={idx}
												className="flex items-center text-sm text-gray-700"
											>
												<CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
												{feature}
											</div>
										))}
									</div>

									<div className="mt-6 text-center">
										<span className="bg-white text-gray-600 text-sm px-3 py-1 rounded-full">
											{section.questions} questions
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Instructions */}
				<div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg mb-12">
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
						<Target className="h-8 w-8 inline mr-3 text-indigo-600" />
						How It Works
					</h2>

					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
								<span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
									1
								</span>
								Before You Start
							</h3>
							<ul className="space-y-3 text-gray-700">
								<li className="flex items-start">
									<span className="text-indigo-500 mr-3 text-lg">🌟</span>
									Find a quiet place where you can focus
								</li>
								<li className="flex items-start">
									<span className="text-indigo-500 mr-3 text-lg">💭</span>
									Answer honestly - there are no wrong answers!
								</li>
								<li className="flex items-start">
									<span className="text-indigo-500 mr-3 text-lg">⚡</span>
									Go with your first instinct
								</li>
								<li className="flex items-start">
									<span className="text-indigo-500 mr-3 text-lg">🎯</span>
									Complete all three sections for best results
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
								<span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
									2
								</span>
								What You'll Get
							</h3>
							<ul className="space-y-3 text-gray-700">
								<li className="flex items-start">
									<span className="text-purple-500 mr-3 text-lg">📊</span>
									Your personalized results dashboard
								</li>
								<li className="flex items-start">
									<span className="text-purple-500 mr-3 text-lg">💼</span>
									Career matches based on your profile
								</li>
								<li className="flex items-start">
									<span className="text-purple-500 mr-3 text-lg">📱</span>
									Detailed PDF report you can save
								</li>
								<li className="flex items-start">
									<span className="text-purple-500 mr-3 text-lg">🎓</span>
									Next steps for your education journey
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center">
					<button
						onClick={handleStartAssessment}
						disabled={isStarting}
						className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{isStarting ? (
							<>
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
								Starting Your Journey...
							</>
						) : (
							<>
								<Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
								Start My Assessment
							</>
						)}
					</button>

					<p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
						Your responses are private and secure. You can take breaks between
						sections.
					</p>
				</div>
			</div>
		</div>
	);
}
