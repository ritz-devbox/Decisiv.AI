
import React from 'react';
import { TimelineEvent } from '../types';
import { CheckCircle2, Search, Zap, Target, Clock, Binary } from 'lucide-react';

interface LogicTimelineProps {
  events: TimelineEvent[];
}

const LogicTimeline: React.FC<LogicTimelineProps> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Input': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'Grounding': return <Search className="w-4 h-4 text-emerald-400" />;
      case 'Simulation': return <Binary className="w-4 h-4 text-purple-400" />;
      case 'Resolution': return <Target className="w-4 h-4 text-orange-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="py-12 px-8 glass rounded-[48px] border border-white/5 relative overflow-hidden bg-white/[0.01]">
      <div className="flex items-center gap-6 mb-12">
         <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400" />
         </div>
         <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Neural Evolution Timeline</h4>
      </div>

      <div className="relative space-y-12">
        <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-gradient-to-b from-blue-600/40 via-slate-800 to-blue-600/40" />
        
        {events.map((event, idx) => (
          <div key={event.id} className="flex gap-10 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-700 bg-slate-950 ${idx === events.length - 1 ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-110' : 'border-white/10'}`}>
              {getIcon(event.type)}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-1">
                 <h5 className="text-sm font-black text-white uppercase tracking-tight">{event.label}</h5>
                 <span className="text-[9px] font-mono text-slate-600 uppercase">{new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogicTimeline;
