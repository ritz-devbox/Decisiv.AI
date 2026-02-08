
import React, { useRef, useState, useMemo } from 'react';
import { DecisionInput, DecisionDomain } from '../types';
import { 
  SendHorizontal, 
  Upload, 
  Globe, 
  Loader2, 
  Briefcase,
  Scale, 
  User, 
  Home, 
  LineChart, 
  Target, 
  Info, 
  Wand2, 
  Cpu, 
  Stethoscope,
  Settings as GearIcon,
  XCircle,
  Zap,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  FileText,
  X,
  CheckCircle2
} from 'lucide-react';
import { generateScenario } from '../services/geminiService';

interface DecisionFormProps {
  onSubmit: (input: DecisionInput) => void;
  initialData: DecisionInput;
  onChange: (data: DecisionInput) => void;
  isProcessing?: boolean;
}

const LogicTooltip: React.FC<{ title: string; purpose: string; impact: string; align?: 'center' | 'left' | 'right' }> = ({ title, purpose, impact, align = 'center' }) => {
  const alignClasses = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-0 translate-x-0',
    right: 'right-0 translate-x-0'
  };

  const arrowClasses = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-12 -translate-x-1/2',
    right: 'right-12 -translate-x-1/2'
  };

  return (
    <div className={`absolute top-[calc(100%+2.5rem)] w-[400px] max-w-[90vw] p-10 glass-dark border border-white/20 rounded-[48px] shadow-[0_50px_150px_rgba(0,0,0,0.95)] opacity-0 group-hover:opacity-100 pointer-events-none transition-premium z-[99999] -translate-y-6 group-hover:translate-y-0 backdrop-blur-[64px] overflow-hidden premium-border scale-95 group-hover:scale-100 ${alignClasses[align]}`}>
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white leading-none">{title}</span>
        </div>
        <div className="space-y-6">
          <div>
            <span className="text-blue-400 font-black uppercase text-[9px] tracking-[0.3em] block mb-3">System Heuristic:</span>
            <p className="text-[15px] text-slate-100 leading-relaxed font-semibold italic">
              "{purpose}"
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
            <span className="text-emerald-400 font-black uppercase text-[9px] tracking-[0.3em] block mb-3">Inference Impact:</span>
            <p className="text-[14px] text-slate-400 leading-relaxed font-medium">
              {impact}
            </p>
          </div>
        </div>
      </div>
      <div className={`absolute bottom-full w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-[#1e293b] ${arrowClasses[align]}`} />
    </div>
  );
};

