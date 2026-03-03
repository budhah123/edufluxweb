import Link from 'next/link';

export default function Hero() {
  return (
    <section className="w-full px-6 md:px-10 py-16 md:py-28">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center">

        {/* Left: Text */}
        <div className="flex flex-1 flex-col gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit self-center lg:self-start rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              New: 2.0 Dashboard is live
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white">
              Simplify Your{' '}
              <span className="text-primary">Academic Journey</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-slate-600 dark:text-slate-400 lg:mx-0">
              Eduflux is the ultimate assignment access and management system for students.
              Streamline your workflow and focus on what matters most—learning.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              href="/login"
              className="flex h-14 min-w-[160px] items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="flex h-14 min-w-[160px] items-center justify-center rounded-xl border-2 border-primary/20 px-8 text-base font-bold text-primary hover:bg-primary/5 transition-all"
            >
              Learn More
            </a>
          </div>

          {/* Trusted by */}
          <div className="flex items-center justify-center gap-4 lg:justify-start grayscale opacity-50">
            <span className="text-xs font-semibold uppercase tracking-widest">Trusted by students at</span>
            <div className="h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-md" />
          </div>
        </div>

        <div className="relative flex-1">
          <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-3xl pointer-events-none" />
          <div
            className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl"
            style={{
              backgroundImage: `url('/dashboard-preview.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-label="Modern digital student dashboard interface"
          />
        </div>
      </div>
    </section>
  );
}
