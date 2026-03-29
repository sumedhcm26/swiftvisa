"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfileForm";
import { planRoute, UserProfile } from "@/lib/api";
import {
  Map,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Moderate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Hard: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function RoutesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (p: UserProfile) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await planRoute(p, p.target_country);
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
              <Map className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs text-violet-300 font-medium">
                Migration Route Planner
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Plan Your Migration Route
            </h1>
            <p className="text-slate-400 text-sm">
              Get a multi-step route plan (e.g. Student → Work → PR) with
              timelines, costs, and action items.
            </p>
          </div>

          <ProfileForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Generate Route Plan"
          />

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div className="mt-8 glass-card p-10 text-center">
              <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300 font-medium">
                Planning your route...
              </p>
              <p className="text-slate-500 text-sm mt-1">
                AI is designing your optimal migration path
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8 space-y-5 slide-in">
              {/* Route header */}
              <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {result.route_name}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {result.timeline_summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={cn(
                        "badge border text-xs px-3 py-1.5",
                        DIFFICULTY_COLOR[result.difficulty] ||
                          DIFFICULTY_COLOR.Moderate,
                      )}
                    >
                      {result.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {result.total_estimated_months && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <Clock className="w-4 h-4 text-violet-400" />
                      Total: {result.total_estimated_months} months
                    </div>
                  )}
                </div>
              </div>

              {/* Steps */}
              {result.steps?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-300">
                    Step-by-step route
                  </p>
                  {result.steps.map((step: any, i: number) => (
                    <div
                      key={i}
                      className="glass-card p-5 relative overflow-hidden"
                    >
                      {/* Step connector line */}
                      {i < result.steps.length - 1 && (
                        <div
                          className="absolute left-[30px] bottom-0 w-px h-5 bg-brand-500/30 z-10"
                          style={{ transform: "translateY(100%)" }}
                        />
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-brand-400 font-bold text-sm">
                            {step.step}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                            <div>
                              <h3 className="font-semibold text-white text-sm">
                                {step.title}
                              </h3>
                              <p className="text-xs text-brand-400">
                                {step.visa_type}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
                              {step.duration_months && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{" "}
                                  {step.duration_months}mo
                                </span>
                              )}
                              {step.cost_usd && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" /> $
                                  {step.cost_usd?.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-3">
                            {step.description}
                          </p>

                          {step.requirements?.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs text-slate-500 mb-1.5">
                                Requirements:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {step.requirements.map(
                                  (r: string, j: number) => (
                                    <span
                                      key={j}
                                      className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700"
                                    >
                                      {r}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {step.tasks?.length > 0 && (
                            <ul className="space-y-1 mt-2">
                              {step.tasks.map((t: string, j: number) => (
                                <li
                                  key={j}
                                  className="flex items-start gap-2 text-xs text-slate-400"
                                >
                                  <ChevronRight className="w-3 h-3 text-brand-500 flex-shrink-0 mt-0.5" />{" "}
                                  {t}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Alternative routes */}
              {result.alternative_routes?.length > 0 && (
                <div className="glass-card p-6">
                  <p className="text-sm font-semibold text-slate-300 mb-3">
                    Alternative Routes
                  </p>
                  <div className="space-y-3">
                    {result.alternative_routes.map((r: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-xl">
                        <p className="text-sm font-medium text-slate-200 mb-1">
                          {r.name}
                        </p>
                        <p className="text-xs text-slate-400 mb-1">
                          {r.summary}
                        </p>
                        {r.best_for && (
                          <p className="text-xs text-brand-400">
                            Best for: {r.best_for}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risks and tips */}
              <div className="grid sm:grid-cols-2 gap-4">
                {result.key_risks?.length > 0 && (
                  <div className="glass-card p-5">
                    <p className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Key Risks
                    </p>
                    <ul className="space-y-2">
                      {result.key_risks.map((r: string, i: number) => (
                        <li
                          key={i}
                          className="text-xs text-slate-400 flex items-start gap-2"
                        >
                          <span className="text-amber-500 mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.tips?.length > 0 && (
                  <div className="glass-card p-5">
                    <p className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" /> Insider Tips
                    </p>
                    <ul className="space-y-2">
                      {result.tips.map((t: string, i: number) => (
                        <li
                          key={i}
                          className="text-xs text-slate-400 flex items-start gap-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />{" "}
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
