'use client';

import { useTasks } from '@/hooks/useTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { getStageLabel } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export function ProgressChart() {
  const { tasksByStage } = useTasks();

  const data = [
    { 
      name: getStageLabel('backlog'), 
      value: tasksByStage.backlog?.length || 0, 
      color: '#6b7280',
      fullName: 'Бэклог'
    },
    { 
      name: getStageLabel('todo'), 
      value: tasksByStage.todo?.length || 0, 
      color: '#3b82f6',
      fullName: 'К выполнению'
    },
    { 
      name: getStageLabel('in_progress'), 
      value: tasksByStage.in_progress?.length || 0, 
      color: '#f59e0b',
      fullName: 'В работе'
    },
    { 
      name: getStageLabel('review'), 
      value: tasksByStage.review?.length || 0, 
      color: '#8b5cf6',
      fullName: 'На проверке'
    },
    { 
      name: getStageLabel('done'), 
      value: tasksByStage.done?.length || 0, 
      color: '#10b981',
      fullName: 'Готово'
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-600">
            Задач: <strong className="text-primary-600">{payload[0].value}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const totalTasks = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-600" />
          Распределение задач
        </h3>
        <span className="text-sm text-gray-500">
          Всего: <strong className="text-gray-900">{totalTasks}</strong>
        </span>
      </div>

      {totalTasks === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Нет данных для отображения</p>
            <p className="text-gray-400 text-sm mt-1">
              Создайте задачи для просмотра статистики
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">
                {item.name}: <strong>{item.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}