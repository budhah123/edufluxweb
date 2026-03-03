export default function Footer() {
  return (
    <footer className="border-t border-primary/5 bg-white dark:bg-background-dark py-16">
      <div className="w-full px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">

          {/* Brand */}
          <div className="flex flex-col gap-4 col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-white">Eduflux</h2>
            </div>
            <p className="max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Making education management accessible and simple for everyone. The future of academic workflows is here.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Platform</h4>
              <nav className="flex flex-col gap-2">
                <a href="#features" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400">Features</a>
                <a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400">Pricing</a>
                <a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400">Mobile App</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Company</h4>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400">About Us</a>
                <a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400">Privacy Policy</a>
                <a href="#" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400">Terms of Service</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-primary/5 pt-8 md:flex-row">
          <p className="text-xs text-slate-500">© 2024 Eduflux Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
