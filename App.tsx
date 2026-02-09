
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  AppView, 
  DecisionInput, 
  DecisionResponse, 
  EngineState, 
  SavedEntry, 
  EngineSettings 
} from './types';
import DecisionForm from './components/DecisionForm';
import DecisionDisplay from './components/DecisionDisplay';
import HistoryHub from './components/HistoryHub';
import LiveCore from './components/LiveCore';
import SampleSelector, { SAMPLES } from './components/SampleSelector';
import { getDecision } from './services/geminiService';
import { ShieldCheck, Sparkles, Brain, Cpu, Zap, LayoutGrid, Clock, Radio, AlertTriangle, RefreshCw, Activity, Key, ChevronRight, ExternalLink, Heart, Github, Linkedin, Twitter, X, User } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [view, setView] = useState<AppView>('HUB');
  const [engineState, setEngineState] = useState<EngineState>(EngineState.IDLE);
  const [isLaymanMode, setIsLaymanMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thinkingLog, setThinkingLog] = useState('INITIALIZING_CORE');
  const [errorType, setErrorType] = useState<'GENERIC' | 'QUOTA' | 'AUTH'>('GENERIC');
  const [isDevProfileOpen, setIsDevProfileOpen] = useState(false);
  
  const [formData, setFormData] = useState<DecisionInput>({
    title: '',
    context: '',
    constraints: '',
    risks: '',
    domain: 'Business',
    useSearch: false
  });
  
  const [result, setResult] = useState<DecisionResponse | null>(null);
  const [history, setHistory] = useState<SavedEntry[]>([]);
  const [activeProtocol, setActiveProtocol] = useState<DecisionResponse | null>(null);
  const [forceQuery, setForceQuery] = useState<{ text: string; timestamp: number } | null>(null);

  const progressIntervalRef = useRef<number | null>(null);

  const settings: EngineSettings = {
    voiceName: 'Zephyr',
    speechRate: 1.0
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) setIsAuthorized(true);
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
    
    const saved = localStorage.getItem('decisiv_history');
    if (saved) setHistory(JSON.parse(saved));
    
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleInitializeCore = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
    // Race condition mitigation: Proceed immediately after trigger
    setIsAuthorized(true);
  };

  const handleSubmit = async (input: DecisionInput) => {
    if (engineState === EngineState.LOADING) return;

    setEngineState(EngineState.LOADING);
    setProgress(0);
    setResult(null);
    setErrorType('GENERIC');
    
    const logs = [
      'BOOTSTRAPPING_NEURAL_WEIGHTS',
      'SYNCHRONIZING_WEB_INDICES',
      'CALIBRATING_HEURISTIC_MATRICES',
      'SIMULATING_ENTROPY_VECTORS',
      'EXECUTING_WAR_GAME_BRANCHES',
      'CONDUCTING_MULTI_AGENT_AUDIT',
      'SYNTHESIZING_STRATEGIC_VERDICT',
      'BUILDING_TACTICAL_ROADMAP'
    ];

    let logIdx = 0;
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        if (prev >= 98) return 98;
        const inc = Math.random() * 2.2; 
        const next = Math.min(98, prev + inc);
        const currentLogTarget = (logIdx + 1) * (100 / logs.length);
        if (next > currentLogTarget) {
            logIdx = Math.min(logIdx + 1, logs.length - 1);
            setThinkingLog(logs[logIdx]);
        }
        return next;
      });
    }, 280);

    try {
      const response = await getDecision(input, settings, isLaymanMode);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setResult(response);
      setActiveProtocol(response);
      const newEntry: SavedEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        input,
        response
      };
      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem('decisiv_history', JSON.stringify(newHistory));
      setProgress(100);
      setEngineState(EngineState.SUCCESS);
    } catch (error: any) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      const errStr = JSON.stringify(error).toLowerCase();
      if (errStr.includes('quota') || errStr.includes('429')) {
        setErrorType('QUOTA');
      } else if (errStr.includes('key') || errStr.includes('auth') || errStr.includes('unauthorized') || errStr.includes('entity was not found')) {
        setErrorType('AUTH');
        setIsAuthorized(false); 
      } else {
        setErrorType('GENERIC');
      }
      setEngineState(EngineState.ERROR);
    }
  };

  const handleLoadEntry = (entry: SavedEntry) => {
    setFormData(entry.input);
    setResult(entry.response);
    setActiveProtocol(entry.response);
    setView('HUB');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 w-full max-w-2xl text-center space-y-16 animate-in fade-in zoom-in-95 duration-1000">
           <div className="flex flex-col items-center gap-10">
              <div className="w-32 h-32 bg-blue-600 rounded-[40px] flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.5)]">
                 <ShieldCheck className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-6xl font-black uppercase tracking-tighter">Decisiv.<span className="text-blue-500">AI</span></h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.5em] text-sm">Strategic Resolution Engine v3.2</p>
              </div>
           </div>

           <div className="glass-dark border border-white/10 rounded-[48px] p-12 space-y-10 shadow-2xl backdrop-blur-3xl">
              <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">System Authorization</h2>
                <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
                  To access High-Quality Video Generation (Veo) and Live Interrogation, please select a **paid project API key**.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <button 
                  onClick={handleInitializeCore}
                  className="group relative w-full py-10 rounded-[32px] bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.5em] text-sm transition-premium flex items-center justify-center gap-4 shadow-[0_20px_60px_rgba(59,130,246,0.4)] active:scale-95 border border-white/10"
                >
                  Authorize Strategic Core
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <ExternalLink className="w-4 h-4" />
                  How to Enable Billing for Video
                </a>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden print:overflow-visible print:bg-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/15 blur-[180px] ambient-light rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[220px] ambient-light rounded-full" style={{ animationDelay: '-15s' }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-8 flex justify-center no-print">
        <div className="glass-dark border border-white/10 rounded-[40px] px-3 py-2 flex items-center gap-3 pointer-events-auto shadow-2xl backdrop-blur-[64px] premium-border">
          <div className="flex items-center gap-4 pl-6 pr-8 py-2 border-r border-white/10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-premium hover:rotate-12">
               <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">Decisiv.<span className="text-blue-500">AI</span></span>
          </div>
          
          <div className="flex items-center gap-1.5 p-1">
            {[
              { id: 'HUB', icon: LayoutGrid, label: 'Resolution' },
              { id: 'HISTORY', icon: Clock, label: 'Ledger' },
              { id: 'LIVE', icon: Radio, label: 'Live' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => setView(item.id as AppView)} 
                className={`flex items-center gap-3 px-8 py-3.5 rounded-[32px] text-[11px] font-black uppercase tracking-widest transition-premium ${
                  view === item.id 
                    ? 'text-white bg-white/10 shadow-lg border border-white/5' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${view === item.id ? 'text-blue-400' : ''}`} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-8 pr-4">
            <button 
              onClick={() => setIsLaymanMode(!isLaymanMode)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-[32px] border text-[11px] font-black uppercase tracking-widest transition-premium shadow-xl ${
                isLaymanMode 
                  ? 'bg-emerald-600 border-emerald-400 text-white' 
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-blue-500'
              }`}
            >
              {isLaymanMode ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              {isLaymanMode ? 'Layman' : 'Strategic'}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-10 pt-56 pb-48 relative z-10 print:pt-0 print:pb-0 print:mt-0 print:overflow-visible flex-1">
        {view === 'HUB' && (
          <div className="space-y-40 animate-in fade-in duration-1000 print:space-y-10 print:animate-none">
            {engineState === EngineState.ERROR && (
              <div className="max-w-4xl mx-auto p-12 glass border border-red-500/30 bg-red-950/20 rounded-[64px] shadow-2xl flex flex-col items-center text-center gap-10 animate-in slide-in-from-top-12 no-print relative overflow-hidden">
                <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />
                <div className="w-24 h-24 bg-red-600/20 rounded-[32px] flex items-center justify-center border border-red-500/40 relative z-10">
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">
                    {errorType === 'QUOTA' ? 'Neural Limit Reached' : errorType === 'AUTH' ? 'Authorization Error' : 'Logic Core Fault'}
                  </h3>
                  <p className="text-slate-400 font-medium italic max-w-lg leading-relaxed">
                    {errorType === 'QUOTA' 
                      ? "The AI provider's quota is exhausted. This usually resets within 60 seconds." 
                      : errorType === 'AUTH'
                      ? "The secure connection to the reasoning core failed. Ensure you selected a valid API key."
                      : "The Strategic Resolution Engine encountered an unexpected disruption during synthesis."}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full justify-center">
                  <button 
                    onClick={() => handleSubmit(formData)}
                    className="px-12 py-5 bg-red-600 rounded-[32px] border border-red-400 text-white font-black uppercase tracking-[0.3em] text-[12px] flex items-center justify-center gap-4 transition-premium hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(220,38,38,0.3)]"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Retry Protocol
                  </button>
                  <button 
                    onClick={() => setIsAuthorized(false)}
                    className="px-12 py-5 bg-slate-900 rounded-[32px] border border-white/10 text-slate-400 font-black uppercase tracking-[0.3em] text-[12px] flex items-center justify-center gap-4 transition-premium hover:scale-105 active:scale-95 hover:text-white"
                  >
                    <Key className="w-5 h-5" />
                    Switch Key
                  </button>
                </div>
              </div>
            )}

            {engineState !== EngineState.LOADING && (
                <div className="no-print">
                  <DecisionForm 
                    initialData={formData} 
                    onChange={setFormData} 
                    onSubmit={handleSubmit}
                    isProcessing={false}
                  />
                </div>
            )}
            
            {engineState === EngineState.LOADING && (
                <div className="h-[70vh] flex flex-col items-center justify-center relative overflow-hidden rounded-[80px] bg-slate-950/50 border border-white/5 glass shadow-[0_120px_240px_rgba(0,0,0,0.85)] no-print">
                    <div className="relative w-[500px] h-[500px] flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-blue-500/15 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-16 rounded-full border border-emerald-500/15 animate-[spin_25s_linear_infinite_reverse]" />
                        
                        <div className="relative z-10 w-64 h-64 rounded-[56px] glass border border-white/20 flex flex-col items-center justify-center shadow-2xl premium-border bg-slate-900/60">
                            <Brain className="w-20 h-20 text-blue-400 mb-6 animate-pulse drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]" />
                            <div className="flex flex-col items-center">
                                <span className="text-6xl font-black text-white tracking-tighter mono">
                                    {Math.round(progress)}%
                                </span>
                                <span className="text-[11px] font-black uppercase tracking-[0.8em] text-blue-500 mt-3">
                                    SYNTHESIZING
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center space-y-10 max-w-2xl">
                        <div className="flex flex-col items-center gap-8">
                            <div className="px-12 py-6 rounded-[36px] border border-white/10 bg-black/60 shadow-2xl">
                              <span className="text-[15px] font-mono font-bold text-blue-400 tracking-[0.2em] uppercase">
                                {thinkingLog}
                              </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {engineState !== EngineState.LOADING && !result && engineState !== EngineState.ERROR && (
              <div className="space-y-28 no-print animate-in fade-in slide-in-from-bottom-16 duration-1000">
                <div className="flex flex-col items-center gap-8">
                  <span className="text-[12px] font-black uppercase tracking-[1em] text-slate-600">Cognitive Templates</span>
                  <div className="w-40 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                </div>
                <SampleSelector 
                  isLaymanMode={isLaymanMode}
                  onSelect={(sample) => {
                    setFormData(sample);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              </div>
            )}

            {result && engineState !== EngineState.LOADING && (
              <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000 print:animate-none print:opacity-100 print:translate-y-0">
                <DecisionDisplay 
                  result={result} 
                  isLaymanMode={isLaymanMode}
                  onExplainFurther={(query) => {
                    setForceQuery(query);
                    setView('LIVE');
                  }}
                />
              </div>
            )}
          </div>
        )}

        {view === 'HISTORY' && (
          <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000 no-print">
            <HistoryHub 
              entries={history} 
              onLoad={handleLoadEntry}
              onClear={() => {
                setHistory([]);
                localStorage.removeItem('decisiv_history');
              }}
            />
          </div>
        )}

        {view === 'LIVE' && (
          <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000 no-print">
            <LiveCore 
              isLaymanMode={isLaymanMode} 
              activeProtocol={activeProtocol}
              forceQuery={forceQuery}
              onQueryConsumed={() => setForceQuery(null)}
            />
          </div>
        )}
      </main>

      <footer className="relative z-10 py-16 mt-20 border-t border-white/5 no-print glass-dark backdrop-blur-3xl">
        <div className="container mx-auto px-10 flex flex-col items-center gap-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-slate-800" />
              <ShieldCheck className="w-5 h-5 text-blue-600/40" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-slate-800" />
           </div>
           
           <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 flex items-center gap-3">
                 © 2025 Decisiv.AI 
                 <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
                 Strategic Resolution Hub
              </p>
              <div className="flex items-center gap-3 text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">
                 Developed by 
                 <button 
                  onClick={() => setIsDevProfileOpen(true)}
                  className="text-slate-200 hover:text-blue-500 transition-premium cursor-pointer border-b border-white/10 hover:border-blue-500/40 pb-0.5"
                 >
                   Ritish
                 </button>
              </div>
           </div>

           <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
           </div>
        </div>
      </footer>

      {/* Developer Spotlight Card */}
      {isDevProfileOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-500 no-print">
           <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setIsDevProfileOpen(false)}
           />
           <div className="relative glass-dark border border-white/20 rounded-[48px] p-12 w-full max-w-xl shadow-[0_50px_150px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-500 overflow-hidden premium-border">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <button 
                onClick={() => setIsDevProfileOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-premium"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-10 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                  <div className="relative w-32 h-32 rounded-[40px] bg-blue-600 flex items-center justify-center border border-white/10 shadow-2xl">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">Ritish Nedunoori</h3>
                   <div className="flex flex-col items-center gap-2">
                     <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500">Full Stack Developer</span>
                     <p className="text-slate-400 font-medium italic max-w-sm leading-relaxed">
                        Design and orchestration of high-precision logical co-pilots and neural synthesis systems.
                     </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full">
                  {[
                    { label: 'Neural Protocols', value: 'Gemini 3 Pro // Flash' },
                    { label: 'Logic Kernel', value: 'TypeScript // React 19' },
                    { label: 'UI Signature', value: 'Custom Glassmorphism' }
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                      <span className="text-[11px] font-black text-slate-200 uppercase tracking-tight">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-white/5 w-full justify-center">
                  {[
                    { icon: Github, href: 'https://github.com/ritz-devbox' },
                    { icon: Linkedin, href: 'https://linkedin.com/in/ritish-nedunoori' },
                    { icon: Twitter, href: 'https://twitter.com/nedunooriritish' } // Updated to Twitter (X)
                  ].map((social, i) => (
                    <a 
                      key={i}
                      href={social.href} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-600/10 transition-premium"
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
