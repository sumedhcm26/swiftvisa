"use client";
import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { downloadReport, UserProfile } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  result: any;
  profile: UserProfile;
}

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    pct >= 70
      ? "text-emerald-400"
      : pct >= 40
        ? "text-amber-400"
        : "text-red-400";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">AI Confidence</span>
        <span className={cn("text-sm font-bold", textColor)}>{pct}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {value >= 0.7
          ? "Strong match"
          : value >= 0.4
            ? "Partial match — review gaps"
            : "Low eligibility — see alternatives"}
      </p>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    High: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  return (
    <span className={cn("badge border", map[level] || map["Medium"])}>
      {level} rejection risk
    </span>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-200 hover:bg-slate-800/50 transition-colors"
      >
        {title}
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  );
}

export default function AnalysisResult({ result, profile }: Props) {
  const [downloading, setDownloading] = useState(false);
  const top = result?.top_visa || {};
  const others = result?.other_options || [];
  const policies = result?.retrieved_policies || [];

  const eligible = top.eligible ?? false;
  const confidence = top.confidence ?? 0;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport(profile, result);
    } catch {
      alert("PDF generation failed. Is the backend running?");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4 animate-in">
      {/* Top card */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              eligible ? "bg-emerald-500/15" : "bg-red-500/15",
            )}
          >
            {eligible ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    {top.country}
                  </span>
                  <span className="text-slate-700">·</span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      eligible
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400",
                    )}
                  >
                    {eligible ? "Eligible" : "Not Eligible"}
                  </span>
                  {top.rejection_probability && (
                    <RiskBadge level={top.rejection_probability} />
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {top.visa_type}
                </h2>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3 flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                {downloading ? "Generating..." : "PDF Report"}
              </button>
            </div>
          </div>
        </div>

        <ConfidenceMeter value={confidence} />

        {top.eligibility_summary && (
          <p className="mt-4 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
            {top.eligibility_summary}
          </p>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {top.processing_months && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">Processing</p>
              <p className="text-sm font-semibold text-slate-200">
                {top.processing_months} months
              </p>
            </div>
          )}
          {top.cost_usd && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">Est. Cost</p>
              <p className="text-sm font-semibold text-slate-200">
                ~${top.cost_usd?.toLocaleString()}
              </p>
            </div>
          )}
          {top.confidence_label && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 mb-0.5">Match Quality</p>
              <p className="text-sm font-semibold text-slate-200">
                {top.confidence_label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Requirements met */}
      {top.matched_requirements?.length > 0 && (
        <Section
          title={`✓ Requirements Met (${top.matched_requirements.length})`}
        >
          <ul className="space-y-2">
            {top.matched_requirements.map((r: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Gaps */}
      {top.gaps?.length > 0 && (
        <Section title={`✗ Gaps / Missing Requirements (${top.gaps.length})`}>
          <ul className="space-y-2">
            {top.gaps.map((g: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-300"
              >
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                {g}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Risk flags */}
      {top.risk_flags?.length > 0 && (
        <Section title={`⚠ Risk Flags (${top.risk_flags.length})`}>
          <ul className="space-y-2">
            {top.risk_flags.map((r: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-amber-300"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
          {top.rejection_reason && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
              <strong>Main concern:</strong> {top.rejection_reason}
            </div>
          )}
        </Section>
      )}

      {/* Action plan */}
      {top.next_steps?.length > 0 && (
        <Section title="📋 Action Plan">
          <ol className="space-y-3">
            {top.next_steps.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Skill gaps */}
      {result?.skill_gaps?.length > 0 && (
        <Section title="💡 Skill Gaps to Improve" defaultOpen={false}>
          <ul className="space-y-2">
            {result.skill_gaps.map((s: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-300"
              >
                <ArrowRight className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Citations */}
      {top.citations?.length > 0 && (
        <Section title="📎 Policy Citations" defaultOpen={false}>
          <ul className="space-y-2">
            {top.citations.map((c: string, i: number) => (
              <li
                key={i}
                className="text-xs text-slate-400 bg-slate-800/50 rounded-lg p-3 italic"
              >
                "{c}"
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Alternatives */}
      {others.length > 0 && (
        <Section title="🔀 Alternative Visa Options" defaultOpen={false}>
          <div className="space-y-3">
            {others.map((o: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {o.country} — {o.visa_type}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{o.one_line}</p>
                </div>
                <div className="text-xs text-brand-400 font-semibold ml-4 flex-shrink-0">
                  {Math.round((o.fit_score ?? 0) * 100)}% fit
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Overall */}
      {result?.overall_assessment && (
        <div className="glass-card p-5 border-brand-500/20">
          <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-2">
            AI Assessment
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {result.overall_assessment}
          </p>
        </div>
      )}

      {/* Policies retrieved */}
      {policies.length > 0 && (
        <Section
          title={`🔍 Policies Retrieved by RAG (${policies.length})`}
          defaultOpen={false}
        >
          <p className="text-xs text-slate-500 mb-3">
            These are the visa policies the AI retrieved and reasoned over.
          </p>
          <div className="space-y-2">
            {policies.map((p: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
              >
                <span className="text-xs text-slate-500 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-300">
                    {p.country} — {p.visa_type}
                  </span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {p.tags?.slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="text-xs bg-slate-700/50 text-slate-500 px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-brand-400 font-medium flex-shrink-0">
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      <p className="text-xs text-slate-600 text-center pb-2">
        AI-generated — for informational purposes only. Always verify with
        official sources and consult an immigration lawyer.
      </p>
    </div>
  );
}
