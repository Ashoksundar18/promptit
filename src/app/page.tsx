import AnimatedIntro from '@/components/landing/AnimatedIntro';
import Hero from '@/components/landing/Hero';
import AICards from '@/components/landing/AICards';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <AnimatedIntro />
      <Hero />
      <section id="ai-tools">
        <AICards />
      </section>
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
