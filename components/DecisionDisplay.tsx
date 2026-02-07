
import React, { useState, useRef, useMemo } from 'react';
import { 
  DecisionResponse, 
  ProtocolExecutionPlan,
} from '../types';
import { 
  ListOrdered, 
  Rocket, 
  BrainCircuit, 
  Wand2, 
  Search, 
  Loader2, 
  Volume2, 
  PlayCircle, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Video as VideoIcon, 
  Download, 
  ExternalLink,
  ShieldAlert,
  MessageSquare,
  FileText
} from 'lucide-react';
import { 
  decode,
  decodeAudioData
} from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";
import WarGaming from './WarGaming';
import ProtocolExecution from './ProtocolExecution';
import CollaborativeAudit from './CollaborativeAudit';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';

interface DecisionDisplayProps { 
  result: DecisionResponse; 
  isLaymanMode: boolean;
  onExplainFurther?: (query: { text: string; timestamp: number }) => void;
}

const DecisionDisplay: React.FC<DecisionDisplayProps> = ({ 
  result, 
  isLaymanMode, 
  onExplainFurther 
}) => {
  const [activeTab, setActiveTab] = useState<'Logic' | 'Simulation' | 'Execution' | 'Audit'>('Logic');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decisiv-protocol-${result.protocolHash || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateVideo = async () => {
    if (isVideoGenerating) return;
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }
    setIsVideoGenerating(true);
    setVideoUrl(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A high-tech cinematic visualization of a major resolution: ${result.decision}. 3D holographic UI, sleek environment.`;
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (e) {
      console.error("Video generation failed:", e);
    } finally {
      setIsVideoGenerating(false);
    }
  };

  const handleVocalize = async () => {
    if (isPlayingAudio) {
      audioSourceRef.current?.stop();
      setIsPlayingAudio(false);
      return;
    }
    if (!result.audioData) return;
    setIsPlayingAudio(true);
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;
      await ctx.resume();
      const audioBytes = decode(result.audioData);
      const buffer = await decodeAudioData(audioBytes, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlayingAudio(false);
      audioSourceRef.current = source;
      source.start();
    } catch (e) {
      console.error("TTS Playback Error:", e);
      setIsPlayingAudio(false);
    }
  };

  const tabs = [
    { id: 'Logic', icon: ListOrdered, label: isLaymanMode ? 'Why it works' : 'Inference Chain' },
    { id: 'Simulation', icon: BrainCircuit, label: isLaymanMode ? 'What if?' : 'War-Gaming' },
    { id: 'Audit', icon: Users, label: isLaymanMode ? 'Experts' : 'Logic Audit' },
    { id: 'Execution', icon: Rocket, label: isLaymanMode ? 'Tactical' : 'Tactical' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className={`glass rounded-[72px] border transition-all duration-1000 overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] ${isLaymanMode ? 'border-emerald-500/40' : 'border-white/15'}`}>
        <div className="flex flex-col relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-[700px] h-[700px] blur-[180px] opacity-15 rounded-full -translate-y-1/2 translate-x-1/2 ${isLaymanMode ? 'bg-emerald-500' : 'bg-blue-600'}`} />
          
          <div className="p-16 md:p-24 lg:p-32 space-y-16 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
              <div className={`px-8 py-4 rounded-[28px] border text-[12px] font-black uppercase tracking-[0.5em] flex items-center gap-5 self-start ${isLaymanMode ? 'bg-emerald-600/15 border-emerald-500/40 text-emerald-400' : 'bg-blue-600/15 border-blue-400/40 text-blue-400'}`}>
                {isLaymanMode ? <Wand2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                {isLaymanMode ? 'Layman Mode Briefing' : 'Deterministic Protocol Active'}
              </div>
              
              <div className="flex flex-wrap items-center gap-5 no-print">
                <button 
                  onClick={handleDownloadJSON}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white hover:border-blue-500 hover:bg-white/10 transition-premium shadow-xl"
                  title="Download Protocol Data"
                >
                  <Download className="w-5 h-5" />
                </button>
                {result.audioData && (
                  <button 
                    onClick={handleVocalize}
                    className={`flex items-center gap-4 px-8 py-3.5 rounded-[24px] border text-[11px] font-black uppercase tracking-[0.5em] transition-premium shadow-2xl active:scale-95 ${isPlayingAudio ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 border-white/15 text-slate-500 hover:text-white hover:border-blue-500'}`}
                  >
                    {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <PlayCircle className="w-4 h-4" />}
                    {isPlayingAudio ? 'Stop' : 'Vocalize'}
                  </button>
                )}
                <button 
                  onClick={handleGenerateVideo}
                  disabled={isVideoGenerating}
                  className="flex items-center gap-4 px-8 py-3.5 rounded-[24px] border border-white/15 bg-white/5 text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 hover:text-white hover:border-blue-500 transition-premium shadow-2xl disabled:opacity-50"
                >
                  {isVideoGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <VideoIcon className="w-4 h-4" />}
                  {isVideoGenerating ? 'Rendering...' : 'Video Teaser'}
                </button>
              </div>
            </div>

            {videoUrl && (
              <div className="w-full aspect-video rounded-[48px] overflow-hidden border border-white/10 shadow-2xl bg-black mb-12 animate-in zoom-in-95 duration-700">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-20 items-start">
              <div className="flex-1 space-y-10 min-h-[150px] w-full">
                <div className="space-y-8 w-full">
                  <span className="text-[14px] font-black uppercase tracking-[1.2em] text-slate-700 block">
                    {isLaymanMode ? 'Simplified Result //' : 'Strategic Resolution //'}
                  </span>
                  <div className="w-full">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] uppercase tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] break-words whitespace-normal hyphens-auto inline-block max-w-full">
                        {isLaymanMode ? (result.simpleDecision || result.decision) : result.decision}
                    </h2>
                    <div className="h-2 w-48 bg-blue-600 mt-8 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-14 pt-6">
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-600">Urgency Vector</span>
                    <div className={`px-8 py-3 rounded-[24px] border text-[14px] font-black uppercase tracking-widest shadow-2xl ${
                      result.urgencyLevel === 'Critical' ? 'bg-red-500/15 border-red-500/50 text-red-500 animate-pulse' :
                      result.urgencyLevel === 'High' ? 'bg-orange-500/15 border-orange-500/50 text-orange-500' :
                      'bg-blue-500/15 border-blue-500/50 text-blue-400'
                    }`}>{result.urgencyLevel}</div>
                  </div>
                  <div className="w-px h-20 bg-white/10 hidden sm:block" />
                  <div className="space-y-4">
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-600">Logic Depth</span>
                    <div className="flex items-center gap-5 text-white font-black text-2xl uppercase tracking-tighter">
                      <div className="p-3 bg-blue-500/15 rounded-xl"><Cpu className="w-6 h-6 text-blue-500" /></div>
                      {result.thinkingLevel}
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center self-center lg:self-start pt-10 lg:pt-0">
                <div className="relative w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center group cursor-pointer scale-90 lg:scale-100">
                  <div className={`absolute inset-0 rounded-full border-[6px] border-dashed transition-all duration-1000 ${isLaymanMode ? 'border-emerald-500/25 animate-[spin_15s_linear_infinite]' : 'border-blue-500/25 animate-[spin_25s_linear_infinite]'}`} />
                  <div className="absolute inset-6 rounded-full border border-white/5 scale-95" />
                  <div className="text-center transition-all duration-700 group-hover:scale-110">
                    <div className="flex flex-col items-center">
                      <p className="text-[100px] lg:text-[140px] font-black text-white tracking-tighter leading-none drop-shadow-2xl">{result.confidenceScore}</p>
                      <p className={`text-[12px] lg:text-[14px] font-black uppercase tracking-[1em] ${isLaymanMode ? 'text-emerald-500' : 'text-blue-500'}`}>Confidence %</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {result.groundingSources && result.groundingSources.length > 0 && (
        <div className="glass-dark border border-white/10 p-12 rounded-[56px] space-y-8 animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-5">
             <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20"><Search className="w-5 h-5 text-blue-400" /></div>
             <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Live Grounding Evidence</h4>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Cross-Referenced Real-Time Sources</p>
             </div>
          </div>
          <div className="flex flex-wrap gap-4">
             {result.groundingSources.map((source, idx) => (
               <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                className="flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-[20px] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-blue-500 transition-all group"
               >
                 {source.title}
                 <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </a>
             ))}
          </div>
        </div>
      )}
      
      <div className="space-y-16">
        <div className="flex flex-wrap items-center justify-center gap-10 border-b border-white/10 pb-12 print:hidden no-print">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-6 px-14 py-8 rounded-[3rem] transition-premium border group relative overflow-hidden active:scale-95 shadow-2xl ${activeTab === tab.id ? 'bg-blue-600/20 border-blue-500/60 text-white' : 'bg-white/5 border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/10'}`}
             >
               <tab.icon className={`w-6 h-6 transition-premium group-hover:scale-110 ${activeTab === tab.id ? 'text-blue-400' : ''}`} />
               <span className="text-[14px] font-black uppercase tracking-[0.3em]">{tab.label}</span>
               {activeTab === tab.id && <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />}
             </button>
           ))}
        </div>
        <div className="min-h-[700px] relative">
          {activeTab === 'Logic' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
               <div className="lg:col-span-8 space-y-16">
                  {result.reasons.map((reason, idx) => (
                    <div key={idx} className={`p-12 md:p-16 rounded-[64px] border shadow-[0_50px_100px_rgba(0,0,0,0.6)] transition-premium group relative overflow-hidden ${isLaymanMode ? 'bg-gradient-to-br from-emerald-500/[0.05] to-slate-950 border-emerald-500/40' : 'bg-gradient-to-br from-blue-600/[0.08] to-slate-950 border-white/15'}`}>
                       <div className="flex flex-col md:flex-row gap-16 relative z-10">
                          <div className={`w-28 h-28 rounded-[40px] bg-slate-950 border flex items-center justify-center text-5xl font-black shrink-0 ${isLaymanMode ? 'text-emerald-500 border-emerald-500/40' : 'text-blue-500 border-white/10'}`}>{idx + 1}</div>
                          <div className="space-y-10 flex-1">
                             <div className="flex items-center justify-between">
                                <h4 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">{reason.main}</h4>
                                <button 
                                  onClick={() => onExplainFurther?.({ text: `Explain this logic point further: ${reason.main}`, timestamp: Date.now() })}
                                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-600 hover:text-white transition-all no-print"
                                  title="Ask for Live Explanation"
                                >
                                  <MessageSquare className="w-5 h-5" />
                                </button>
                             </div>
                             <p className={`text-xl lg:text-2xl leading-relaxed font-bold italic ${isLaymanMode ? 'text-slate-300' : 'text-slate-100'}`}>"{isLaymanMode ? (reason.simple || reason.nuance) : reason.nuance}"</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="lg:col-span-4 space-y-16">
                  <div className="glass p-12 rounded-[56px] border border-white/15 bg-white/[0.01] space-y-12 shadow-2xl premium-border">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-blue-600/15 rounded-2xl border border-blue-500/20"><FileText className="w-6 h-6 text-blue-400" /></div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Impact Matrix</h3>
                    </div>
                    <div className="relative h-48 flex items-end justify-around gap-10 px-6 border-b border-white/5 pb-6">
                      <div className="w-20 bg-slate-800 rounded-t-2xl relative" style={{ height: `${result.marketSentiment.preScore}%` }}>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xl font-black text-slate-500">{result.marketSentiment.preScore}</div>
                      </div>
                      <div className={`w-20 rounded-t-2xl relative shadow-2xl ${result.marketSentiment.postScore >= result.marketSentiment.preScore ? 'bg-blue-600 shadow-blue-500/20' : 'bg-red-600 shadow-red-500/20'}`} style={{ height: `${result.marketSentiment.postScore}%` }}>
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-xl font-black ${result.marketSentiment.postScore >= result.marketSentiment.preScore ? 'text-blue-400' : 'text-red-400'}`}>{result.marketSentiment.postScore}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 italic leading-relaxed">"{isLaymanMode ? result.marketSentiment.simpleAnalysis : result.marketSentiment.analysis}"</p>
                  </div>

                  <div className="p-12 glass rounded-[56px] border border-red-500/20 bg-red-500/[0.02] space-y-10">
                     <div className="flex items-center gap-5">
                        <div className="p-4 bg-red-600/10 rounded-2xl"><ShieldAlert className="w-6 h-6 text-red-500" /></div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Primary Risk</h4>
                     </div>
                     <p className="text-slate-100 font-bold text-lg leading-relaxed">"{isLaymanMode ? result.simpleCriticalRisk : result.criticalRisk}"</p>
                     <p className="text-slate-400 text-sm leading-relaxed italic">"{isLaymanMode ? result.simpleRiskElaboration : result.riskElaboration}"</p>
                  </div>
               </div>
            </div>
          )}
          {activeTab === 'Simulation' && result.warGame && <WarGaming result={result.warGame} isLaymanMode={isLaymanMode} />}
          {activeTab === 'Audit' && result.audit && <CollaborativeAudit audit={result.audit} isLaymanMode={isLaymanMode} />}
          {activeTab === 'Execution' && result.executionPlan && <ProtocolExecution plan={result.executionPlan} isLaymanMode={isLaymanMode} />}
        </div>
      </div>
    </div>
  );
};

export default DecisionDisplay;
