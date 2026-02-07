
export type AppView = 'HUB' | 'HISTORY' | 'LIVE';

export interface DecisionReason {
  main: string;
  nuance: string;
  simple: string;
}

export interface FailureStep {
  title: string;
  impact: string;
}

export type DecisionDomain = 'Business' | 'Clinical' | 'Engineering' | 'Legal' | 'Personal' | 'Finance' | 'Real Estate';
export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
export type ThinkingLevel = 'Surface' | 'Deep' | 'Recursive' | 'Multi-Spectral';

export interface ExpertPersona {
  id: string;
  name: string;
  title: string;
  avatar: string;
  logicStyle: string;
}

export interface CouncilDebate {
  experts: {
    persona: ExpertPersona;
    argument: string;
    verdict: 'Approve' | 'Oppose' | 'Abstain';
    confidence: number;
  }[];
  consensusSummary: string;
}

export interface RiskPoint {
  label: string;
  probability: number; // 0-100
  severity: number;    // 0-100
}

export interface ShadowLogicResult {
  vulnerabilityMap: { component: string; flaw: string; impact: number }[];
  blackSwanEvent: { title: string; trigger: string; severity: string };
  antagonistVerdict: string;
  riskHeatmap?: RiskPoint[];
}

export interface FutureHeadline {
  timeframe: string;
  headline: string;
  source: string;
  summary: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface FutureForecast {
  headlines: FutureHeadline[];
  legacyImpact: string;
}

export interface AuditNode {
  agentRole: string;
  perspective: string;
  sentiment: 'Supportive' | 'Critical' | 'Neutral';
  score: number;
}

export interface CollaborativeAudit {
  nodes: AuditNode[];
  consensusScore: number;
  terminalSummary: string;
  simpleSummary: string;
}

export interface InfluenceVector {
  category: string;
  weight: number; 
  description: string;
}

export interface EngineSettings {
  voiceName: VoiceName;
  speechRate?: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  label: string;
  description: string;
  type: 'Input' | 'Grounding' | 'Simulation' | 'Resolution';
}

export interface SuggestionSet {
  context: string;
  constraints: string;
  risks: string;
  label: string;
}

export interface ExecutionAction {
  id: string;
  title: string;
  description: string;
  phase: 'Immediate' | 'Secondary' | 'Long-term';
  department: string;
  simpleDescription: string;
  integrationStatus?: 'Idle' | 'Synced' | 'Failed';
}

export interface StakeholderBrief {
  id: string;
  audience: string;
  subject: string;
  content: string;
  tone: string;
}

export interface ProtocolExecutionPlan {
  actions: ExecutionAction[];
  briefs: StakeholderBrief[];
}

export interface SimulationPath {
  id: string;
  strategyName: string;
  successProbability: number;
  attritionRate: number;
  timeToValue: string;
  terminalOutcome: string;
  simpleOutcome: string;
  risks: string[];
}

export interface WarGameResult {
  paths: SimulationPath[];
  recommendedPathId: string;
  comparativeAnalysis: string;
  simpleComparison: string;
}

export interface DecisionResponse {
  decision: string;
  simpleDecision: string; 
  confidenceScore: number;
  urgencyLevel: 'Critical' | 'High' | 'Moderate' | 'Strategic';
  thinkingLevel: ThinkingLevel;
  responseWindow: string;
  reasons: DecisionReason[];
  criticalRisk: string;
  simpleCriticalRisk: string; 
  riskElaboration: string;
  simpleRiskElaboration: string; 
  failureChain: FailureStep[];
  groundingSources?: GroundingSource[];
  audioData?: string; 
  marketSentiment: {
    preScore: number;
    postScore: number;
    analysis: string;
    simpleAnalysis: string; 
  };
  executionPlan?: ProtocolExecutionPlan;
  warGame?: WarGameResult;
  audit?: CollaborativeAudit;
  council?: CouncilDebate;
  vectors: InfluenceVector[];
  protocolHash?: string;
  sensitivityIndices?: { factor: string; variance: number }[];
}

export interface DecisionInput {
  title: string;
  context: string;
  constraints: string;
  risks: string;
  domain?: DecisionDomain;
  useSearch?: boolean;
  image?: string; 
}

export interface SavedEntry {
  id: string;
  timestamp: number;
  input: DecisionInput;
  response: DecisionResponse;
}

export enum EngineState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
