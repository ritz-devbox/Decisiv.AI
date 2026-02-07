<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Strategic Resolution Hub

Strategic Resolution Hub is an AI-assisted decision intelligence app built with React + Gemini.
It is designed for high-stakes choices where trade-offs, uncertainty, and execution risk matter.

The app turns one decision prompt into a structured resolution package:
- Recommended direction
- Risk and failure analysis
- Scenario simulation and collaborative audit
- Practical execution plan for stakeholders

## Demo / Live App

No public AI Studio link is included intentionally.
Run locally using the setup below.

## What This App Does

- Accepts a decision brief (title, context, constraints, risks, domain)
- Generates structured AI output with:
  - Final recommendation
  - Confidence and urgency signals
  - Reasoning chain and critical risk
  - Influence vectors and sentiment shift
  - Execution plan (actions + stakeholder briefs)
- Supports optional web grounding (`useSearch`)
- Runs additional simulations:
  - War-game scenario paths
  - Multi-agent collaborative audit
- Supports layman mode for simplified explanations
- Stores decision history in browser `localStorage`
- Includes live interrogation mode with native audio model integration

## Typical Workflow

1. Enter a decision context in `HUB`.
2. Generate a strategic recommendation (or switch to layman mode).
3. Review simulation, audit, and execution tabs.
4. Save and revisit protocols in `HISTORY`.
5. Use `LIVE` to interrogate the active protocol with voice.

## Built With

- Frameworks: React 19, TypeScript, Tailwind CSS
- AI Models:
  - `gemini-3-pro-preview` (Deep Strategic Reasoning)
  - `gemini-2.5-flash-native-audio-preview-12-2025` (Real-time Voice/Vision Interrogation)
  - `veo-3.1-fast-generate-preview` (Cinematic Video Generation)
  - `gemini-2.5-flash-preview-tts` (Voice Synthesis)
- APIs & Infrastructure: Recharts (Data Viz), Web Audio API (PCM Streaming), MediaDevices API (Camera/Mic Integration), Lucide Icons

## Project Structure

- `App.tsx`: Main app shell and view routing (`HUB`, `HISTORY`, `LIVE`)
- `components/DecisionForm.tsx`: Decision input form
- `components/DecisionDisplay.tsx`: Analysis display tabs and TTS playback
- `components/HistoryHub.tsx`: Saved decision history
- `components/LiveCore.tsx`: Live session launcher UI
- `components/StrategicInterrogation.tsx`: Mic/camera + live model session
- `services/geminiService.ts`: Core model calls, schema, simulations, TTS
- `types.ts`: Shared domain types

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Configure environment in `.env.local`:
   `GEMINI_API_KEY=your_key_here`
3. Start development server:
   `npm run dev`
4. Open:
   `http://localhost:3000`

## Build and Preview

- Build production bundle:
  `npm run build`
- Preview production build locally:
  `npm run preview`

## Security Notes

- Never commit secrets (`.env.local` is ignored by git in this repo).
- This app runs model calls from the client bundle; use a restricted key in development.
- If you publish this project, move API calls to a backend service to protect credentials.

## Privacy and Sharing (Important)

This project currently calls Gemini directly from the frontend.
That means your API key is compiled into the client bundle at runtime for local/dev use.

Before sharing this project:

- Repository visibility:
  - Public repo = everyone can read your `README.md`, code, and docs.
  - Private repo = only collaborators can read them.
- AI Studio links:
  - If you paste an AI Studio app link in `README.md`, anyone who can view the repo can see that link.
  - Access to the app itself still depends on AI Studio sharing permissions.
- API keys:
  - Keep real keys only in `.env.local`.
  - Never commit `.env.local` or paste keys in issues/README/screenshots.
  - Rotate the key immediately if it was ever exposed.
- End-user data:
  - Decision history is stored in browser `localStorage` on the same device/profile.
  - No built-in authentication or encryption layer is implemented in this repo.
- Live mode permissions:
  - `LIVE` features may request microphone/camera access in the browser.
  - Do not run live sessions with sensitive data unless your environment policy allows it.

Recommended for public deployment:

- Move all model calls to a backend API you control.
- Keep the Gemini key server-side only.
- Add auth, rate limits, and audit logging before production use.
