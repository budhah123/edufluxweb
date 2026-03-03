import Link from 'next/link';

export default function CTA() {
  return (
    <section className="w-full px-6 md:px-10 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-20 text-center text-white">
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to streamline your workflow?
          </h2>
          <p className="max-w-xl text-lg text-white/80">
            Join thousands of students using Eduflux today to stay organized and excel in their academic careers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="h-14 rounded-xl bg-white px-10 text-base font-bold text-primary hover:bg-slate-100 transition-colors flex items-center"
            >
              Get Started Now
            </Link>
            <button className="h-14 rounded-xl border-2 border-white/30 px-10 text-base font-bold text-white hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
