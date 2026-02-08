
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { 
  DecisionInput, 
  DecisionResponse, 
  GroundingSource, 
  EngineSettings, 
  ProtocolExecutionPlan, 
  WarGameResult, 
  CollaborativeAudit,
  CouncilDebate
} from "../types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDecision = async (input: DecisionInput, settings: EngineSettings, isLaymanMode: boolean = false): Promise<DecisionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are the Decisiv.AI Core, a world-class strategic resolution engine. 
    You specialize in deterministic logic, adversarial risk assessment, and multi-modal synthesis.
    You MUST provide two versions of every text field: a 'Strategic' version (high-level, professional) and a 'Layman' version (simple, analogy-driven, accessible to a 10-year-old).
    You MUST provide a detailed execution plan with phase-based actions and audience-specific stakeholder briefs.`;

  const prompt = `[DOMAIN: ${input.domain}] 
    RESOLVE DECISION PROTOCOL: "${input.title}". 
    CONTEXTUAL PRIORS: "${input.context}". 
    LIMITING CONSTRAINTS: ${input.constraints || 'None specified'}. 
    KNOWN VOLATILITY: ${input.risks || 'None specified'}.
    
    SIMULATION PARAMETERS:
    - Confidence score (0-100)
    - Urgency level
    - Inference chains with strategic nuance
    - Critical risk identification
    - Full execution roadmap
    ${isLaymanMode ? "NOTE: Priority on simple, clear language for all primary fields." : ""}`;
    
  const parts: any[] = [{ text: prompt }];
  if (input.image) {
    const mimeType = input.image.split(';')[0].split(':')[1] || "image/jpeg";
    const base64Data = input.image.split(',')[1];
    parts.push({ 
      inlineData: { 
        mimeType: mimeType, 
        data: base64Data 
      } 
    });
  }

  const modelParams = {
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      tools: input.useSearch ? [{ googleSearch: {} }] : undefined,
      thinkingConfig: { thinkingBudget: 16384 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          simpleDecision: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          urgencyLevel: { type: Type.STRING, enum: ["Critical", "High", "Moderate", "Strategic"] },
          thinkingLevel: { type: Type.STRING, enum: ["Surface", "Deep", "Recursive", "Multi-Spectral"] },
          reasons: { 
            type: Type.ARRAY,
            items: { 
              type: Type.OBJECT,
              properties: {
                main: { type: Type.STRING },
                nuance: { type: Type.STRING },
                simple: { type: Type.STRING }
              },
              required: ["main", "nuance", "simple"]
            }
          },
          criticalRisk: { type: Type.STRING },
          simpleCriticalRisk: { type: Type.STRING },
          riskElaboration: { type: Type.STRING },
          simpleRiskElaboration: { type: Type.STRING },
          failureChain: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["title", "impact"]
            }
          },
          marketSentiment: {
            type: Type.OBJECT,
            properties: {
              preScore: { type: Type.NUMBER },
              postScore: { type: Type.NUMBER },
              analysis: { type: Type.STRING },
              simpleAnalysis: { type: Type.STRING }
            },
            required: ["preScore", "postScore", "analysis", "simpleAnalysis"]
          },
          executionPlan: {
            type: Type.OBJECT,
            properties: {
              actions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    phase: { type: Type.STRING, enum: ['Immediate', 'Secondary', 'Long-term'] },
                    department: { type: Type.STRING },
                    simpleDescription: { type: Type.STRING }
                  },
                  required: ["id", "title", "description", "phase", "department", "simpleDescription"]
                }
              },
              briefs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    audience: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    content: { type: Type.STRING },
                    tone: { type: Type.STRING }
                  },
                  required: ["id", "audience", "subject", "content", "tone"]
                }
              }
            },
            required: ["actions", "briefs"]
          },
          vectors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                weight: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["category", "weight", "description"]
            }
          }
        },
        required: ["decision", "simpleDecision", "confidenceScore", "urgencyLevel", "thinkingLevel", "reasons", "criticalRisk", "simpleCriticalRisk", "riskElaboration", "simpleRiskElaboration", "failureChain", "marketSentiment", "vectors", "executionPlan"]
      }
    }
  };

  let response;
  try {
    // Attempt Primary Pro Model
    response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      ...modelParams
    });
  } catch (err: any) {
    // Automatic Fallback on Quota or Pro failure
    console.warn("Primary Pro model restricted. Falling back to Flash kernel.");
    response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      ...modelParams
    });
  }

  const rawText = response.text || "{}";
  let res: any = JSON.parse(rawText);
  
  try {
    await delay(300);
    res.warGame = await runWarGame(res.decision, input.context, isLaymanMode).catch(() => null);
    await delay(300);
    res.audit = await runCollaborativeAudit(res.decision, input.context, isLaymanMode).catch(() => null);
  } catch(e) { console.debug('Secondary simulation bypass', e); }

  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    res.groundingSources = response.candidates[0].groundingMetadata.groundingChunks
      .map((c: any) => c.web ? { title: c.web.title, uri: c.web.uri } : null)
      .filter(Boolean);
  }

  try {
    const ttsText = isLaymanMode ? (res.simpleDecision || res.decision) : res.decision;
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this strategic verdict: ${ttsText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voiceName } } },
      },
    });
    res.audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) { console.debug('TTS bypass', e); }

  res.protocolHash = `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
  return res;
};

