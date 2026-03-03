import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../../components/dashboard/Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  // Auth guard — redirect to login if no token found
  useEffect(() => {
    const token =
      localStorage.getItem('auth_token') ||
      sessionStorage.getItem('auth_token');

    if (!token) {
      router.replace('/');
    }
  }, [router]);

  return <Dashboard />;
}
