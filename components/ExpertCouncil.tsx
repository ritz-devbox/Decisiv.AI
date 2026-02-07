
import React from 'react';
import { CouncilDebate } from '../types';
import { Handshake, UserCircle, ShieldCheck, AlertCircle, Quote } from 'lucide-react';

interface ExpertCouncilProps {
  result: CouncilDebate;
}

const ExpertCouncil: React.FC<ExpertCouncilProps> = ({ result }) => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-4">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
            <Handshake className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-[0.4em]">Expert Council Debate</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Persona-Driven Heuristics // Cognitive Diversity Matrix</p>
          </div>
        </div>
        <div className="glass px-10 py-5 rounded-3xl border border-white/5 flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Board Consensus</span>
              <span className="text-2xl font-black text-white">Consolidated Verdict</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {result.experts.map((exp, i) => (
          <div key={i} className="glass rounded-[40px] p-10 border border-white/10 bg-white/[0.01] hover:border-blue-500/30 transition-all duration-700 group relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                    <UserCircle className="w-10 h-10 opacity-50" />
                  </div>
                  <div>
                    <h5 className="text-[12px] font-black text-white uppercase tracking-tight">{exp.persona.name}</h5>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{exp.persona.title}</p>
                  </div>
               </div>
               <div className={`text-[10px] font-black px-3 py-1 rounded-lg border ${
                 exp.verdict === 'Approve' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                 exp.verdict === 'Oppose' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                 'bg-slate-500/10 border-white/10 text-slate-400'
               }`}>
                 {exp.verdict}
               </div>
            </div>

            <div className="flex-1 space-y-6 relative">
               <Quote className="absolute -top-4 -left-4 w-12 h-12 text-blue-500/5" />
               <p className="text-[14px] text-slate-300 leading-relaxed font-medium italic relative z-10">
                 "{exp.argument}"
               </p>
            </div>

            <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
               <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Logic Style</span>
                 <span className="text-[10px] font-bold text-blue-400/60">{exp.persona.logicStyle}</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Confidence</span>
                 <span className="text-sm font-black text-white">{exp.confidence}%</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[56px] p-16 border border-blue-500/20 bg-blue-500/[0.01] shadow-2xl relative overflow-hidden">
         <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="lg:w-1/3 space-y-6">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Council Consensus</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed italic">
                 Final unified resolution from the simulated Expert Board.
               </p>
            </div>
            <div className="lg:w-2/3 p-10 bg-slate-950/60 rounded-[40px] border border-white/5 shadow-inner">
               <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
                 {result.consensusSummary}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExpertCouncil;
