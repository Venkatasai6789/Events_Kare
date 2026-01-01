
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CreditGroup } from '../types';

interface CreditCardProps {
  group: CreditGroup;
  type: 'donut' | 'linear';
}

const CreditCard: React.FC<CreditCardProps> = ({ group, type }) => {
  const data = [
    { name: 'Earned', value: group.earned },
    { name: 'Remaining', value: group.total - group.earned },
  ];

  const percentage = Math.round((group.earned / group.total) * 100);

  if (type === 'linear') {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between transition-all hover:shadow-md h-full">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-tight">{group.name}</h3>
            <span className="text-sm font-bold" style={{ color: group.color }}>{percentage}%</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mb-6">
            {group.earned} <span className="text-slate-300 font-normal text-xl">/ {group.total}</span>
          </p>
        </div>
        
        <div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ width: `${percentage}%`, backgroundColor: group.color }}
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {group.total - group.earned} more needed for EE completion
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between transition-all hover:shadow-md h-full">
      <div className="flex-1">
        <h3 className="text-slate-900 font-bold text-sm uppercase tracking-tight mb-2">{group.name}</h3>
        <p className="text-3xl font-extrabold text-slate-900 mb-2">
          {group.earned} <span className="text-slate-300 font-normal text-xl">/ {group.total}</span>
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">+2 EARNED</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          {group.total - group.earned} credits to reach goal
        </p>
      </div>
      
      <div className="w-24 h-24 relative flex-shrink-0 ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={40}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              stroke="none"
            >
              <Cell fill={group.color} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-bold text-slate-900">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
