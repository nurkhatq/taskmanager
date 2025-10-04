'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Kanban, Users, Settings, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUser } = useStore();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
    { href: '/board', icon: Kanban, label: 'Доска задач' },
    { href: '/team', icon: Users, label: 'Команда' },
    { href: '/settings', icon: Settings, label: 'Настройки' },
  ];

  if (!currentUser) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
        <p className="text-sm text-gray-500 mt-1">Управление задачами</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentUser(null)}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </aside>
  );
}