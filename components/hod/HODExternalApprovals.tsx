
import React, { useState } from 'react';
import { ChevronLeft, Flag, Award, Users, Calendar, MapPin, FileSearch, FileCheck2 } from 'lucide-react';

interface HODExternalApprovalsProps {
  setView: (view: string) => void;
  externalProposals: any[];
  setExternalProposals: (proposals: any[]) => void;
  externalCertificates: any[];
  setExternalCertificates: (certs: any[]) => void;
}

const HODExternalApprovals: React.FC<HODExternalApprovalsProps> = ({ setView, externalProposals, setExternalProposals, externalCertificates, setExternalCertificates }) => {
  const [activeApprovalTab, setActiveApprovalTab] = useState<'Proposals' | 'Certificates'>('Proposals');

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('hod-dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">External Event Controls</h1>
            <p className="text-slate-500 font-medium mt-1">Manage club participation and student-led achievements outside campus.</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex border border-slate-200">
           <button 
            onClick={() => setActiveApprovalTab('Proposals')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeApprovalTab === 'Proposals' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <Flag className="w-3.5 h-3.5" /> Club Proposals
           </button>
           <button 
            onClick={() => setActiveApprovalTab('Certificates')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeApprovalTab === 'Certificates' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <Award className="w-3.5 h-3.5" /> Student Certificates
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {activeApprovalTab === 'Proposals' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Club Proposing</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Event & Type</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Schedule & Venue</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {externalProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xs border border-purple-100">
                            <Users className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{proposal.clubName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Active Club</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-sm">{proposal.eventName}</p>
                      <span className="text-[10px] font-black text-purple-600 uppercase bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">{proposal.type}</span>
                    </td>
                    <td className="px-8 py-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                         <Calendar className="w-3.5 h-3.5 text-slate-400" />
                         {proposal.date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                         <MapPin className="w-3.5 h-3.5" />
                         {proposal.venue}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => {
                            setExternalProposals(externalProposals.filter(p => p.id !== proposal.id));
                            alert('External Event Approved');
                          }}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider border border-emerald-100 transition-all active:scale-95"
                         >
                           Approve
                         </button>
                         <button 
                          onClick={() => {
                            setExternalProposals(externalProposals.filter(p => p.id !== proposal.id));
                            alert('External Event Rejected');
                          }}
                          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider border border-rose-100 transition-all active:scale-95"
                         >
                           Reject
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Student Details</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Achievement / Event</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">Proof</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {externalCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-100 shadow-sm">
                            {cert.studentName.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{cert.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{cert.rollNumber}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-sm mb-1">{cert.eventName}</p>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                        <Calendar className="w-3 h-3" /> {cert.date}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all group/proof">
                        <FileSearch className="w-3.5 h-3.5 group-hover/proof:scale-110 transition-transform" />
                        View Document
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => {
                            setExternalCertificates(externalCertificates.filter(c => c.id !== cert.id));
                            alert('Certificate Verified & Approved');
                          }}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-black text-[10px] uppercase tracking-wider border border-emerald-100 transition-all active:scale-95"
                         >
                           Verify
                         </button>
                         <button 
                          onClick={() => {
                            setExternalCertificates(externalCertificates.filter(c => c.id !== cert.id));
                            alert('Certificate Rejected');
                          }}
                          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 font-black text-[10px] uppercase tracking-wider border border-rose-100 transition-all active:scale-95"
                         >
                           Reject
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {(activeApprovalTab === 'Proposals' ? externalProposals.length : externalCertificates.length) === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileCheck2 className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
               <p className="text-slate-500 text-sm">No pending {activeApprovalTab.toLowerCase()} to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HODExternalApprovals;
