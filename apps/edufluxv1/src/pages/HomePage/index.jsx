import Head from 'next/head';
import Navbar from '../../components/home/Navbar';
import Hero from '../../components/home/Hero';
import Features from '../../components/home/Features';
import CTA from '../../components/home/CTA';
import Footer from '../../components/home/Footer';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Eduflux - Simplify Your Academic Journey</title>
        <meta
          name="description"
          content="Eduflux is the ultimate assignment access and management system for students. Streamline your workflow and focus on what matters most—learning."
        />
      </Head>

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
