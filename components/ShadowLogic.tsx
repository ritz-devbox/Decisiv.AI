
import React, { useState } from 'react';
import { ShadowLogicResult } from '../types';
import { Skull, ShieldAlert, Zap, AlertTriangle, Binary, ChevronDown, ChevronUp, Info, HelpCircle, Wand2, Target, MoveRight } from 'lucide-react';

interface ShadowLogicProps {
  result: ShadowLogicResult;
  isLaymanMode?: boolean;
  onExplainFurther?: (flaw: string, component: string) => void;
}

const ShadowLogic: React.FC<ShadowLogicProps> = ({ result, isLaymanMode, onExplainFurther }) => {
  const [isBlackSwanExpanded, setIsBlackSwanExpanded] = useState(true);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-red-600/10 rounded-[28px] border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <Skull className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
              {isLaymanMode ? 'The Failure Map' : 'Shadow Logic Audit'}
            </h3>
            <p className="text-[10px] text-red-500/80 font-black uppercase tracking-[0.4em] mt-1">
              {isLaymanMode ? 'Where things break' : 'Adversarial Fragility Analysis'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-8 py-4 bg-red-600/5 rounded-3xl border border-red-500/20 flex items-center gap-6 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none">
                  {isLaymanMode ? 'Safety Scan' : 'Protocol Integrity'}
                </span>
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">Status: Compromised</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Vulnerability Map */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-4 mb-2">
             <Binary className="w-4 h-4 text-slate-300" />
             <span className="text-[11px] font-black text-slate-200 uppercase tracking-[0.3em]">Fragility Distribution Matrix</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {result.vulnerabilityMap.map((v, i) => (
              <div key={i} className={`glass p-10 rounded-[56px] border bg-slate-950/40 space-y-8 group transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${isLaymanMode ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-red-500/10 hover:border-red-500/30 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]'}`}>
                {/* Decorative background number */}
                <div className="absolute -top-6 -right-6 text-[120px] font-black text-white/[0.04] pointer-events-none select-none italic">{i + 1}</div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-xl ${isLaymanMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                        {isLaymanMode ? <Wand2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                       </div>
                       <span className={`text-[11px] font-black uppercase tracking-widest ${isLaymanMode ? 'text-emerald-400' : 'text-white'}`}>{v.component}</span>
                     </div>
                     <div className="text-right">
                        <span className="text-2xl font-black text-white leading-none">{v.impact}%</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Severity</p>
                     </div>
                  </div>

                  <div className="p-6 bg-slate-950/60 rounded-[32px] border border-white/5 min-h-[100px] flex items-center">
                    <p className={`text-lg font-semibold leading-relaxed italic tracking-tight ${isLaymanMode ? 'text-emerald-50/90' : 'text-slate-100'}`}>
                      "{v.flaw}"
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-4 relative z-10">
                  <button 
                    onClick={() => onExplainFurther?.(v.flaw, v.component)}
                    className={`w-full flex items-center justify-center gap-3 py-4 border rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isLaymanMode ? 'bg-emerald-600/10 hover:bg-emerald-600 border-emerald-500/20 text-emerald-400 hover:text-white' : 'bg-red-600/10 hover:bg-red-600 border-red-500/20 text-red-400 hover:text-white'}`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    {isLaymanMode ? 'What does this mean?' : 'Initiate Root-Cause Query'}
                  </button>
                  <div className="h-1.5 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                     <div className={`h-full transition-all duration-1000 ${isLaymanMode ? 'bg-emerald-500' : 'bg-red-600'}`} style={{ width: `${v.impact}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Black Swan Module */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex items-center gap-4 mb-2">
             <AlertTriangle className="w-4 h-4 text-slate-300" />
             <span className="text-[11px] font-black text-slate-200 uppercase tracking-[0.3em]">Statistical Outlier Analysis</span>
          </div>
          <div className={`glass rounded-[64px] border transition-all duration-1000 overflow-hidden relative group cursor-pointer h-full flex flex-col ${isBlackSwanExpanded ? 'border-red-500/60 bg-red-600/[0.05] p-12' : 'border-red-500/40 bg-red-600/[0.03] p-10 hover:bg-red-600/[0.06]'}`}
               onClick={() => setIsBlackSwanExpanded(!isBlackSwanExpanded)}>
            
            {/* Visual Flare */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 mb-12">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                    <Zap className={`w-7 h-7 text-red-500 ${isBlackSwanExpanded ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 block mb-1">
                      {isLaymanMode ? 'The Nightmare' : 'Black Swan Protocol'}
                    </span>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Type: Statistical Outlier</span>
                  </div>
               </div>
               {isBlackSwanExpanded ? <ChevronUp className="w-6 h-6 text-red-400" /> : <ChevronDown className="w-6 h-6 text-red-400" />}
            </div>

            <div className="space-y-10 flex-1 flex flex-col relative z-10">
              <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9] border-l-4 border-red-600 pl-6">
                {result.blackSwanEvent.title}
              </h4>
              
              <div className={`transition-all duration-1000 overflow-hidden flex-1 flex flex-col gap-10 ${isBlackSwanExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <MoveRight className="w-4 h-4 text-red-500/60" />
                       <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
                         {isLaymanMode ? 'Possible Cause' : 'Scenario Trigger'}
                       </span>
                    </div>
                    <div className="p-8 bg-slate-950/80 rounded-[40px] border border-red-500/20 shadow-inner group-hover:border-red-500/40 transition-colors">
                       <p className="text-lg text-red-100/90 font-medium italic leading-relaxed">"{result.blackSwanEvent.trigger}"</p>
                    </div>
                 </div>

                 <div className="mt-auto flex items-center justify-between p-8 bg-red-950/40 rounded-[40px] border border-red-500/10">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-red-400/60 uppercase tracking-widest mb-1">
                         {isLaymanMode ? 'How bad?' : 'Severity Tier'}
                       </span>
                       <span className="text-3xl font-black text-red-500 uppercase tracking-tighter">{result.blackSwanEvent.severity}</span>
                    </div>
                    <div className="w-16 h-16 bg-red-500/20 rounded-3xl flex items-center justify-center animate-pulse border border-red-500/30">
                       <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                 </div>
              </div>
            </div>

            {!isBlackSwanExpanded && (
               <div className="mt-8 flex items-center gap-3 text-[10px] font-black text-red-400/60 uppercase tracking-widest animate-pulse">
                  <span>Open Breakdown</span>
                  <ChevronDown className="w-4 h-4" />
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Verdict Section */}
      <div className={`glass rounded-[72px] p-16 md:p-24 border bg-red-600/[0.01] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-1000 ${isLaymanMode ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
         <div className="flex flex-col lg:flex-row gap-16 relative z-10">
            <div className="lg:w-1/3 space-y-8">
               <div className="w-20 h-20 bg-red-600/10 rounded-[32px] border border-red-500/20 flex items-center justify-center shadow-xl">
                 <Skull className="w-10 h-10 text-red-500" />
               </div>
               <div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                   {isLaymanMode ? "The Bitter Truth" : "Antagonist Verdict"}
                 </h3>
                 <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em] leading-relaxed italic opacity-80">
                   {isLaymanMode ? "A simple summary of why to be careful." : "Synthesized Red-Team logical teardown."}
                 </p>
               </div>
            </div>
            <div className={`lg:w-2/3 p-12 bg-slate-950/80 rounded-[56px] border shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] transition-all ${isLaymanMode ? 'border-emerald-500/10 hover:border-emerald-500/20' : 'border-red-500/10 hover:border-red-500/20'}`}>
               <p className={`text-2xl md:text-3xl leading-relaxed font-semibold italic tracking-tight ${isLaymanMode ? 'text-emerald-50/90' : 'text-red-100/90'}`}>
                 "{result.antagonistVerdict}"
               </p>
            </div>
         </div>
         {/* Decorative Icon Background */}
         <div className="absolute -bottom-24 -right-24 p-24 opacity-5 pointer-events-none rotate-12">
            <Binary className="w-80 h-80 text-red-500" />
         </div>
      </div>
    </div>
  );
};

export default ShadowLogic;

