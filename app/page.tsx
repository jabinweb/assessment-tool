import { Header } from '@/components/header';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingTestimonials } from '@/components/landing/landing-testimonials';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <Header />
      
      {/* Main Content */}
      <main className="relative bg-gray-900">
        <LandingHero />
        <section id="features">
          <LandingFeatures />
        </section>
        <section id="testimonials">
          <LandingTestimonials />
        </section>
        <LandingFooter />
      </main>
    </div>
  );
}