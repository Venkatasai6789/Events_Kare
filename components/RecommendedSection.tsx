
import React from 'react';
import { Target, ArrowRight, Lightbulb } from 'lucide-react';

const RecommendedSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
      <div className="relative z-10 lg:flex items-center justify-between gap-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full mb-6">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Recommended for You</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-5 tracking-tight leading-tight">
            Complete your Group 2 requirements!
          </h2>
          <p className="text-blue-100/80 text-lg mb-8 leading-relaxed font-medium">
            You're only <span className="text-white font-black underline decoration-amber-400 decoration-2">4 credits away</span> from completing this milestone. Joining the "International Cultural Festival" will get you closer to your goal.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-black text-sm hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
              Explore Group 2 Events <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
              Dismiss
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-400/20 blur-[60px] rounded-full animate-pulse" />
            <div className="w-40 h-40 bg-white/20 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/30">
              <Lightbulb className="w-20 h-20 text-white opacity-90 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px]" />
    </section>
  );
};

export default RecommendedSection;
