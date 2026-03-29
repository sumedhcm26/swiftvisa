"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfileForm";
import { compareCountries, UserProfile } from "@/lib/api";
import {
  BarChart2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "Germany",
  "Singapore",
  "UAE",
  "Netherlands",
  "Ireland",
  "Sweden",
  "New Zealand",
];

const RANK_COLORS = [
  "text-amber-400",
  "text-slate-300",
  "text-amber-600",
  "text-slate-400",
  "text-slate-500",
  "text-slate-600",
];

export default function ComparePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([
    "Canada",
    "Germany",
    "UK",
  ]);

  const toggleCountry = (c: string) => {
    setSelected((prev) =>
      prev.includes(c)
        ? prev.filter((x) => x !== c)
        : prev.length < 6
          ? [...prev, c]
          : prev,
    );
  };

  const handleSubmit = async (p: UserProfile) => {
    if (selected.length < 2) {
      setError("Select at least 2 countries");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await compareCountries(p, selected);
      setResult(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">
                Country Comparison
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Compare Countries
            </h1>
            <p className="text-slate-400 text-sm">
              Select up to 6 countries. Get AI-powered ranking based on your
              profile.
            </p>
          </div>

          <div className="glass-card p-6 mb-4">
            <p className="text-sm font-semibold text-slate-300 mb-3">
              Select countries to compare ({selected.length}/6)
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCountry(c)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150",
                    selected.includes(c)
                      ? "bg-brand-500/20 border-brand-500/50 text-brand-300"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300",
                  )}
                >
                  {c}
                  {selected.includes(c) && (
                    <span className="ml-1.5 text-brand-400">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <ProfileForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={`Compare ${selected.length} Countries`}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div className="mt-8 glass-card p-10 text-center">
              <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300 font-medium">
                Comparing countries with AI...
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8 space-y-5 slide-in">
              {result.recommendation && (
                <div className="glass-card p-5 border-brand-500/20">
                  <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-2">
                    AI Recommendation
                  </p>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>
              )}

              {result.ranking?.length > 0 && (
                <div className="glass-card p-6">
                  <p className="text-sm font-semibold text-slate-300 mb-4">
                    Score overview
                  </p>
                  <div className="space-y-3">
                    {result.ranking.map((r: any, i: number) => (
                      <div key={r.country} className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-sm font-bold w-5 text-right",
                            RANK_COLORS[i],
                          )}
                        >
                          #{i + 1}
                        </span>
                        <span className="text-sm text-slate-300 w-28 flex-shrink-0">
                          {r.country}
                        </span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{ width: `${r.overall_score ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">
                          {r.overall_score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {result.ranking?.map((r: any, i: number) => (
                  <div
                    key={r.country}
                    className={cn(
                      "glass-card p-6",
                      i === 0 && "border-brand-500/30",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-2xl font-bold",
                            RANK_COLORS[i] || "text-slate-400",
                          )}
                        >
                          #{i + 1}
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {r.country}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {r.best_visa}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-white">
                          {r.overall_score}
                        </div>
                        <div className="text-xs text-slate-500">
                          overall score
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">{r.summary}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                      {[
                        { label: "Eligible", val: r.eligibility_score },
                        { label: "Ease", val: r.ease_score },
                        { label: "Cost", val: r.cost_score },
                        { label: "Speed", val: r.speed_score },
                        { label: "Lifestyle", val: r.lifestyle_score },
                      ].map(({ label, val }) => (
                        <div key={label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">{label}</span>
                            <span className="text-slate-400">{val ?? "—"}</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 rounded-full"
                              style={{ width: `${val ?? 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {r.pros?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-emerald-400 mb-2">
                            Pros
                          </p>
                          <ul className="space-y-1">
                            {r.pros.map((p: string, j: number) => (
                              <li
                                key={j}
                                className="flex items-start gap-1.5 text-xs text-slate-400"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {r.cons?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-400 mb-2">
                            Cons
                          </p>
                          <ul className="space-y-1">
                            {r.cons.map((c: string, j: number) => (
                              <li
                                key={j}
                                className="flex items-start gap-1.5 text-xs text-slate-400"
                              >
                                <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {(r.estimated_timeline || r.estimated_cost_usd) && (
                      <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700/50">
                        {r.estimated_timeline && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            {r.estimated_timeline}
                          </div>
                        )}
                        {r.estimated_cost_usd && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <DollarSign className="w-3.5 h-3.5" />
                            ~${r.estimated_cost_usd?.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
