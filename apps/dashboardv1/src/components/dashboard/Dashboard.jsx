import Head from 'next/head';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

// ─── Data ────────────────────────────────────────────────────────────────────

const deadlines = [
  {
    id: 1,
    icon: 'assignment_ind',
    iconBg: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    badge: 'Urgent',
    badgeBg: 'bg-red-100 text-red-700',
    subject: 'User Verification',
    title: 'Review 15 Pending Faculty Applications',
    due: 'Today • 5:00 PM',
  },
  {
    id: 2,
    icon: 'security',
    iconBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    badge: 'Security',
    badgeBg: 'bg-blue-100 text-blue-700',
    subject: 'System',
    title: 'Routine Security Patch Deployment',
    due: 'Saturday, Oct 26 • 11:00 PM',
  },
  {
    id: 3,
    icon: 'analytics',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    badge: 'Review',
    badgeBg: 'bg-orange-100 text-orange-700',
    subject: 'Analytics',
    title: 'Monthly Institutional Progress Report',
    due: 'Monday, Oct 28 • 9:00 AM',
  },
];

const platformStats = [
  { label: 'Server Load',   modules: 'System resources at 42%', percent: 42, offset: 58 },
  { label: 'User Support',  modules: '85% tickets resolved',    percent: 85, offset: 15 },
  { label: 'Active Sites',  modules: '18 of 20 clusters active', percent: 90, offset: 10  },
];

const recentAlerts = [
  { subject: 'Auth Service',   title: 'Login Success Rate',   grade: '99%' },
  { subject: 'Database',       title: 'Auto-Scaling Event',   grade: 'Done' },
  { subject: 'API Gateway',    title: 'Latency Metrics',      grade: 'Avg 45ms' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CircularProgress({ percent, offset }) {
  return (
    <div className="relative flex-shrink-0 size-16">
      <svg className="size-full" viewBox="0 0 36 36">
        <circle
          className="stroke-[#ebe9f2] dark:stroke-white/10"
          cx="18" cy="18" r="16"
          fill="none" strokeWidth="3"
        />
        <circle
          className="stroke-primary progress-ring-circle"
          cx="18" cy="18" r="16"
          fill="none" strokeWidth="3"
          strokeDasharray="100"
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary dark:text-[#a397c5]">
        {percent}%
      </span>
    </div>
  );
}

function DeadlineCard({ deadline }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-[#ebe9f2] dark:border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${deadline.iconBg} p-3 rounded-lg flex-shrink-0`}>
        <span className="material-symbols-outlined text-2xl">{deadline.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded-full ${deadline.badgeBg} text-[10px] font-bold uppercase tracking-wider`}>
            {deadline.badge}
          </span>
          <span className="text-[#655591] dark:text-[#a397c5] text-xs">{deadline.subject}</span>
        </div>
        <h4 className="text-base font-bold text-[#120f1a] dark:text-white truncate">{deadline.title}</h4>
        <p className="text-sm text-[#655591] dark:text-[#a397c5] mt-1">Due: {deadline.due}</p>
      </div>
      <button className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg transition-transform active:scale-95">
        View Details
      </button>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - Eduflux</title>
        <meta name="description" content="Eduflux admin dashboard — manage students, courses, faculty, and institutional data." />
        <style>{`
          .progress-ring-circle {
            transition: stroke-dashoffset 0.35s;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
          }
        `}</style>
      </Head>

      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-[#120f1a] dark:text-white font-display">

        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-y-auto">

          {/* Top Navigation */}
          <TopNav userName="Alex Johnson" adminId="ADM-2024883" />

          {/* Page Content */}
          <div className="p-6 lg:p-10 space-y-8 max-w-[1400px] mx-auto w-full">

            {/* ── Welcome Banner ── */}
            <div className="relative overflow-hidden bg-primary rounded-xl p-8 text-white shadow-lg shadow-primary/20">
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
                  Welcome back, Administrator!
                </h2>
                <p className="text-white/80 text-lg font-light max-w-xl">
                  System status is normal. You have 15 faculty applications pending review and 3 high-priority security updates.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                   <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
                    <p className="text-xs uppercase font-bold tracking-wider opacity-70">Uptime</p>
                    <p className="text-sm font-medium">99.98% – Last 30 Days</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
                    <p className="text-xs uppercase font-bold tracking-wider opacity-70">Status</p>
                    <p className="text-sm font-medium">On Track</p>
                  </div>
                </div>
              </div>
              {/* Decorative blobs */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
              <div className="absolute right-12 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 blur-2xl pointer-events-none" />
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Upcoming Deadlines (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold">Admin Task Queue</h3>
                  <a href="#" className="text-primary font-semibold text-sm hover:underline">
                    View all tasks
                  </a>
                </div>
                <div className="space-y-4">
                  {deadlines.map((d) => (
                    <DeadlineCard key={d.id} deadline={d} />
                  ))}
                </div>
              </div>

              {/* Course Progress (1/3) */}
               <div className="space-y-4">
                <h3 className="text-xl font-bold px-2">Platform Metrics</h3>
                <div className="bg-white dark:bg-white/5 border border-[#ebe9f2] dark:border-white/10 rounded-xl p-6 space-y-8">
                  {platformStats.map((c) => (
                    <div key={c.label} className="flex items-center gap-5">
                      <CircularProgress percent={c.percent} offset={c.offset} />
                      <div>
                        <h5 className="text-sm font-bold text-[#120f1a] dark:text-white">{c.label}</h5>
                        <p className="text-xs text-[#655591] dark:text-[#a397c5]">{c.modules}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-[#ebe9f2] dark:border-white/10">
                    <button className="w-full text-center text-sm font-bold text-primary py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      Full System Diagnostics
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Recent Submissions ── */}
             <div className="space-y-4">
              <h3 className="text-xl font-bold px-2">Internal Service Alerts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentAlerts.map((s) => (
                  <div
                    key={s.title}
                    className="bg-white dark:bg-white/5 border border-[#ebe9f2] dark:border-white/10 rounded-xl p-4 flex flex-col items-center text-center"
                  >
                    <div className="bg-green-100 dark:bg-green-500/20 text-green-600 rounded-full size-12 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <p className="text-xs text-[#655591] dark:text-[#a397c5]">{s.subject}</p>
                    <h6 className="font-bold text-sm mb-1">{s.title}</h6>
                    <p className="text-lg font-black text-primary">{s.grade}</p>
                  </div>
                ))}

                {/* View History card */}
                <div className="bg-white dark:bg-white/5 border-2 border-dashed border-[#ebe9f2] dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center opacity-60 hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-3xl mb-1">history</span>
                  <p className="text-xs font-bold">Audit Logs</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
