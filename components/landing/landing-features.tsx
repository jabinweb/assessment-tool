'use client'
import { Brain, Target, TrendingUp, Shield } from 'lucide-react';

const features = [
	{
		name: 'Comprehensive Aptitude Testing',
		description:
			'Measure logical, numerical, verbal, and spatial reasoning abilities with scientifically validated assessments.',
		icon: Brain,
	},
	{
		name: 'Personality & Interest Profiling',
		description: 'Discover personality traits using Big Five model and explore interests with RIASEC framework.',
		icon: Target,
	},
	{
		name: 'AI-Powered Career Matching',
		description: 'Advanced algorithms analyze your results to recommend careers that perfectly match your profile.',
		icon: TrendingUp,
	},
	{
		name: 'Research-Based Methodology',
		description: 'Built on established psychological models and validated assessment techniques used by professionals.',
		icon: Shield,
	},
];

export function LandingFeatures() {
	return (
		<section className="bg-gray-900 py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base font-semibold leading-7 text-indigo-400">
						Assessment Features
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Discover your perfect career path
					</p>
					<p className="mt-6 text-lg leading-8 text-gray-300">
						Comprehensive career assessment tools designed for students, career changers, and 
						guidance counselors to make informed career decisions.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
						{features.map((feature, index) => (
							<div 
								key={feature.name} 
								className="group relative overflow-hidden rounded-2xl bg-gray-800 p-8 transition-all duration-300 hover:bg-gray-700 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-indigo-500"
								style={{
									animationDelay: `${index * 100}ms`,
									animation: 'fadeInUp 0.6s ease-out forwards'
								}}
							>
								{/* Gradient overlay on hover */}
								<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								
								{/* Icon container */}
								<div className="relative flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors duration-300">
									<feature.icon className="h-8 w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
								</div>

								{/* Content */}
								<div className="relative">
									<h3 className="text-xl font-semibold text-white mb-4 group-hover:text-indigo-100 transition-colors duration-300">
										{feature.name}
									</h3>
									<p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
										{feature.description}
									</p>
								</div>

								{/* Animated border effect */}
								<div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-500/50 transition-all duration-300" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Add CSS animations */}
			<style jsx>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</section>
	);
}