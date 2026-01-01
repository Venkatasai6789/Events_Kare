
import React from 'react';
import { ChevronLeft, MapPin, Rocket } from 'lucide-react';
import { Club, Project, OpenRole } from '../../types';

interface ClubDetailProps {
  club: Club;
  onBack: () => void;
}

const ClubDetail: React.FC<ClubDetailProps> = ({ club, onBack }) => {
  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-wider text-blue-600">{project.badge}</div>
      </div>
      <div className="p-8 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-black text-slate-900">{project.title}</h3>
          <span className="text-[10px] font-black text-slate-400">{project.year}</span>
        </div>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">{project.description}</p>
      </div>
    </div>
  );

  const RoleCard: React.FC<{ role: OpenRole }> = ({ role }) => (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-blue-200 hover:shadow-lg transition-all shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{role.title}</h3>
          <p className="text-sm font-bold text-blue-600">{role.openings} Open Position{role.openings > 1 ? 's' : ''}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0"><Rocket className="w-6 h-6" /></div>
      </div>
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Skills</p>
        <div className="flex flex-wrap gap-2">
          {role.skills.map(skill => <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black border border-slate-100 uppercase tracking-wide">{skill}</span>)}
        </div>
      </div>
      <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg active:scale-95">Apply Now</button>
    </div>
  );

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500">
      <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden mb-8 group">
        <img src={club.banner} alt={club.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-4">
            <img src={club.image} className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-xl" />
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{club.name}</h1>
          </div>
        </div>
        <button onClick={onBack} className="absolute top-8 left-8 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-lg border border-white/20">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="grid lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-8 rounded-[2.5rem] border">
            <h3 className="text-xl font-black text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{club.mission}</p>
          </section>
          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Key Projects</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {club.projects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
          <section>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Open Positions</h3>
            <div className="grid gap-6">
              {club.roles.map(r => <RoleCard key={r.id} role={r} />)}
            </div>
          </section>
        </div>
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <h3 className="text-xl font-black mb-2">Recruitment Drive</h3>
            <div className="space-y-6 mt-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Venue</p>
                  <p className="font-bold">{club.interview.venue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
