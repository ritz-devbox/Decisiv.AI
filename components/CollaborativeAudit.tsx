
import React from 'react';
import { CollaborativeAudit as AuditType } from '../types';
import { Users, ShieldCheck, Scale, Briefcase, CheckCircle } from 'lucide-react';

interface CollaborativeAuditProps {
  audit: AuditType;
  isLaymanMode?: boolean;
}

const CollaborativeAudit: React.FC<CollaborativeAuditProps> = ({ audit, isLaymanMode }) => {
  const getAgentIcon = (role: string) => {
    if (role.toLowerCase().includes('financial')) return <Briefcase className="w-5 h-5 text-blue-400" />;
    if (role.toLowerCase().includes('ethical')) return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    if (role.toLowerCase().includes('legal')) return <Scale className="w-5 h-5 text-purple-400" />;
    return <Users className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-4">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-[0.4em]">Collaborative Logic Audit</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Simulated Multi-Agent Peer Review // Consensus Extraction</p>
          </div>
        </div>
        
        <div className="glass px-10 py-5 rounded-3xl border border-white/5 flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Audit Consensus</span>
              <span className="text-2xl font-black text-white">{audit.consensusScore}%</span>
           </div>
           <div className="w-px h-10 bg-white/10" />
           <div className={`p-3 rounded-xl border ${audit.consensusScore > 70 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
              <CheckCircle className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {audit.nodes.map((node, i) => (
          <div key={i} className="glass rounded-[40px] p-10 border border-white/10 bg-white/[0.01] hover:border-emerald-500/30 transition-all duration-700 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-950 border border-white/5 rounded-2xl group-hover:scale-110 transition-transform shadow-xl">
                    {getAgentIcon(node.agentRole)}
                  </div>
                  <span className="text-[11px] font-black text-white uppercase tracking-tight">{node.agentRole}</span>
               </div>
               <div className={`text-[10px] font-black px-3 py-1 rounded-lg border ${
                 node.sentiment === 'Supportive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                 node.sentiment === 'Critical' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                 'bg-slate-500/10 border-white/10 text-slate-400'
               }`}>
                 {node.sentiment}
               </div>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed font-medium italic mb-10 min-h-[80px]">
              "{node.perspective}"
            </p>
            <div className="flex items-center justify-between pt-8 border-t border-white/5">
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Confidence</span>
               <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-white">{node.score}%</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-[48px] p-12 border border-emerald-500/20 bg-emerald-500/[0.01] shadow-2xl relative overflow-hidden">
         <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="lg:w-1/3 space-y-6">
               <div className="p-4 bg-emerald-600/10 rounded-2xl border border-emerald-500/20 inline-block">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Final Audit Verdict</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed italic">
                 Consolidated intelligence from multiple specialized logic streams.
               </p>
            </div>
            <div className="lg:w-2/2 p-10 bg-slate-950/60 rounded-[40px] border border-white/5 shadow-inner">
               <p className="text-slate-300 text-lg font-medium leading-relaxed">
                 {isLaymanMode ? audit.simpleSummary : audit.terminalSummary}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CollaborativeAudit;