const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, initialData, onChange, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isPdf = initialData.image?.startsWith('data:application/pdf');

  const errors = useMemo(() => {
    const list: string[] = [];
    if (!initialData.title.trim()) list.push("TITLE_REQUIRED");
    if (!initialData.context.trim()) list.push("CONTEXT_MISSING");
    return list;
  }, [initialData.title, initialData.context]);

  const isValid = errors.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setShowValidationErrors(false);
      onSubmit(initialData);
    } else {
      setShowValidationErrors(true);
      setTimeout(() => setShowValidationErrors(false), 5000);
    }
  };

  const handleReset = () => {
    onChange({
      title: '',
      context: '',
      constraints: '',
      risks: '',
      domain: 'Business',
      useSearch: false,
      image: undefined
    });
  };

  const handleGenerateScenario = async () => {
    if (!initialData.title) return;
    setIsGeneratingContext(true);
    try {
      const scenario = await generateScenario(initialData.title, initialData.domain || 'Business');
      onChange({ ...initialData, context: scenario });
    } catch (error) {
      console.error("Scenario generation failed:", error);
    } finally {
      setIsGeneratingContext(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...initialData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onChange({ ...initialData, image: undefined });
  };

  const domains: { value: DecisionDomain; icon: React.ReactNode }[] = useMemo(() => [
    { value: 'Business', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'Finance', icon: <LineChart className="w-5 h-5" /> },
    { value: 'Real Estate', icon: <Home className="w-5 h-5" /> },
    { value: 'Clinical', icon: <Stethoscope className="w-5 h-5" /> }, 
    { value: 'Engineering', icon: <GearIcon className="w-5 h-5" /> },
    { value: 'Legal', icon: <Scale className="w-5 h-5" /> },
    { value: 'Personal', icon: <User className="w-5 h-5" /> },
  ], []);

  const activeDomainIcon = useMemo(() => {
    return domains.find(d => d.value === initialData.domain)?.icon || <Target className="w-12 h-12" />;
  }, [initialData.domain, domains]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000 relative">
      <form onSubmit={handleSubmit} className="space-y-16 relative">
        
        {showValidationErrors && errors.length > 0 && (
          <div className="mx-4 flex items-center gap-8 p-8 rounded-[40px] bg-red-600/10 border border-red-500/20 shadow-2xl animate-in slide-in-from-top-6 duration-500 relative z-[100] backdrop-blur-xl">
            <div className="p-4 bg-red-600 rounded-2xl shadow-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.5em] block mb-2">Integrity Fault // Buffer Overflow</span>
              <p className="text-sm font-bold text-red-100 uppercase tracking-tighter">
                {errors.join(" • ").replace(/_/g, " ")}
              </p>
            </div>
          </div>
        )}

        {/* Intelligence Domain Section */}
        <div className="space-y-10 px-4 relative z-[9999]">
          <div className="flex flex-col items-center gap-4 group relative">
            <span className="text-[11px] font-black uppercase tracking-[1em] text-slate-500">Inference Specialization</span>
            <div className="flex items-center gap-6">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
              <div className="cursor-help p-2"><Info className="w-5 h-5 text-slate-700 transition-premium group-hover:text-blue-500" /></div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            </div>
            <LogicTooltip 
              title="Knowledge Mapping"
              purpose="Loads industry-specific logical weights and professional risk-tolerance matrices."
              impact="Decreases inference drift by anchoring the simulation in sectoral standards."
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {domains.map(d => {
              const isActive = initialData.domain === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => onChange({...initialData, domain: d.value})}
                  className={`group relative flex items-center gap-5 px-10 py-5 rounded-[36px] transition-premium border ${
                    isActive 
                      ? 'border-blue-500 bg-blue-600/10 scale-105 z-10 shadow-[0_30px_60px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/15 hover:text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`transition-all duration-500 ${isActive ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-slate-700 group-hover:text-blue-400/60'}`}>
                    {d.icon}
                  </div>
                  <span className={`text-[12px] font-black uppercase tracking-[0.4em] ${isActive ? 'text-white' : ''}`}>
                    {d.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Body */}
        <div className={`glass rounded-[72px] border shadow-2xl relative transition-premium z-[20] group/form ${showValidationErrors && errors.length > 0 ? 'border-red-500/30' : 'border-white/10 focus-within:border-blue-500/40 shadow-[0_100px_200px_rgba(0,0,0,0.75)]'}`}>
           <div className="flex flex-col lg:flex-row">
              <div className="flex-1 flex flex-col p-16 md:p-20 lg:p-24 space-y-16 relative">
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none opacity-0 group-hover/form:opacity-100 transition-opacity duration-1000" />
                 
                 <div className="flex items-center gap-10 lg:gap-12 group relative">
                    <LogicTooltip 
                      title="Resolution Target"
                      purpose="Defines the logical goal and anchors all simulation vectors to this objective."
                      impact="Determines the primary vector for probability branching."
                      align="left"
                    />
                    <div className={`p-6 lg:p-8 rounded-[40px] bg-slate-950/80 border transition-premium shrink-0 ${initialData.title ? 'border-blue-500/40 text-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'border-white/10 text-slate-700'}`}>
                      {React.cloneElement(activeDomainIcon as any, { className: "w-10 h-10 lg:w-12 lg:h-12" })}
                    </div>
                    <div className="flex-1 space-y-4 lg:space-y-6 flex flex-col justify-center min-h-[100px]">
                      <textarea 
                        name="title"
                        rows={2}
                        value={initialData.title}
                        onChange={(e) => onChange({...initialData, title: e.target.value})}
                        placeholder="INITIATE PROTOCOL..."
                        className="bg-transparent border-none focus:outline-none text-2xl md:text-3xl lg:text-4xl font-black w-full placeholder:text-white/5 uppercase tracking-tighter caret-blue-500 text-white selection:bg-blue-500/40 break-words leading-tight resize-none overflow-hidden"
                      />
                      <div className="h-1.5 lg:h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 p-px">
                         <div className={`h-full transition-premium ${initialData.title ? 'bg-blue-600 w-full shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'w-0'}`} />
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5 group relative">
                         <LogicTooltip 
                           title="Inference Context"
                           purpose="Provides qualitative nuance and historical priors for the reasoning core."
                           impact="Refines the accuracy of risk/reward simulations."
                           align="left"
                         />
                         <Cpu className="w-6 h-6 text-blue-500/40" />
                         <span className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-500">Contextual Ingestion</span>
                      </div>
                      <button 
                         type="button"
                         onClick={handleGenerateScenario}
                         disabled={!initialData.title || isGeneratingContext}
                         className="flex items-center gap-4 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-premium bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-400 disabled:opacity-10 shadow-lg active:scale-95"
                       >
                         {isGeneratingContext ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                         {isGeneratingContext ? 'Synthesizing...' : 'AI Augment'}
                      </button>
                    </div>
                    <div className="flex-1 p-10 bg-black/30 rounded-[56px] border border-white/5 focus-within:border-blue-500/30 transition-premium shadow-inner group/textarea">
                      <textarea 
                        name="context"
                        value={initialData.context}
                        onChange={(e) => onChange({...initialData, context: e.target.value})}
                        placeholder="PROVIDE STRATEGIC BACKGROUND, NUANCE, AND NEURAL PRIORS..."
                        className="bg-transparent border-none focus:outline-none text-xl lg:text-2xl font-bold w-full placeholder:text-slate-800 resize-none h-64 lg:h-80 leading-relaxed text-slate-200 caret-blue-500 selection:bg-blue-500/40"
                      />
                    </div>
                 </div>
              </div>

              {/* Sidebar Info Area */}
              <div className="lg:w-[460px] bg-slate-950/60 rounded-b-[72px] lg:rounded-r-[72px] lg:rounded-l-none p-16 lg:p-20 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between gap-20 relative z-[20]">
                 <div className="space-y-16 relative z-10">
                    <div className="flex items-center justify-between">
                       <button 
                         type="button"
                         onClick={handleReset}
                         className="flex items-center gap-4 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-slate-600 hover:text-red-400 hover:border-red-400/40 transition-premium shadow-xl active:scale-95"
                       >
                         <RotateCcw className="w-4 h-4" /> Reset Protocol
                       </button>
                    </div>

                    <div className="space-y-12">
                       <div className="flex items-center justify-between group relative">
                          <LogicTooltip 
                            title="Global Grounding"
                            purpose="Synchronizes inference with live temporal data, news indices, and market reality."
                            impact="Prevents 'logic hallucination' by anchoring in real-world current events."
                            align="right"
                          />
                          <div className="flex items-center gap-5">
                             <Globe className={`w-8 h-8 transition-premium ${initialData.useSearch ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'text-slate-800'}`} />
                             <span className={`text-[12px] font-black uppercase tracking-[0.6em] ${initialData.useSearch ? 'text-white' : 'text-slate-700'}`}>Grounding</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer scale-110">
                             <input type="checkbox" checked={initialData.useSearch} onChange={(e) => onChange({...initialData, useSearch: e.target.checked})} className="sr-only peer" />
                             <div className="w-16 h-8 bg-slate-900 rounded-full border border-white/10 transition-premium peer-checked:bg-blue-600 peer-checked:border-blue-400 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:after:translate-x-8" />
                          </label>
                       </div>

                       <div className="pt-8 border-t border-white/5 space-y-8">
                          <div className="flex items-center justify-between group relative">
                             <LogicTooltip 
                               title="Multi-Modal Ingest"
                               purpose="Analyzes schematics, PDF clinical reports, blueprints, or medical data to ingest technical priors."
                               impact="Adds a dimension of physical-world verification and document audit to strategic reasoning."
                               align="right"
                             />
                             <div className="flex items-center gap-5">
                                <div className="relative">
                                   <ImageIcon className={`w-8 h-8 transition-premium ${initialData.image && !isPdf ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'text-slate-800'}`} />
                                   <FileText className={`w-4 h-4 absolute -bottom-1 -right-1 transition-premium ${isPdf ? 'text-blue-400' : 'text-slate-900'}`} />
                                </div>
                                <span className={`text-[12px] font-black uppercase tracking-[0.6em] ${initialData.image ? 'text-white' : 'text-slate-700'}`}>Prior Asset</span>
                             </div>
                             <button 
                               type="button"
                               onClick={() => fileInputRef.current?.click()}
                               className={`p-3 rounded-xl border transition-premium ${initialData.image ? 'bg-blue-600/20 border-blue-400 text-blue-400' : 'bg-slate-900 border-white/10 text-slate-500 hover:text-white hover:border-blue-500'}`}
                             >
                                <Upload className="w-5 h-5" />
                             </button>
                             <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                          </div>

                          {initialData.image && (
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 group/preview bg-black/40">
                               {isPdf ? (
                                 <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-blue-400/60 p-10">
                                    <FileText className="w-16 h-16" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Captured</span>
                                 </div>
                               ) : (
                                 <img src={initialData.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Asset Preview" />
                               )}
                               <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                               <button 
                                 type="button"
                                 onClick={removeImage}
                                 className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-colors z-20"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                            </div>
                          )}
                       </div>
                    </div>
                    
                    <div className="space-y-8">
                       <span className="text-[11px] font-black uppercase tracking-[1em] text-slate-600">Logical Integrity</span>
                       <div className="p-10 bg-black/50 border border-white/10 rounded-[40px] space-y-6 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Buffer Health</span>
                             <span className={`text-[11px] font-mono font-bold uppercase tracking-widest transition-colors duration-500 flex items-center gap-2 ${errors.length === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                               {errors.length === 0 ? (
                                 <><CheckCircle2 className="w-3.5 h-3.5" /> Ready</>
                               ) : (
                                 errors[0].replace('_', ' ')
                               )}
                             </span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Kernel</span>
                             <span className="text-[11px] font-mono font-bold text-blue-500 uppercase tracking-widest">3.2-PRO-V3</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Resolve Button */}
                 <div className="relative group/btn mt-auto">
                    <div className={`absolute -inset-2 rounded-[48px] blur-3xl opacity-25 group-hover/btn:opacity-100 transition-premium ${isValid ? 'bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-500 animate-pulse' : 'bg-slate-900'}`} />
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="relative w-full py-12 rounded-[48px] font-black text-[16px] uppercase tracking-[1em] transition-premium shadow-2xl active:scale-[0.96] disabled:opacity-5 overflow-hidden flex items-center justify-center gap-6 bg-[#0a1128] border border-blue-500/50 text-white hover:border-blue-400 hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-transparent to-emerald-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-6">
                           Resolve Protocol
                           <SendHorizontal className={`w-6 h-6 transition-transform duration-500 ${isValid ? 'group-hover/btn:translate-x-2' : ''}`} />
                        </span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
};

export default DecisionForm;