export const runWarGame = async (decision: string, context: string, isLayman: boolean = false): Promise<WarGameResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `PERFORM ADVERSARIAL WAR-GAME SIMULATION. DECISION: "${decision}". CONTEXT: "${context}".`;
  
  const modelParams = {
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 8192 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          paths: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                strategyName: { type: Type.STRING },
                successProbability: { type: Type.NUMBER },
                attritionRate: { type: Type.NUMBER },
                timeToValue: { type: Type.STRING },
                terminalOutcome: { type: Type.STRING },
                simpleOutcome: { type: Type.STRING },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "strategyName", "successProbability", "attritionRate", "timeToValue", "terminalOutcome", "simpleOutcome", "risks"]
            }
          },
          recommendedPathId: { type: Type.STRING },
          comparativeAnalysis: { type: Type.STRING },
          simpleComparison: { type: Type.STRING }
        },
        required: ["paths", "recommendedPathId", "comparativeAnalysis", "simpleComparison"]
      }
    }
  };

  let response;
  try {
    response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', ...modelParams });
  } catch (e) {
    response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', ...modelParams });
  }
  return JSON.parse(response.text || "{}");
};

export const runCollaborativeAudit = async (decision: string, context: string, isLayman: boolean = false): Promise<CollaborativeAudit> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `MULTI-AGENT LOGIC AUDIT. DECISION: "${decision}". AUDIT FOR BIAS, FRAGILITY, AND LONG-TERM SUSTAINABILITY.`;
  
  const modelParams = {
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4096 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                agentRole: { type: Type.STRING },
                perspective: { type: Type.STRING },
                sentiment: { type: Type.STRING, enum: ['Supportive', 'Critical', 'Neutral'] },
                score: { type: Type.NUMBER }
              },
              required: ["agentRole", "perspective", "sentiment", "score"]
            }
          },
          consensusScore: { type: Type.NUMBER },
          terminalSummary: { type: Type.STRING },
          simpleSummary: { type: Type.STRING }
        },
        required: ["nodes", "consensusScore", "terminalSummary", "simpleSummary"]
      }
    }
  };

  let response;
  try {
    response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', ...modelParams });
  } catch (e) {
    response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', ...modelParams });
  }
  return JSON.parse(response.text || "{}");
};

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data: Float32Array): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const transmitProtocol = async (brief: any): Promise<string> => {
  return "TX-CONFIRMED-" + Math.random().toString(36).substr(2,6).toUpperCase();
};

export const generateScenario = async (title: string, domain: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a high-stakes professional scenario description for a dilemma titled "${title}" in the domain of "${domain}". Focus on complexity and hidden risks.`,
  });
  return response.text || "";
};
