
import React from 'react';
import { Users, Target, ArrowRight } from 'lucide-react';
import { CAMPUS_CLUBS } from '../../constants';
import { Club } from '../../types';

interface StudentClubsProps {
  onClubClick: (club: Club) => void;
}

const StudentClubs: React.FC<StudentClubsProps> = ({ onClubClick }) => {
  const ClubCard: React.FC<{ club: Club }> = ({ club }) => (
    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start group hover:shadow-2xl hover:shadow-slate-200/50 hover:border-blue-200 transition-all duration-300">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg border border-slate-100 bg-slate-50">
        <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-grow flex flex-col justify-center text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">{club.name}</h2>
        <p className="text-slate-500 font-medium mb-6 line-clamp-2 max-w-2xl leading-relaxed">{club.description}</p>
        <div className="flex items-center justify-center md:justify-start gap-6 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><Users className="w-4 h-4 text-blue-500" /> {club.members} Members</div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold"><Target className="w-4 h-4 text-rose-500" /> {club.openPositions} Open Positions</div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {club.tags.map(tag => <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-100">{tag}</span>)}
        </div>
      </div>
      <div className="flex-shrink-0 md:self-center">
        <button onClick={() => onClubClick(club)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-slate-200">View Details <ArrowRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campus Clubs & Roles</h1>
        <p className="text-slate-500 font-medium mt-2">Join a community, build projects, and accelerate your career.</p>
      </div>
      <div className="space-y-8">
        {CAMPUS_CLUBS.map(club => <ClubCard key={club.id} club={club} />)}
      </div>
    </div>
  );
};

export default StudentClubs;
