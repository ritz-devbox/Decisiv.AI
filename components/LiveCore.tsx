
import React from 'react';
import { DecisionResponse } from '../types';
import StrategicInterrogation from './StrategicInterrogation';
import { Activity, ShieldAlert, Cpu, Sparkles, Binary, Globe, FileCheck } from 'lucide-react';

interface LiveCoreProps {
  isLaymanMode: boolean;
  activeProtocol: DecisionResponse | null;
  forceQuery?: { text: string; timestamp: number } | null;
  onQueryConsumed?: () => void;
}

const LiveCore: React.FC<LiveCoreProps> = ({ isLaymanMode, activeProtocol, forceQuery, onQueryConsumed }) => {
  return (
    <div className="min-h-screen flex flex-col space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
        <div className="space-y-6 max-w-2xl">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-2xl">
                 <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Live Neural Core Active //</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">The Interrogation <span className="text-blue-500">Deck.</span></h2>
           
           {activeProtocol && (
             <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl flex items-center gap-5 mt-8 animate-in slide-in-from-left-4 duration-700">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Current Protocol Context:</span>
                   <p className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1">{activeProtocol.decision}</p>
                </div>
             </div>
           )}

           <p className="text-slate-400 text-lg md:text-xl font-medium italic">Speak directly with the Logic Engine. Interrogate trade-offs, upload physical assets, and stress-test strategic assumptions in real-time.</p>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full lg:w-auto self-center lg:self-start">
           {[
             { label: 'Latency', value: '142ms', icon: Binary },
             { label: 'Neural Load', value: '3.4 PFlops', icon: Cpu },
             { label: 'Safety Sync', value: 'Nominal', icon: Globe },
             { label: 'Thinking Modality', value: 'Recursive', icon: Sparkles }
           ].map(stat => (
             <div key={stat.label} className="glass p-6 rounded-[32px] border border-white/5 space-y-4 min-w-[180px]">
                <div className="flex items-center gap-3">
                   <stat.icon className="w-4 h-4 text-blue-500" />
                   <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{stat.label}</span>
                </div>
                <p className="text-lg font-black text-white uppercase">{stat.value}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-[56px] blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-1000" />
         <div className="relative">
            <StrategicInterrogation 
              decision={activeProtocol || { decision: "GENERAL INTELLIGENCE MODE", simpleDecision: "I am ready to help you decide.", reasons: [] } as any} 
              context="Awaiting neural probe..." 
              laymanMode={isLaymanMode} 
              forceQuery={forceQuery}
              onQueryConsumed={onQueryConsumed}
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
         {[
           { 
             title: 'Vision-Sensing', 
             desc: 'Hold physical documents or complex diagrams to the camera for real-time OCR and logical ingestion.', 
             icon: ShieldAlert,
             active: true
           },
           { 
             title: 'Voice-Sensing', 
             desc: 'Proprietary native audio processing for ultra-low latency logical interrogation.', 
             icon: Activity,
             active: true
           },
           { 
             title: 'Contextual Grounding', 
             desc: 'Every word spoken is cross-referenced with real-time global news indices.', 
             icon: Globe,
             active: true
           }
         ].map(feature => (
           <div key={feature.title} className="glass rounded-[40px] p-10 border border-white/5 space-y-6 hover:border-blue-500/20 transition-all">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 inline-block">
                 <feature.icon className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-xl font-black text-white uppercase tracking-tight">{feature.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed italic font-medium">"{feature.desc}"</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default LiveCore;
