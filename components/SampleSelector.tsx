
import React from 'react';
import { DecisionInput } from '../types';
import { 
  Activity, 
  Briefcase, 
  Scale, 
  User, 
  Target, 
  Home, 
  LineChart, 
  Globe, 
  Stethoscope, 
  Cpu, 
  Leaf, 
  ShieldAlert,
  Dna,
  ArrowRight
} from 'lucide-react';

// Props for the SampleSelector component to handle scenario selection
interface SampleSelectorProps {
  onSelect: (sample: DecisionInput) => void;
  isLaymanMode: boolean;
}

export const SAMPLES: (DecisionInput & { 
  icon: React.ReactNode, 
  description: string,
  simpleDescription: string,
  simpleTitle: string 
})[] = [
  {
    icon: <Home className="w-5 h-5" />,
    title: "Toronto Housing Acquisition",
    simpleTitle: "Buying a House in Toronto",
    description: "Deciding between a downtown condo vs. a suburban detached house in the current high-interest rate environment.",
    simpleDescription: "Should I buy a smaller condo in the city or a bigger house in the suburbs while prices and rates are high?",
    domain: 'Real Estate',
    context: "Budget is $1.2M. Comparing a 2-bedroom downtown Toronto condo (high maintenance fees, zero commute) vs. a 4-bedroom house in Pickering (1-hour commute, higher utility costs, better appreciation history). Current fixed mortgage rates are 5.1%.",
    constraints: "Max monthly carrying cost $5,500. Need move-in within 60 days.",
    risks: "Condo fee inflation, suburban market cooling, interest rate hike at renewal."
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Quantum AI Infrastructure Shift",
    simpleTitle: "Upgrading Business Computers",
    description: "Evaluating the transition from classical cloud-based GPU clusters to experimental quantum-ready neural hardware.",
    simpleDescription: "Should our company keep using regular cloud servers or start spending money on super-fast experimental AI hardware?",
    domain: 'Engineering',
    context: "Current annual compute cost is $4M. Transitioning to 'Neural-Q' hardware requires a $12M upfront CapEx but promises a 100x efficiency gain in training local LLMs. Support contracts for classical GPUs expire in 18 months.",
    constraints: "Must maintain 99.99% uptime during migration. Budget capped at $15M for 2025.",
    risks: "Hardware obsolescence, talent shortage for quantum programming, thermal management failures."
  },
  {
    icon: <Dna className="w-5 h-5" />,
    title: "Experimental Gene Therapy R&D",
    simpleTitle: "New Medicine Testing",
    description: "Resource allocation between a proven legacy pharmaceutical line and a high-risk, high-reward CRISPR gene editing trial.",
    simpleDescription: "Should we keep making the medicine that works okay, or spend our money trying to find a brand new cure that might fail?",
    domain: 'Clinical',
    context: "Legacy drug generates $500M annually but patent expires in 3 years. CRISPR trial targets a rare disease with zero current competition but has only a 12% historical success rate in Phase II. Requires $200M in immediate R&D funding.",
    constraints: "FDA Fast-track window closes in 6 months. Investor board demands a 5-year ROI plan.",
    risks: "Adverse clinical events, regulatory rejection, competitor patent leapfrogging."
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    title: "Net-Zero Supply Chain Pivot",
    simpleTitle: "Going Eco-Friendly",
    description: "Auditing a global manufacturing pivot to 100% sustainable materials vs. current low-cost high-emission providers.",
    simpleDescription: "Should we spend more money to use green materials or keep using cheap ones that are bad for the environment?",
    domain: 'Business',
    context: "Current CO2 tax projected to rise 300% by 2030. Eco-pivot increases per-unit production cost by 22% but allows access to 'Green ESG' credit markets worth $40M annually.",
    constraints: "Public stock listing requires ESG score of 'A' by Q4. Existing vendor contracts are non-cancelable for 12 months.",
    risks: "Consumer price sensitivity, supply chain fragility in emerging green markets, greenwashing litigation."
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Class-Action Settlement Pivot",
    simpleTitle: "Settling a Big Lawsuit",
    description: "Litigation risk vs. guaranteed settlement. Evaluating long-term liability against immediate liquidity.",
    simpleDescription: "Should we take a guaranteed $40M deal now or go to court and risk losing everything or winning big?",
    domain: 'Legal',
    context: "Company faces a class action for data privacy. Evidence is mixed. Plaintiff offers a $40M settlement now. Going to trial could result in $0 liability or $200M in punitive damages.",
    constraints: "Next 48 hours for settlement offer. Board pressure for certainty.",
    risks: "Precedent setting for future cases, total bankruptcy, PR disaster."
  },
  {
    icon: <User className="w-5 h-5" />,
    title: "Global Relocation Strategy",
    simpleTitle: "Moving Overseas for a Job",
    description: "Career trajectory vs. family stability. High-stakes life planning with irreversible consequences.",
    simpleDescription: "Is a huge promotion in Singapore worth moving my whole family and making my spouse quit their job?",
    domain: 'Personal',
    context: "Offered a role in Singapore with 4x salary and clear path to CEO. Spouse has a thriving local medical practice. Kids are in middle school. Declining means staying in middle management forever.",
    constraints: "Contract must be signed in 7 days. Move within 3 months.",
    risks: "Spousal resentment, child development disruption, career stagnation."
  }
];

