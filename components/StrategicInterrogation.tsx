
import React, { useState, useRef, useEffect } from 'react';
import { DecisionResponse, ChatMessage } from '../types';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Zap, Mic, MicOff, Video, VideoOff, Volume2, Scan, Loader2, User, Bot, ShieldQuestion, FileSearch, ShieldCheck, Activity } from 'lucide-react';
import { decode, encode, decodeAudioData, createPcmBlob } from '../services/geminiService';

interface StrategicInterrogationProps {
  decision: DecisionResponse;
  context: string;
  forceQuery?: { text: string; timestamp: number } | null;
  onQueryConsumed?: () => void;
  laymanMode?: boolean;
}

const StrategicInterrogation: React.FC<StrategicInterrogationProps> = ({ decision, context, forceQuery, onQueryConsumed, laymanMode }) => {
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyserRef = useRef<AnalyserNode | null>(null);

  const captureFrame = async (quality: number = 0.8) => {
    if (!canvasRef.current || !videoRef.current) return null;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return null;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    return canvasRef.current.toDataURL('image/jpeg', quality).split(',')[1];
  };

  const startLiveSession = async (initialQuery?: string) => {
    if (isLive || isConnecting) return;
    setIsConnecting(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Explicitly initialize AudioContexts on user gesture
      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      await inputAudioCtxRef.current.resume();
      await outputAudioCtxRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideoActive ? { width: 1280, height: 720 } : false 
      });
      
      if (videoRef.current && isVideoActive) videoRef.current.srcObject = stream;

      const systemInstruction = laymanMode 
        ? `You are a friendly, common-sense advisor for Decisiv.AI. 
           The user is looking at a decision: ${decision.simpleDecision}. 
           Speak very simply. Use common analogies. Always respond in the modality the user used.`
        : `You are the Live Intelligence Core of Decisiv.AI. 
           The user is auditing a major decision: ${decision.decision}. 
           Be authoritative, highly logical, and help them identify 'Black Swan' risks and logic vulnerabilities in real-time.`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setIsConnecting(false);
            setIsMicActive(true);
            
            const source = inputAudioCtxRef.current!.createMediaStreamSource(stream);
            const analyser = inputAudioCtxRef.current!.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            source.connect(analyser);

            const updateVolume = () => {
              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              setVolumeLevel(sum / dataArray.length / 128.0);
              animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();

            const processor = inputAudioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputAudioCtxRef.current!.destination);
            
            // Frame streaming for visual interrogation
            const interval = setInterval(async () => {
              if (!isVideoActive) return;
              const data = await captureFrame(0.4);
              if (data) sessionPromise.then(s => s.sendRealtimeInput({ media: { data, mimeType: 'image/jpeg' } }));
            }, 1000);
            (window as any)._videoInterval = interval;

            if (initialQuery) {
              sessionPromise.then(s => s.sendRealtimeInput({ text: initialQuery }));
              setMessages(prev => [...prev, { role: 'user', text: initialQuery }]);
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const bytes = decode(audioData);
              const buffer = await decodeAudioData(bytes, outputAudioCtxRef.current!);
              const source = outputAudioCtxRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(outputAudioCtxRef.current!.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioCtxRef.current!.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              for (const source of sourcesRef.current) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => prev + msg.serverContent!.outputTranscription!.text);
            }

            if (msg.serverContent?.turnComplete) {
              setMessages(prev => [...prev, { role: 'model', text: transcription }]);
              setTranscription('');
            }
          },
          onclose: () => stopLiveSession(),
          onerror: (e) => {
            console.error("Live session error:", e);
            stopLiveSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          outputAudioTranscription: {},
        }
      });
      sessionRef.current = sessionPromise;
    } catch (e) { 
      console.error("Could not start live session:", e); 
      stopLiveSession();
    }
  };

  useEffect(() => {
    if (forceQuery && !isLive) {
      startLiveSession(forceQuery.text);
      onQueryConsumed?.();
    }
  }, [forceQuery, isLive]);

  const stopLiveSession = () => {
    setIsLive(false); 
    setIsConnecting(false);
    setIsMicActive(false); 
    setVolumeLevel(0);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (sessionRef.current) sessionRef.current.then((s: any) => s.close());
    if ((window as any)._videoInterval) clearInterval((window as any)._videoInterval);
    if (inputAudioCtxRef.current) inputAudioCtxRef.current.close();
    if (outputAudioCtxRef.current) outputAudioCtxRef.current.close();
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    setIsVideoActive(!isVideoActive);
    if (isLive) {
      stopLiveSession();
      setTimeout(() => startLiveSession(), 200);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, transcription]);

  const triggerDocumentAnalysis = async () => {
    if (!isLive || !sessionRef.current) return;
    setIsScanning(true);
    const frameData = await captureFrame(0.95);
    if (frameData) {
      sessionRef.current.then((s: any) => {
        s.sendRealtimeInput({ media: { data: frameData, mimeType: 'image/jpeg' } });
        s.sendRealtimeInput({ text: laymanMode 
          ? "I am showing you a document. What is in it and how does it change our simple plan?"
          : "Perform deep-dive visual logical analysis on this artifact. Does it invalidate our current risk assessments?" 
        });
      });
      setMessages(prev => [...prev, { role: 'user', text: "[SYSTEM: Visual Evidence Transmitted]" }]);
    }
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="glass rounded-[48px] border border-white/10 overflow-hidden flex flex-col h-[850px] mt-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative">
      <div className={`absolute top-0 left-0 w-full h-1.5 z-50 transition-all duration-1000 ${isLive ? 'bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-blue-600/40'}`} />
      
      <div className="p-8 bg-slate-950/40 border-b border-white/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-5">
          <div className={`p-3 rounded-2xl border transition-all duration-500 ${isLive ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-white/10'}`}>
            <Zap className={`w-5 h-5 ${isLive ? 'text-emerald-400' : 'text-slate-600'}`} />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
              {isLive ? 'Live Interface Sync' : 'Interrogation Console'}
            </h3>
            <div className="flex items-center gap-3 mt-1">
               <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
               <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                {laymanMode ? 'Simple Mode Active // Analogies Engaged' : 'Neural Core Active // Recursive Sync'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleVideo}
            className={`p-3 rounded-xl border transition-all ${isVideoActive ? 'bg-blue-600/20 border-blue-400 text-blue-400 shadow-xl' : 'bg-white/5 border-white/10 text-slate-600'}`}
          >
            {isVideoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>
          <button 
            onClick={isLive ? stopLiveSession : () => startLiveSession()}
            disabled={isConnecting}
            className={`px-6 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${isLive ? 'bg-red-600 border-red-400 text-white shadow-lg' : 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white'}`}
          >
            {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : isLive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isConnecting ? 'Connecting' : isLive ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-950/20">
        <div className={`${isVideoActive ? 'w-full lg:w-[400px]' : 'w-0 overflow-hidden'} border-r border-white/5 bg-black/40 p-6 flex flex-col gap-6 relative transition-all duration-700`}>
          <div className="aspect-video lg:aspect-square bg-slate-900 rounded-[32px] overflow-hidden border border-white/10 relative shadow-2xl">
               <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-all duration-1000 ${isLive ? 'grayscale-0 opacity-100' : 'grayscale opacity-30'}`} />
               <canvas ref={canvasRef} className="hidden" />
               {isScanning && (
                 <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,1)] animate-[scanline_1s_linear_infinite]" />
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                 </div>
               )}
            </div>

            {isLive && (
              <button 
                onClick={triggerDocumentAnalysis}
                disabled={isScanning || !isVideoActive}
                className="w-full py-5 rounded-[24px] border border-white/10 bg-white/5 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-4 group shadow-xl"
              >
                {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                {isScanning ? 'Syncing Visuals' : 'Identify Artifact'}
              </button>
            )}

            <div className="flex-1 glass-dark rounded-[32px] p-8 border border-white/5 space-y-6 shadow-inner">
               <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Pulse</span>
               </div>
               <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-blue-500 transition-all duration-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]" style={{ width: `${Math.max(10, volumeLevel * 100)}%` }} />
                  </div>
               </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar relative">
          {messages.length === 0 && !isLive && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-10 opacity-30">
              <ShieldQuestion className="w-16 h-16 text-slate-700" />
              <p className="text-[11px] text-slate-700 font-black uppercase tracking-[0.5em] max-w-sm">Use Live Link to Stress-Test the Logic Core.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' : 'bg-slate-950 border-white/10 text-emerald-400 shadow-xl'}`}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`max-w-[80%] p-8 rounded-[32px] text-[15px] leading-relaxed font-medium shadow-2xl ${msg.role === 'user' ? 'bg-blue-600/5 border border-blue-500/10 text-slate-300 italic' : 'bg-slate-900/40 border border-white/5 text-slate-300'}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {transcription && (
            <div className="flex gap-8 animate-in fade-in">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Volume2 className="w-6 h-6 text-emerald-400 animate-pulse" />
               </div>
               <div className="max-w-[80%] p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 text-emerald-100 text-[15px] italic">
                  {transcription}
               </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default StrategicInterrogation;
