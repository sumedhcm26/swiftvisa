"use client";
import Link from "next/link";
import { Globe, Zap, Shield, BarChart2, Map, FileText, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const features = [
  { icon: Zap, title: "AI Eligibility Analysis", desc: "RAG-powered analysis over real visa policies with confidence scoring and risk flags.", color: "#818cf8", bg: "rgba(99,102,241,0.1)" },
  { icon: BarChart2, title: "Country Comparison", desc: "Compare up to 6 countries side-by-side on eligibility, cost, speed, and lifestyle.", color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  { icon: Map, title: "Route Planner", desc: "Multi-step migration paths (e.g. Student to Work to PR) with timelines and costs.", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  { icon: Shield, title: "Rejection Risk Flags", desc: "Proactive alerts for specific profile weaknesses before you apply.", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  { icon: FileText, title: "PDF Reports", desc: "Download a professional eligibility report to share with consultants or employers.", color: "#fb7185", bg: "rgba(251,113,133,0.1)" },
  { icon: Globe, title: "12 Countries", desc: "USA, Canada, UK, Australia, Germany, Singapore, UAE, Netherlands, Ireland, Sweden, NZ.", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
];

const steps = [
  { step: "01", title: "Enter your profile", desc: "Nationality, education, experience, and immigration goal." },
  { step: "02", title: "AI retrieves policies", desc: "Hybrid search finds the most relevant visa policies for your profile." },
  { step: "03", title: "LLM reasons and cites", desc: "Llama 3 70B analyzes eligibility with grounded policy citations." },
  { step: "04", title: "Get actionable results", desc: "Confidence score, risk flags, next steps, and PDF report." },
];

const stats = [
  { value: "15+", label: "Visa Types" },
  { value: "12", label: "Countries" },
  { value: "< 10s", label: "Analysis Time" },
  { value: "Free", label: "Always" },
];

const techPoints = [
  "Hybrid BM25 + dense vector retrieval (RRF re-ranking)",
  "Sentence-Transformers embeddings (all-MiniLM-L6-v2)",
  "Llama 3 70B via Groq for policy-grounded reasoning",
  "Structured JSON output with Pydantic validation",
  "Policy citation tracking and source attribution",
  "Confidence scoring with uncertainty estimation",
  "Rejection risk flags from real policy rejection reasons",
  "Multi-step route planning with timeline estimation",
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, borderBottom: "1px solid rgba(30,41,59,0.5)" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", height: "4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 32, height: 32, background: "#6366f1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles style={{ width: 16, height: 16, color: "white" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "white" }}>SwiftVisa</span>
          </div>
          <Link href="/analyze" className="btn-secondary" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
            Get Started
          </Link>
        </div>
      </nav>

      <section style={{ padding: "8rem 1.5rem 6rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "rgba(99,102,241,0.08)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "56rem", margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "9999px", padding: "0.375rem 1rem", marginBottom: "1.5rem" }}>
            <Sparkles style={{ width: 14, height: 14, color: "#818cf8" }} />
            <span style={{ fontSize: "0.75rem", color: "#a5b4fc", fontWeight: 500 }}>Powered by Llama 3 70B + RAG</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "1.5rem" }}>
            <span style={{ color: "white" }}>Know your</span><br />
            <span className="gradient-text">visa odds</span><br />
            <span style={{ color: "white" }}>instantly.</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.125rem", maxWidth: "40rem", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            AI-powered eligibility analysis grounded in real immigration policy documents. Not guesswork — actual RAG over visa rules, with citations, confidence scores, and risk flags.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/analyze" className="btn-primary" style={{ fontSize: "1rem", gap: "0.5rem" }}>
              Analyze My Eligibility <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link href="/compare" className="btn-secondary" style={{ fontSize: "1rem" }}>Compare Countries</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginTop: "4rem" }}>
            {stats.map((s) => (
              <div key={s.label} className="glass-card" style={{ padding: "1.25rem", textAlign: "center" }}>
                <div className="gradient-text" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid rgba(30,41,59,0.5)" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>How it works</h2>
            <p style={{ color: "#94a3b8" }}>From profile to actionable plan in seconds</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {steps.map((s) => (
              <div key={s.step} className="glass-card" style={{ padding: "1.5rem" }}>
                <div className="gradient-text" style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.75rem" }}>{s.step}</div>
                <h3 style={{ fontWeight: 600, color: "white", marginBottom: "0.5rem", fontSize: "0.875rem" }}>{s.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem", background: "rgba(15,23,42,0.3)" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "white", marginBottom: "0.75rem" }}>Everything you need</h2>
            <p style={{ color: "#94a3b8" }}>Enterprise-grade immigration intelligence, completely free</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-card" style={{ padding: "1.5rem" }}>
                  <div style={{ width: 40, height: 40, background: f.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                    <Icon style={{ width: 20, height: 20, color: f.color }} />
                  </div>
                  <h3 style={{ fontWeight: 600, color: "white", marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
          <div className="glass-card" style={{ padding: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ width: 48, height: 48, background: "rgba(99,102,241,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Zap style={{ width: 24, height: 24, color: "#818cf8" }} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "0.25rem" }}>Built on real AI engineering</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Not a rule-based eligibility checker. A proper RAG pipeline.</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
              {techPoints.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "#818cf8", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem", borderTop: "1px solid rgba(30,41,59,0.5)", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.875rem", fontWeight: 700, color: "white", marginBottom: "1rem" }}>Ready to find your path?</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>Get your personalized eligibility analysis in under 10 seconds.</p>
        <Link href="/analyze" className="btn-primary" style={{ fontSize: "1rem", gap: "0.5rem" }}>
          Start Free Analysis <ArrowRight style={{ width: 16, height: 16 }} />
        </Link>
      </section>

      <footer style={{ borderTop: "1px solid rgba(30,41,59,0.5)", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 24, height: 24, background: "#6366f1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles style={{ width: 12, height: 12, color: "white" }} />
            </div>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>SwiftVisa — AI Immigration Intelligence</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#475569" }}>For informational purposes only. Not legal advice.</p>
        </div>
      </footer>
    </div>
  );
}