const SampleSelector: React.FC<SampleSelectorProps> = ({ onSelect, isLaymanMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
      {SAMPLES.map((sample, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(sample)}
          className={`text-left bg-slate-950/40 border p-12 rounded-[56px] transition-premium group flex flex-col h-full shadow-lg hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-3 relative overflow-hidden ${
            isLaymanMode 
              ? 'border-emerald-500/10 hover:border-emerald-500/40 hover:bg-emerald-600/[0.05]' 
              : 'border-white/5 hover:border-blue-500/40 hover:bg-blue-600/[0.05]'
          }`}
        >
          <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] transition-colors duration-1000 ${isLaymanMode ? 'bg-emerald-600/5 group-hover:bg-emerald-600/15' : 'bg-blue-600/5 group-hover:bg-blue-600/15'}`} />
          
          <div className={`flex items-center gap-5 mb-10 transition-transform duration-700 group-hover:scale-105 ${isLaymanMode ? 'text-emerald-400' : 'text-blue-400'}`}>
            <div className={`p-4 rounded-2xl border shadow-inner transition-all duration-500 ${isLaymanMode ? 'bg-emerald-600/10 border-emerald-500/20 group-hover:bg-emerald-600/20' : 'bg-blue-600/10 border-blue-500/20 group-hover:bg-blue-600/20'}`}>
                {sample.icon}
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Protocol-0{idx + 1}</span>
          </div>
          
          <h4 className={`text-white font-black mb-5 text-2xl lg:text-3xl transition-colors uppercase tracking-tighter leading-none ${isLaymanMode ? 'group-hover:text-emerald-300' : 'group-hover:text-blue-300'}`}>
            {isLaymanMode ? sample.simpleTitle : sample.title}
          </h4>
          <p className="text-slate-500 text-base leading-relaxed font-medium mb-12 group-hover:text-slate-300 transition-colors italic line-clamp-3">
            "{isLaymanMode ? sample.simpleDescription : sample.description}"
          </p>
          
          <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
             <span className={`text-[10px] px-5 py-2 bg-slate-950 border border-white/10 rounded-xl text-slate-500 transition-all uppercase font-black tracking-widest group-hover:shadow-xl ${
               isLaymanMode ? 'group-hover:text-emerald-400 group-hover:border-emerald-500/40' : 'group-hover:text-blue-400 group-hover:border-blue-500/40'
             }`}>
               {sample.domain}
             </span>
             <div className={`p-2 rounded-lg transition-all duration-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 ${isLaymanMode ? 'text-emerald-500' : 'text-blue-500'}`}>
                <ArrowRight className="w-6 h-6" />
             </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SampleSelector;
