# SwiftVisa — AI Immigration Intelligence Platform

> Know your visa odds instantly. Grounded in real policy, not guesswork.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://swiftvisa-m1a16zm9p-sumedhcm26s-projects.vercel.app)

**[Live Demo](https://swiftvisa-m1a16zm9p-sumedhcm26s-projects.vercel.app)** &nbsp;·&nbsp; **[API Docs](https://swiftvisa-api.onrender.com/docs)** &nbsp;·&nbsp; **[Report a Bug](https://github.com/sumedhcm26/swiftvisa/issues)**

---

## Overview

SwiftVisa is a full-stack AI product that transforms visa eligibility checking from a simple rule-based lookup into a genuine **Retrieval-Augmented Generation (RAG) pipeline** over structured immigration policy data.

A user enters their profile — nationality, education, work experience, and immigration goal. The system:

1. Converts the query into a dense embedding using `sentence-transformers`
2. Runs **hybrid retrieval** — BM25 keyword search + cosine vector similarity, fused via Reciprocal Rank Fusion (RRF)
3. Assembles the top-k retrieved visa policy documents into a context window
4. Sends the context + user profile to **Llama 3 70B** via Groq with a policy-grounded chain-of-thought prompt
5. Returns a **Pydantic-validated structured JSON response** — eligibility verdict, confidence score, matched requirements, gaps, rejection risk flags, policy citations, and next steps
6. Renders everything in a Next.js frontend with a downloadable PDF report

This is not a keyword matcher. It is a grounded AI reasoning system.

---

## Features

- **AI Eligibility Analysis** — RAG pipeline over 15+ visa policies with confidence scoring, requirement gap analysis, and rejection risk flags backed by policy citations
- **Country Comparison** — side-by-side AI scoring across eligibility, ease, cost, processing speed, and lifestyle for up to 6 countries simultaneously
- **Migration Route Planner** — multi-step path planning (e.g. Student → PGWP → Express Entry) with per-step timelines, costs, and action items
- **AI Chat Advisor** — conversational follow-up with session memory and policy-grounded context retrieval
- **PDF Report Export** — professional eligibility report generated server-side and streamed directly to the browser
- **12 Countries Covered** — USA, Canada, UK, Australia, Germany, Singapore, UAE, Netherlands, Ireland, Sweden, New Zealand

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   Next.js 14 App Router · TypeScript · Tailwind CSS             │
│        /          /analyze      /compare    /routes    /chat    │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP / JSON
┌──────────────────────────▼──────────────────────────────────────┐
│                         API LAYER                               │
│   FastAPI · Pydantic v2 · Async endpoints · CORS middleware     │
│   /api/analyze  /api/compare  /api/routes  /api/chat            │
│   /api/report (PDF stream)                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                       AI CORE LAYER                             │
│                                                                 │
│   Query ──► BM25 Keyword Search ──────────────────────┐        │
│      │                                                ▼        │
│      └──► Dense Vector Search (cosine sim) ──►  RRF Fusion    │
│                                                       │         │
│                                               Top-K Policies   │
│                                                       │         │
│                              ┌────────────────────────▼──────┐ │
│                              │   LLM Reasoning Layer         │ │
│                              │   Llama 3 70B via Groq        │ │
│                              │   Structured JSON · Citations  │ │
│                              └───────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                        DATA LAYER                               │
│   In-memory vector store · visa_policies.json (15 policies)     │
│   sentence-transformers (all-MiniLM-L6-v2) · ReportLab PDF      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Python 3.11 + FastAPI | Async REST API framework |
| Pydantic v2 | Request/response validation and schema enforcement |
| sentence-transformers (`all-MiniLM-L6-v2`) | Local text embeddings — runs on CPU, no API key needed |
| rank-bm25 | BM25 keyword search |
| NumPy + scikit-learn | Embedding storage and cosine similarity computation |
| Groq SDK (Llama 3 70B) | LLM inference via free API tier |
| ReportLab | Server-side PDF generation |

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with file-based routing |
| TypeScript | Type-safe JavaScript |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |

### Infrastructure

| Service | Purpose | Cost |
|---|---|---|
| Vercel | Frontend hosting + CDN + auto-deploy on push | Free |
| Render | Backend Python runtime | Free |
| Groq | Llama 3 70B inference | Free (~500 req/day) |
| GitHub Actions | CI/CD — lint and type check on every push | Free |

---

## Project Structure

```
swiftvisa/
├── apps/
│   ├── api/                          # FastAPI backend
│   │   ├── main.py                   # Entry point, middleware, router registration
│   │   ├── requirements.txt
│   │   ├── data/
│   │   │   └── visa_policies.json    # 15 visa policies across 12 countries
│   │   ├── models/
│   │   │   └── schemas.py            # Pydantic models (UserProfile, requests, responses)
│   │   ├── routers/
│   │   │   ├── analyze.py            # POST /api/analyze
│   │   │   ├── compare.py            # POST /api/compare
│   │   │   ├── routes.py             # POST /api/routes
│   │   │   ├── chat.py               # POST /api/chat
│   │   │   └── report.py             # POST /api/report → PDF stream
│   │   └── services/
│   │       ├── vector_store.py       # Hybrid BM25 + dense retrieval with RRF fusion
│   │       ├── llm_service.py        # Groq API calls and prompt engineering
│   │       └── policy_loader.py      # JSON → embeddings → vector store at startup
│   │
│   └── web/                          # Next.js 14 frontend
│       ├── app/
│       │   ├── page.tsx              # Landing page
│       │   ├── analyze/page.tsx      # Eligibility analysis
│       │   ├── compare/page.tsx      # Country comparison
│       │   ├── routes/page.tsx       # Route planner
│       │   └── chat/page.tsx         # AI chat
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── ProfileForm.tsx
│       │   └── AnalysisResult.tsx
│       └── lib/
│           └── api.ts                # All API client fetch functions
│
├── .github/workflows/ci.yml          # GitHub Actions CI
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Free Groq API key → [console.groq.com/keys](https://console.groq.com/keys) (sign up with Google, no credit card)

### 1. Clone

```bash
git clone https://github.com/sumedhcm26/swiftvisa.git
cd swiftvisa
```

### 2. Backend setup

```bash
cd apps/api

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate      # Windows (Git Bash)
# source venv/bin/activate         # Mac / Linux

# Install dependencies (takes 3-5 min — downloads embedding model)
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Open .env and set your GROQ_API_KEY
```

Your `.env` file:
```
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama3-70b-8192
```

### 3. Frontend setup

```bash
cd apps/web
npm install
cp .env.example .env.local
# .env.local already contains: NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run both servers

**Terminal 1 — Backend:**
```bash
cd apps/api
source venv/Scripts/activate
python main.py
```

First run downloads the `all-MiniLM-L6-v2` embedding model (~80MB, one-time only).
When you see `✅ Vector store ready with 15 policies` the API is live.

**Terminal 2 — Frontend:**
```bash
cd apps/web
npm run dev
```

- Frontend → [http://localhost:3000](http://localhost:3000)
- API docs → [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Countries and Visa Types

| Country | Visa Types Covered |
|---|---|
| 🇺🇸 USA | H-1B Specialty Occupation, O-1A Extraordinary Ability, F-1 Student |
| 🇨🇦 Canada | Express Entry (Federal Skilled Worker), Study Permit + PGWP |
| 🇬🇧 UK | Skilled Worker Visa, Graduate Visa (post-study) |
| 🇩🇪 Germany | EU Blue Card, Job Seeker Visa |
| 🇦🇺 Australia | Skilled Independent (Subclass 189), Student Visa (Subclass 500) |
| 🇸🇬 Singapore | Employment Pass (EP) |
| 🇦🇪 UAE | Golden Visa (10-year) |
| 🇳🇱 Netherlands | Highly Skilled Migrant (Kennismigrant) |
| 🇮🇪 Ireland | Critical Skills Employment Permit |
| 🇸🇪 Sweden | Swedish Work Permit |
| 🇳🇿 New Zealand | Skilled Migrant Category Resident Visa |

---

## API Reference

Full interactive docs: **[swiftvisa-api.onrender.com/docs](https://swiftvisa-api.onrender.com/docs)**

### `POST /api/analyze`

```json
// Request
{
  "profile": {
    "nationality": "India",
    "current_country": "India",
    "target_country": "Canada",
    "age": 26,
    "education_level": "master",
    "field_of_study": "Computer Science",
    "work_experience_years": 3,
    "current_job_title": "Software Engineer",
    "english_proficiency": "fluent",
    "ielts_score": 7.5,
    "has_job_offer": false,
    "has_family": false,
    "goal": "immigration",
    "additional_info": ""
  }
}

// Response
{
  "success": true,
  "data": {
    "top_visa": {
      "country": "Canada",
      "visa_type": "Express Entry — Federal Skilled Worker",
      "eligible": true,
      "confidence": 0.82,
      "confidence_label": "High",
      "eligibility_summary": "Strong candidate for Express Entry...",
      "matched_requirements": ["Master's degree qualifies", "IELTS 7.5 meets CLB 7+"],
      "gaps": ["CRS score depends on exact IELTS band breakdown"],
      "risk_flags": ["Current draw cutoff ~480 CRS — verify your score"],
      "rejection_probability": "Low",
      "citations": ["Must hold post-secondary degree — ECA required"],
      "next_steps": ["Get WES evaluation", "Create Express Entry profile"],
      "processing_months": 6,
      "cost_usd": 1500
    },
    "other_options": [...],
    "overall_assessment": "Strong immigration profile for Canada..."
  }
}
```

### `POST /api/compare`
Compare eligibility across multiple countries. Request: `{ "profile": {...}, "countries": ["Canada", "Germany", "UK"] }`

### `POST /api/routes`
Generate a multi-step migration route. Request: `{ "profile": {...}, "target_country": "Canada" }`

### `POST /api/chat`
Conversational follow-up. Request: `{ "message": "What is the H-1B lottery?", "history": [...] }`

### `POST /api/report`
Download PDF report. Streams binary `application/pdf` response.

---

## Key Design Decisions

**Why hybrid search instead of pure vector search?**
Dense embeddings understand semantic meaning but miss exact legal terms — "H-1B", "CRS 480", "CLB 7". BM25 catches precise keyword matches but misses synonyms. RRF fusion (60% dense + 40% BM25) gives us both, consistently outperforming either method alone.

**Why Llama 3 70B via Groq instead of OpenAI GPT-4?**
Groq's free tier provides ~500 requests/day at ~200 tokens/second — faster than paid GPT-4 Turbo. Llama 3 70B performs comparably on structured extraction tasks. Zero cost, no credit card required.

**Why structured JSON output?**
Enforcing a strict JSON schema in the system prompt means every LLM response field maps directly to a UI component. No fragile string parsing. Pydantic validates the structure server-side before it ever reaches the frontend.

**Why in-memory vector store instead of Qdrant or Pinecone?**
For 15 policies, NumPy cosine similarity is instantaneous (< 1ms) and requires zero infrastructure. The `VectorStore` class uses a clean singleton interface — switching to a production vector DB is a one-file change.

---

## Deployment

Deployed 100% free:

**Frontend → Vercel**
1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set Root Directory to `apps/web`
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render URL

**Backend → Render**
1. Connect GitHub repo on [render.com](https://render.com)
2. Set Root Directory to `apps/api`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `GROQ_API_KEY` = your key

Every push to `main` triggers automatic redeployment on both platforms.

> **Note:** Render's free tier sleeps after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. This is expected behaviour.

---

## Roadmap

- [ ] User authentication (Clerk) + saved profiles dashboard
- [ ] Policy freshness tracking — auto re-embed when government sources update
- [ ] Document readiness checker — upload passport/degree, AI validates requirements
- [ ] Semantic caching — skip LLM call for similar recent queries
- [ ] LangSmith evaluation traces for retrieval precision and answer faithfulness
- [ ] Expand to 50+ visa types across 20+ countries

---

## Disclaimer

SwiftVisa is an AI-generated analysis tool for informational purposes only. It is not legal advice. Immigration rules change frequently and vary by individual circumstances. Always verify with official government sources and consult a registered immigration lawyer before making any immigration decisions.

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

Built by [Sumedh](https://github.com/sumedhcm26) &nbsp;·&nbsp; 3rd year CSE student

If this project helped you, please give it a ⭐

</div>
