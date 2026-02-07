
import React, { useState } from 'react';
import { ProtocolExecutionPlan, StakeholderBrief, ExecutionAction } from '../types';
import { Rocket, Send, ShieldCheck, Mail, Users, Loader2, CheckCircle, Binary, Zap, ExternalLink, Link2 } from 'lucide-react';
import { transmitProtocol } from '../services/geminiService';

interface ProtocolExecutionProps {
  plan: ProtocolExecutionPlan;
  isLaymanMode?: boolean;
}

const ProtocolExecution: React.FC<ProtocolExecutionProps> = ({ plan, isLaymanMode }) => {
  const [transmittingBriefs, setTransmittingBriefs] = useState<Set<string>>(new Set());
  const [confirmedBriefs, setConfirmedBriefs] = useState<Map<string, string>>(new Map());
  const [syncingActions, setSyncingActions] = useState<Set<string>>(new Set());
  const [syncedActions, setSyncedActions] = useState<Set<string>>(new Set());

  const handleTransmit = async (brief: StakeholderBrief) => {
    if (transmittingBriefs.has(brief.id) || confirmedBriefs.has(brief.id)) return;
    setTransmittingBriefs(prev => new Set(prev).add(brief.id));
    try {
      const confirmationCode = await transmitProtocol(brief);
      await new Promise(r => setTimeout(r, 2000));
      setConfirmedBriefs(prev => new Map(prev).set(brief.id, confirmationCode));
    } catch (e) {
    } finally {
      setTransmittingBriefs(prev => {
        const next = new Set(prev);
        next.delete(brief.id);
        return next;
      });
    }
  };

  const handleSyncToPlatform = async (action: ExecutionAction) => {
    setSyncingActions(prev => new Set(prev).add(action.id));
    // Simulating million-dollar API integration
    await new Promise(r => setTimeout(r, 1500));
    setSyncedActions(prev => new Set(prev).add(action.id));
    setSyncingActions(prev => {
      const next = new Set(prev);
      next.delete(action.id);
      return next;
    });
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 glass rounded-[56px] p-12 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden bg-white/[0.01]">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.5em] text-slate-500">Tactical Roadmap</h3>
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-1">Autonomous Agent Deployment Plan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
               <Link2 className="w-3 h-3 text-emerald-500" />
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">External Connectors Ready</span>
            </div>
          </div>
          <div className="space-y-12 relative">
            <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-blue-600/60 via-slate-800 to-blue-600/60 border-l border-dashed border-blue-400/20" />
            {plan.actions.map((action, idx) => (
              <div key={action.id} className="flex gap-10 group/item hover:translate-x-4 transition-all duration-700">
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-sm font-black text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all shadow-xl">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{action.title}</h4>
                    <div className="flex items-center gap-4">
                       <button 
                        onClick={() => handleSyncToPlatform(action)}
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${
                          syncedActions.has(action.id) ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-blue-500'
                        }`}
                       >
                         {syncingActions.has(action.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                         {syncedActions.has(action.id) ? 'Platform Synced' : 'Sync to Asana/Jira'}
                       </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                    {isLaymanMode ? action.simpleDescription : action.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Lead: {action.department}</span>
                    </div>
                    <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      action.phase === 'Immediate' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                      action.phase === 'Secondary' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {action.phase}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-10">
          <div className="flex items-center gap-6 mb-2">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Send className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.5em] text-slate-500">Intelligence Briefs</h3>
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-1">Autonomous Draft Generation</p>
            </div>
          </div>
          {plan.briefs.map((brief) => {
            const isTransmitting = transmittingBriefs.has(brief.id);
            const confirmation = confirmedBriefs.get(brief.id);
            return (
              <div key={brief.id} className={`glass rounded-[40px] p-10 border transition-all shadow-xl relative overflow-hidden bg-white/[0.01] group/brief ${confirmation ? 'border-emerald-500/40' : 'border-white/10 hover:border-emerald-500/30'}`}>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <Mail className={`w-4 h-4 ${confirmation ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{brief.audience}</span>
                  </div>
                  <div className={`px-3 py-1 border rounded-lg ${confirmation ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${confirmation ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {confirmation ? 'Transmitted' : `${brief.tone} Tone`}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 relative z-10 mt-6">
                  <h4 className="text-sm font-black text-slate-300 uppercase tracking-tight">{brief.subject}</h4>
                  <div className={`p-6 rounded-3xl border shadow-inner transition-colors ${confirmation ? 'bg-emerald-950/20 border-emerald-500/10' : 'bg-slate-950/80 border-white/5'}`}>
                    <p className={`text-[12px] leading-relaxed font-medium italic whitespace-pre-wrap ${confirmation ? 'text-emerald-100/60' : 'text-slate-400'}`}>
                      {brief.content}
                    </p>
                  </div>
                </div>
                {confirmation ? (
                  <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Digital Signature</span>
                        <span className="text-[10px] font-mono font-bold text-white">{confirmation}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => handleTransmit(brief)} disabled={isTransmitting} className="mt-8 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-emerald-600 hover:border-emerald-400">
                    {isTransmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Finalize & Transmit</>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProtocolExecution;
