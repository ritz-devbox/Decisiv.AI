
import React, { useState } from 'react';
import { WarGameResult } from '../types';
import { TrendingUp, TrendingDown, Target, ShieldCheck, BrainCircuit, Scale, AlertTriangle, Check } from 'lucide-react';

interface WarGamingProps {
  result: WarGameResult;
  isLaymanMode?: boolean;
}

const WarGaming: React.FC<WarGamingProps> = ({ result, isLaymanMode }) => {
  const [adoptedPath, setAdoptedPath] = useState<string | null>(null);

  const handleAdopt = (id: string) => {
    setAdoptedPath(id);
    // Visual feedback for adoption
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-4">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-purple-600/10 rounded-2xl border border-purple-500/20">
            <BrainCircuit className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-[0.4em]">Strategic War-Game</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Parallel Universe Simulation // Logical Branching</p>
          </div>
        </div>
        <div className="glass px-8 py-4 rounded-3xl border border-white/5 flex items-center gap-6">
           <Scale className="w-5 h-5 text-blue-400" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comparative Matrix: 16k Reasoning Budget Applied</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {result.paths.map((path) => (
          <div 
            key={path.id} 
            className={`glass rounded-[56px] p-12 border transition-all duration-700 relative overflow-hidden group/path ${
              adoptedPath === path.id 
                ? 'border-blue-500 bg-blue-500/[0.05] ring-4 ring-blue-500/20' 
                : result.recommendedPathId === path.id 
                  ? 'border-emerald-500/40 bg-emerald-500/[0.02] shadow-[0_40px_100px_rgba(16,185,129,0.1)]' 
                  : 'border-white/5 bg-white/[0.01]'
            }`}
          >
            {result.recommendedPathId === path.id && !adoptedPath && (
              <div className="absolute top-8 right-8 flex items-center gap-3 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl animate-bounce">
                <Target className="w-3.5 h-3.5" /> Recommended Vector
              </div>
            )}
            
            {adoptedPath === path.id && (
              <div className="absolute top-8 right-8 flex items-center gap-3 px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                <Check className="w-3.5 h-3.5" /> Path Adopted
              </div>
            )}

            <div className="space-y-10 relative z-10">
              <div>
                <span className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.6em] block mb-4">Simulated Strategy //</span>
                <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-none">{path.strategyName}</h4>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-950/40 rounded-[32px] border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Success Prob.</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{path.successProbability}%</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${path.successProbability}%` }} />
                  </div>
                </div>
                <div className="p-6 bg-slate-950/40 rounded-[32px] border border-white/5 space-y-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attrition Risk</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{path.attritionRate}%</span>
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${path.attritionRate}%` }} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Terminal Outcome Synthesis</span>
                <div className="p-8 bg-slate-950/60 rounded-[40px] border border-white/5">
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{isLaymanMode ? path.simpleOutcome : path.terminalOutcome}"
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6 pt-4">
                <button 
                  onClick={() => handleAdopt(path.id)}
                  disabled={adoptedPath === path.id}
                  className={`w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-3 ${
                    adoptedPath === path.id 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 cursor-default' 
                      : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white hover:border-blue-500/50'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  {adoptedPath === path.id ? 'Active Strategy' : 'Adopt This Branch'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[64px] p-12 md:p-16 border border-purple-500/20 bg-purple-500/[0.01] shadow-2xl relative overflow-hidden">
         <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="lg:w-1/3 space-y-6">
               <div className="p-4 bg-purple-600/10 rounded-2xl border border-purple-500/20 inline-block">
                  <ShieldCheck className="w-8 h-8 text-purple-400" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Comparative Deep-Dive</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed italic">
                 The Logic Core has evaluated entropy variance across both strategic vectors.
               </p>
            </div>
            <div className="lg:w-2/3 p-10 bg-slate-950/60 rounded-[48px] border border-white/5 shadow-inner">
               <p className="text-slate-300 text-lg font-medium leading-relaxed">
                 {isLaymanMode ? result.simpleComparison : result.comparativeAnalysis}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WarGaming;
