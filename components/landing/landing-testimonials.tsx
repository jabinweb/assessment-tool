import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
	{
		body: 'This platform has transformed how we conduct assessments. The analytics provide insights we never had before.',
		author: {
			name: 'Dr. Sarah Chen',
			role: 'Education Director',
			company: 'Tech University',
		},
	},
	{
		body: 'Streamlined our entire assessment workflow. What used to take hours now takes minutes.',
		author: {
			name: 'Michael Rodriguez',
			role: 'Training Manager',
			company: 'Corporate Learning Inc.',
		},
	},
	{
		body: 'The automated grading and detailed reports have saved our team countless hours every week.',
		author: {
			name: 'Emily Watson',
			role: 'Assessment Specialist',
			company: 'Education Solutions',
		},
	},
];

export function LandingTestimonials() {
	return (
		<section className="bg-gray-800 py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-xl text-center">
					<h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-400">
						User Feedback
					</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Trusted by professionals
					</p>
				</div>
				<div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{testimonials.map((testimonial, testimonialIdx) => (
							<div
								key={testimonialIdx}
								className="rounded-2xl bg-gray-900 p-8 ring-1 ring-gray-700"
							>
								<blockquote className="text-gray-300">
									<p>&ldquo;{testimonial.body}&rdquo;</p>
								</blockquote>
								<figcaption className="mt-6 flex items-center gap-x-4">
									<div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
										<span className="text-sm font-medium text-white">
											{testimonial.author.name.charAt(0)}
										</span>
									</div>
									<div>
										<div className="font-semibold text-white">
											{testimonial.author.name}
										</div>
										<div className="text-sm leading-6 text-gray-400">
											{testimonial.author.role},{' '}
											{testimonial.author.company}
										</div>
									</div>
								</figcaption>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}