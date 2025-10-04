'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md"
          style={{ backgroundColor: `${color}20`, border: `2px solid ${color}30` }}
        >
          <Icon size={28} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
            trend.isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {value}
      </h3>
      
      <p className="text-sm text-gray-600 font-medium">
        {title}
      </p>

      {/* Progress indicator */}
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            backgroundColor: color,
            width: trend ? `${Math.min(trend.value, 100)}%` : '0%'
          }}
        />
      </div>
    </div>
  );
}