
import React from 'react';
import { FutureForecast } from '../types';
import { Eye, Calendar, Globe, TrendingUp, TrendingDown, BookOpen } from 'lucide-react';

interface ChronosMirrorProps {
  result: FutureForecast;
}

const ChronosMirror: React.FC<ChronosMirrorProps> = ({ result }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-amber-600/10 rounded-2xl border border-amber-500/20">
            <Eye className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-[0.4em]">Chronos Mirror Forecast</h3>
            <p className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest mt-1">Temporal Synthesis // Future Aftermath</p>
          </div>
        </div>
        <div className="px-8 py-4 bg-amber-600/5 rounded-3xl border border-amber-500/20 flex items-center gap-6">
           <Calendar className="w-5 h-5 text-amber-400" />
           <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Time-Sync: 10-Year Horizon Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {result.headlines.map((h, i) => (
          <div key={i} className="glass rounded-[56px] p-10 border border-white/5 bg-white/[0.01] hover:border-amber-500/30 transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
               <span className="px-4 py-1.5 bg-amber-600/10 border border-amber-500/20 rounded-xl text-[9px] font-black text-amber-500 uppercase tracking-widest">{h.timeframe}</span>
               {h.sentiment === 'Bullish' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
            </div>
            
            <div className="space-y-6 flex-1">
               <div className="flex items-center gap-3 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                  <Globe className="w-3.5 h-3.5" /> {h.source}
               </div>
               <h4 className="text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                 {h.headline}
               </h4>
               <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                 "{h.summary}"
               </p>
            </div>

            <div className="pt-8 mt-8 border-t border-white/5">
               <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-amber-500 transition-colors">
                  <BookOpen className="w-4 h-4" /> Full Archive Entry
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[64px] p-16 border border-amber-500/20 bg-amber-600/[0.01] shadow-2xl relative overflow-hidden">
         <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="lg:w-1/3 space-y-6">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">The Legacy Synthesis</h3>
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] leading-relaxed italic">
                 Long-term historical impact report based on today's branch.
               </p>
            </div>
            <div className="lg:w-2/3 p-10 bg-slate-950/60 rounded-[48px] border border-white/5 shadow-inner">
               <p className="text-slate-300 text-lg font-medium leading-relaxed">
                 {result.legacyImpact}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChronosMirror;
