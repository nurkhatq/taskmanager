'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { LogIn, Users, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, employees, setCurrentUser } = useStore();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleLogin = (employee: typeof employees[0]) => {
    setCurrentUser(employee);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-2xl mb-6 shadow-lg">
            <Users size={40} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-gray-600 text-xl mb-2">
            Современная система управления задачами
          </p>
          <p className="text-gray-500 text-sm">
            Kanban доска • Аналитика • Командная работа
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <LogIn size={24} className="text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Выберите свой профиль
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => handleLogin(emp)}
                className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-xl transition-all duration-300 flex items-center gap-4 overflow-hidden"
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-4 w-full">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300 shadow-md"
                    style={{ backgroundColor: emp.color }}
                  >
                    {emp.avatar}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {emp.name}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">{emp.role}</p>
                    <p className="text-xs text-gray-400 mt-1">{emp.email}</p>
                  </div>
                  <ArrowRight 
                    className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" 
                    size={24} 
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="text-2xl font-bold text-primary-600 mb-1">Kanban</div>
                <div className="text-xs text-gray-600">Drag & Drop доска</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-bold text-purple-600 mb-1">Analytics</div>
                <div className="text-xs text-gray-600">Графики и метрики</div>
              </div>
              <div className="p-3">
                <div className="text-2xl font-bold text-green-600 mb-1">Team</div>
                <div className="text-xs text-gray-600">Командная работа</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 TaskFlow. Все права защищены.</p>
          <p className="mt-1">Сделано с ❤️ для эффективной работы</p>
        </div>
      </div>
    </div>
  );
}