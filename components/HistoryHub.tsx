
import React, { useState, useEffect } from 'react';
import { SavedEntry } from '../types';
import { 
  Search, 
  Trash2, 
  Database,
  ArrowUpRight,
  Filter,
  Inbox
} from 'lucide-react';

interface HistoryHubProps {
  entries: SavedEntry[];
  onLoad: (entry: SavedEntry) => void;
  onClear: () => void;
}

const HistoryHub: React.FC<HistoryHubProps> = ({ entries, onLoad, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDomain, setFilterDomain] = useState<string | 'ALL'>('ALL');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.input.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filterDomain === 'ALL' || entry.input.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const domains = ['ALL', ...Array.from(new Set(entries.map(e => e.input.domain))).filter(Boolean)];

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <Database className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-500">Inference Archive</span>
           </div>
           <h2 className="text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter text-gradient-premium">Strategic <span className="text-blue-500">Ledger.</span></h2>
           <p className="text-slate-500 text-lg lg:text-xl font-medium italic">Immutable audit trail of deterministic resolutions.</p>
        </div>
        <button 
          onClick={onClear} 
          disabled={entries.length === 0}
          className="group flex items-center gap-4 px-10 py-5 bg-red-600/5 border border-red-500/20 rounded-[40px] text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-600 hover:text-white transition-premium active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xl"
        >
          <Trash2 className="w-4 h-4" /> 
          Wipe Ledger
        </button>
      </div>

      <div className={`glass rounded-[48px] p-3 border transition-premium relative z-20 shadow-2xl ${isSearchFocused ? 'border-blue-500/40 bg-blue-600/[0.04]' : 'border-white/5'}`}>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 flex items-center px-10 py-5 gap-8">
            <Search className={`w-6 h-6 transition-premium ${isSearchFocused ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'text-slate-700'}`} />
            <input 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH AUDIT TRAIL..."
              className="bg-transparent border-none focus:outline-none text-xl lg:text-2xl font-black text-white w-full placeholder:text-slate-800 uppercase tracking-tighter selection:bg-blue-500/40"
            />
          </div>
          
          <div className="lg:w-auto bg-black/40 rounded-[40px] p-2.5 flex flex-wrap items-center gap-2.5 border border-white/5 shadow-inner">
            <div className="px-5 py-2 flex items-center gap-3 text-slate-600">
              <Filter className="w-4 h-4" />
            </div>
            {domains.map(domain => (
              <button 
                key={domain} 
                onClick={() => setFilterDomain(domain!)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-premium shadow-lg ${
                  filterDomain === domain 
                  ? 'bg-blue-600 text-white shadow-blue-500/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/10'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id} 
            onClick={() => onLoad(entry)}
            className="glass rounded-[64px] p-12 lg:p-14 border border-white/5 hover:border-blue-500/40 hover:bg-blue-600/[0.03] transition-premium group relative overflow-hidden cursor-pointer active:scale-[0.98] premium-border shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
             
             <div className="flex items-start justify-between mb-12 relative z-10">
                <div className="space-y-5">
                   <div className="flex items-center gap-5">
                      <span className="text-[11px] font-black uppercase tracking-widest text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.3)]">{entry.input.domain}</span>
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{new Date(entry.timestamp).toLocaleDateString()}</span>
                   </div>
                   <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-premium duration-500 leading-none">
                    {entry.input.title}
                   </h3>
                </div>
                <div className="w-16 h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center transition-premium group-hover:border-blue-500/40 shadow-2xl group-hover:bg-blue-600/10">
                  <ArrowUpRight className="w-7 h-7 text-slate-700 group-hover:text-blue-400 group-hover:rotate-45 transition-premium" />
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
                <div className="p-8 bg-black/40 rounded-[40px] border border-white/5 group-hover:border-white/10 transition-premium shadow-inner">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-4">Resolution Summary</span>
                   <p className="text-sm text-slate-400 font-bold line-clamp-3 italic leading-relaxed group-hover:text-slate-300 transition-colors">"{entry.response.decision}"</p>
                </div>
                <div className="p-8 bg-black/40 rounded-[40px] border border-white/5 group-hover:border-white/10 transition-premium shadow-inner">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-4">Confidence Rating</span>
                   <div className="flex items-center gap-4">
                      <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{entry.response.confidenceScore}%</span>
                      <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${entry.response.confidenceScore}%` }} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="col-span-full h-[500px] flex flex-col items-center justify-center text-center space-y-12 glass rounded-[80px] border border-dashed border-white/10 shadow-2xl">
             <div className="relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
               <div className="relative p-12 bg-slate-950 rounded-full border border-white/5 border-dashed shadow-2xl">
                 <Database className="w-20 h-20 text-slate-800" />
               </div>
             </div>
             <div className="space-y-6">
                <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-widest">Inference Buffer Null</h3>
                <p className="text-lg text-slate-600 font-bold uppercase tracking-[0.3em] italic max-w-lg leading-relaxed">No historical protocols found matching your current filter criteria.</p>
             </div>
             <button 
              onClick={() => { setSearchQuery(''); setFilterDomain('ALL'); }}
              className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-premium shadow-xl"
             >
               Clear Ledger Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryHub;
