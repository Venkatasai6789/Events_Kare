
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Event } from '../../types';

interface EventDetailProps {
  event: Event;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  return (
    <div className="absolute top-[80px] left-0 right-0 z-10 bg-white min-h-screen">
      <div className="animate-in fade-in duration-500 pb-20 bg-slate-50">
        <div className="w-full h-[400px] relative">
          <img src={event.image} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <button onClick={onBack} className="absolute top-8 left-8 bg-white/20 backdrop-blur-xl border p-3 rounded-full text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="absolute bottom-12 left-12">
            <h1 className="text-5xl font-black text-white">{event.title}</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-12 -mt-10 relative z-20 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border shadow-xl">
            <h3 className="text-xl font-black mb-6">About Event</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{event.description}</p>
          </div>
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border shadow-2xl h-fit">
            <p className="text-3xl font-black mb-8">{event.registrationFees}</p>
            <a href={event.registrationUrl} target="_blank" className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-bold mb-4">
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
