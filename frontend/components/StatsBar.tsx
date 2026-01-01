
import React from 'react';
import { Calendar, Award, Clock, Zap } from 'lucide-react';
import { UserStats } from '../types';

interface StatsBarProps {
  stats: UserStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const items = [
    { label: 'Events Joined', value: stats.events, icon: <Calendar className="w-5 h-5" />, color: 'text-blue-600' },
    { label: 'Certificates', value: stats.certificates, icon: <Award className="w-5 h-5" />, color: 'text-pink-600' },
    { label: 'Next Event', value: `${stats.days} days`, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600' },
    { label: 'Total Credits', value: stats.credits, icon: <Zap className="w-5 h-5" />, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="text-slate-400">
            {item.icon}
          </div>
          <div>
            <p className="text-2xl font-black text-blue-600 leading-tight">{item.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
