
import React from 'react';
import { RiskPoint } from '../types';

interface RiskMatrixProps {
  risks: RiskPoint[];
}

const RiskMatrix: React.FC<RiskMatrixProps> = ({ risks }) => {
  return (
    <div className="w-full aspect-square bg-slate-950/40 rounded-[40px] border border-white/5 p-8 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20 pointer-events-none">
        <div className="border-r border-b border-white/10 bg-emerald-500/5" />
        <div className="border-b border-white/10 bg-amber-500/5" />
        <div className="border-r border-white/10 bg-amber-500/5" />
        <div className="bg-red-500/5" />
      </div>

      <div className="flex-1 relative">
        {/* Y Axis Label */}
        <div className="absolute -left-4 top-1/2 -rotate-90 origin-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
          Severity Impact
        </div>
        
        {/* X Axis Label */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
          Probability %
        </div>

        {risks.map((risk, i) => (
          <div 
            key={i}
            className="absolute group cursor-help transition-all hover:scale-125 hover:z-50"
            style={{ 
              left: `${risk.probability}%`, 
              bottom: `${risk.severity}%`,
              transform: 'translate(-50%, 50%)'
            }}
          >
            <div className={`w-4 h-4 rounded-full border-2 ${
              risk.probability * risk.severity > 3000 ? 'bg-red-500 border-red-400 animate-pulse' : 
              risk.probability * risk.severity > 1500 ? 'bg-amber-500 border-amber-400' :
              'bg-emerald-500 border-emerald-400'
            } shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />
            
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-32 glass-dark p-3 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-90 group-hover:scale-100 shadow-2xl">
              <p className="text-[9px] font-black text-white uppercase tracking-tighter mb-1">{risk.label}</p>
              <div className="flex justify-between text-[7px] font-bold text-slate-500 uppercase">
                <span>P: {risk.probability}%</span>
                <span>S: {risk.severity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMatrix;
