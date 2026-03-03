const features = [
  {
    icon: 'upload_file',
    title: 'Easy Submission',
    description:
      'Submit assignments with a single click. Support for all major file formats and cloud integrations like Google Drive and Dropbox.',
  },
  {
    icon: 'query_stats',
    title: 'Real-time Tracking',
    description:
      'Monitor your progress in real-time. Get instant notifications for grades, feedback, and upcoming deadlines.',
  },
  {
    icon: 'folder_shared',
    title: 'Resource Access',
    description:
      'Instant access to all academic resources. Centralized library for course materials, lecture notes, and research papers.',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white dark:bg-slate-900/50 py-24">
      <div className="w-full px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Key Features</h2>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">
            Everything you need to succeed in your studies. Built by students, for students.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-6 rounded-2xl border border-primary/5 bg-background-light p-8 transition-all hover:border-primary/20 hover:shadow-xl dark:bg-background-dark"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
