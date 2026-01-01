
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Event } from '../types';
import EventCard from './EventCard';

interface EventCarouselProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ events, onEventClick }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upcoming Events</h2>
        <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all hover:bg-blue-50 px-3 py-1.5 rounded-lg">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-12 -mx-6 px-6 hide-scrollbar snap-x scroll-smooth">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[350px] snap-start h-full"
          >
            <EventCard event={event} compact onClick={onEventClick} />
          </div>
        ))}
        {/* Spacer for better scrolling UX */}
        <div className="flex-shrink-0 w-4" />
      </div>
    </section>
  );
};

export default EventCarousel;
