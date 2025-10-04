'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentTasks } from '@/components/dashboard/RecentTasks';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { useTasks } from '@/hooks/useTasks';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser } = useStore();
  const { stats } = useTasks();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Добро пожаловать, {currentUser.name}! 👋
              </h2>
              <p className="text-gray-600">Вот краткий обзор ваших задач на сегодня</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Всего задач"
                value={stats.total}
                icon={TrendingUp}
                color="#3b82f6"
              />
              <StatsCard
                title="В работе"
                value={stats.inProgress}
                icon={Clock}
                color="#f59e0b"
              />
              <StatsCard
                title="Завершено"
                value={stats.completed}
                icon={CheckCircle2}
                trend={{ value: Math.round(stats.completionRate), isPositive: true }}
                color="#10b981"
              />
              <StatsCard
                title="Просрочено"
                value={stats.overdue}
                icon={AlertTriangle}
                color="#ef4444"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ProgressChart />
              </div>
              <div className="lg:col-span-1">
                <UpcomingDeadlines />
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTasks />
              <ActivityFeed />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}