'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authHeaders } from '../../services/auth';

const navLinks = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/dashboard/users', icon: 'group', label: 'User Management', active: true },
  { href: '/dashboard/courses', icon: 'book', label: 'Courses' },
  { href: '/dashboard/reports', icon: 'bar_chart', label: 'Reports' },
  { href: '/dashboard/settings', icon: 'settings', label: 'Settings' },
];

const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', userType: 'USER' };

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add User Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Snackbar toast
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });
  const snackbarTimer = useRef(null);

  const showSnackbar = (message, type = 'success') => {
    if (snackbarTimer.current) clearTimeout(snackbarTimer.current);
    setSnackbar({ visible: true, message, type });
    snackbarTimer.current = setTimeout(() => {
      setSnackbar((s) => ({ ...s, visible: false }));
    }, 3500);
  };

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://eduflux-dev.onrender.com/admin/user?page=${page}&limit=10`,
        authHeaders()
      );

      // If unauthorized, token is missing/expired — send back to login
      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        router.replace('/');
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || `Failed to fetch users (${res.status})`);
      }

      const result = await res.json();
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const openModal = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!formData.email.trim()) { setFormError('Email is required.'); return; }
    if (!formData.password.trim()) { setFormError('Password is required.'); return; }
    if (formData.password.length < 6) { setFormError('Password must be at least 6 characters.'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('https://eduflux-dev.onrender.com/admin/user', {
        method: 'POST',
        ...authHeaders(),
        body: JSON.stringify({
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          email: formData.email.trim(),
          password: formData.password,
          userType: formData.userType,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        router.replace('/');
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : (data?.message || `Error ${res.status}`));
      }

      setShowModal(false);
      fetchUsers(1);
      showSnackbar('User created successfully! 🎉', 'success');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    router.push('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredUsers = users.filter((u) => {
    // Never show ADMIN accounts in the user listing table
    if (u.userType === 'ADMIN') return false;

    const matchSearch =
      !searchQuery ||
      (u.firstName && u.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.lastName && u.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !userTypeFilter || u.userType === userTypeFilter;
    const matchStatus =
      !statusFilter ||
      (statusFilter === 'active' && u.isActive) ||
      (statusFilter === 'inactive' && !u.isActive);
    return matchSearch && matchType && matchStatus;
  });

  const totalPages = Math.ceil(meta.total / meta.limit);
  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.userType === 'ADMIN').length;

  return (
    <>
      {/* ── Add User Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e3b8a]/10 p-2 rounded-lg text-[#1e3b8a]">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New User</h3>
                  <p className="text-xs text-slate-400">Fill in the details to create a new account.</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateUser} className="px-6 py-5 space-y-4">
              {/* Error banner */}
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                  <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1e3b8a]/20 focus:border-[#1e3b8a] outline-none transition-all disabled:opacity-60"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1e3b8a]/20 focus:border-[#1e3b8a] outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address <span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  placeholder="e.g. user@eduflux.edu"
                  value={formData.email}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  required
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1e3b8a]/20 focus:border-[#1e3b8a] outline-none transition-all disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleFormChange}
                    disabled={isSubmitting}
                    required
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1e3b8a]/20 focus:border-[#1e3b8a] outline-none transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* User Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">User Type</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1e3b8a]/20 focus:border-[#1e3b8a] outline-none transition-all disabled:opacity-60 cursor-pointer"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg bg-[#1e3b8a] hover:bg-[#1e3b8a]/90 text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Head>
        <title>Eduflux Admin - User Management</title>
      </Head>

      <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#121620] text-slate-900 dark:text-slate-100" style={{ fontFamily: 'Lexend, sans-serif' }}>

        {/* ── Sidebar ── */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0">
          <div className="p-6 flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-[#1e3b8a] size-10 rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <h1 className="text-[#1e3b8a] font-bold text-lg leading-tight">Eduflux</h1>
                <p className="text-xs text-slate-500 font-medium">Super Admin</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#1e3b8a]/10 text-[#1e3b8a]'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{link.icon}</span>
                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-slate-400">
              <span className="material-symbols-outlined">menu</span>
              <span className="text-sm text-slate-500">Overview / User Management</span>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative group">
                <span className="material-symbols-outlined text-slate-400 cursor-pointer p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  notifications
                </span>
                <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right">
                  <p className="text-xs font-bold leading-none">Alex Rivera</p>
                  <p className="text-[10px] text-slate-400 font-medium">Admin ID: 8902</p>
                </div>
                <div
                  className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCoW4PaTqDhy-LxCdoCbrGOK-EWT0QgBhIIuAgith_nkKzl8hGo_d1P2uLH-7SWRlvFBhN236bLZaNTYp0LeM5Aq3ad1ElqQ5PuOzBHn5kUVBh7cXxCM8qC-cSqVm639VvVaLN1_GATYkpt2N67vKZhYaEebKqL8wlVOLqOe50jtx4phawvUTNU0GVkq1DMr07E1ldd43b0_73VG8x9b_kbBuYvx1WQBWMO8-CEa0Wc946qdtoMoWXcuhTW60BfOgcMcuMJXk1c1Ww')",
                  }}
                />
              </div>
            </div>
          </header>

          {/* ── Page Content ── */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">

            {/* Page Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  User Management
                </h2>
                <p className="text-sm text-slate-500">
                  Manage and monitor platform participants and access levels.
                </p>
              </div>
              <button
                onClick={openModal}
                className="bg-[#1e3b8a] hover:bg-[#1e3b8a]/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">person_add</span>
                Add New User
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[300px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl leading-none">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-[#1e3b8a]/20 text-sm placeholder:text-slate-400 transition-all outline-none"
                  placeholder="Search by name, email, or role..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2 pr-10 focus:ring-2 focus:ring-[#1e3b8a]/20 cursor-pointer min-w-[140px] outline-none"
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="USER">User</option>
                </select>
                <select
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2 pr-10 focus:ring-2 focus:ring-[#1e3b8a]/20 cursor-pointer min-w-[140px] outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {isLoading ? (
                      /* Loading skeleton rows */
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          {[...Array(7)].map((__, j) => (
                            <td key={j} className="px-6 py-4">
                              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : error ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2 text-red-500">
                            <span className="material-symbols-outlined text-3xl">error</span>
                            <p className="text-sm font-medium">{error}</p>
                            <button
                              onClick={() => fetchUsers(meta.page)}
                              className="mt-2 text-xs font-semibold text-[#1e3b8a] hover:underline"
                            >
                              Retry
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                          No users match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {user.firstName || <span className="text-slate-400 italic">—</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {user.lastName || <span className="text-slate-400 italic">—</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                user.userType === 'ADMIN'
                                  ? 'bg-[#1e3b8a]/10 text-[#1e3b8a]'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {user.userType === 'ADMIN' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.isActive ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold w-fit">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Active
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold w-fit border border-slate-200 dark:border-slate-700">
                                <span className="size-1.5 rounded-full bg-slate-400" />
                                Inactive
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-1.5 text-slate-400 hover:text-[#1e3b8a] transition-colors"
                                title="View Profile"
                              >
                                <span className="material-symbols-outlined text-xl">visibility</span>
                              </button>
                              <button
                                className="p-1.5 text-slate-400 hover:text-[#1e3b8a] transition-colors"
                                title="Edit User"
                              >
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </button>
                              {user.isActive ? (
                                <button
                                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                  title="Deactivate Account"
                                >
                                  <span className="material-symbols-outlined text-xl">block</span>
                                </button>
                              ) : (
                                <button
                                  className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-colors"
                                  title="Activate Account"
                                >
                                  <span className="material-symbols-outlined text-xl">check_circle</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!isLoading && !error && (
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing {meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1} to{' '}
                    {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} users
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => fetchUsers(meta.page - 1)}
                      disabled={meta.page === 1}
                      className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-lg leading-none">chevron_left</span>
                    </button>

                    {(() => {
                      const pages = [];
                      const total = totalPages;
                      const current = meta.page;
                      if (total <= 5) {
                        for (let i = 1; i <= total; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        if (current > 3) pages.push('...');
                        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
                        if (current < total - 2) pages.push('...');
                        pages.push(total);
                      }
                      return pages.map((p, idx) =>
                        p === '...' ? (
                          <span key={`ellipsis-${idx}`} className="text-slate-400 px-1">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => fetchUsers(p)}
                            className={`size-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                              meta.page === p
                                ? 'bg-[#1e3b8a] text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      );
                    })()}

                    <button
                      onClick={() => fetchUsers(meta.page + 1)}
                      disabled={meta.page >= totalPages}
                      className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-lg leading-none">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="bg-[#1e3b8a]/10 p-3 rounded-lg text-[#1e3b8a]">
                  <span className="material-symbols-outlined text-2xl">people</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Users</p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {isLoading ? '—' : meta.total.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-500/10 p-3 rounded-lg text-emerald-600">
                  <span className="material-symbols-outlined text-2xl">person_check</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Users</p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {isLoading ? '—' : activeCount}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-500/10 p-3 rounded-lg text-amber-600">
                  <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Admins</p>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {isLoading ? '—' : adminCount}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── Global Snackbar ── */}
      <div
        className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl px-5 py-4 shadow-xl transition-all duration-300 transform flex items-start gap-3 border ${
          snackbar.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        } ${
          snackbar.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}
      >
        <span className="material-symbols-outlined shrink-0 mt-0.5">
          {snackbar.type === 'success' ? 'check_circle' : 'error'}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">{snackbar.message}</p>
        </div>
        <button
          onClick={() => setSnackbar((s) => ({ ...s, visible: false }))}
          className={`shrink-0 p-1 rounded-lg transition-colors ${
            snackbar.type === 'success'
              ? 'hover:bg-emerald-100 dark:hover:bg-emerald-800'
              : 'hover:bg-red-100 dark:hover:bg-red-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg leading-none">close</span>
        </button>
      </div>
    </>
  );
}
