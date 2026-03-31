"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfileForm";
import AnalysisResult from "@/components/AnalysisResult";
import { analyzeEligibility, UserProfile } from "@/lib/api";
import { Zap } from "lucide-react";

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (p: UserProfile) => {
    setLoading(true);
    setError("");
    setResult(null);
    setProfile(p);

    try {
      // ✅ STEP 1: Convert frontend data → backend format
      const mappedProfile = {
        nationality: p.nationality || "India",
        current_country: p.current_country || "India",
        target_country: p.target_country || "Canada",
        age: Number(p.age) || 22,
        education_level: p.education_level || (p as any).education || "Bachelors",
        field_of_study: p.field_of_study || "Computer Science",
        work_experience_years: Number(
          p.work_experience_years || (p as any).experience || 0,
        ),
        current_job_title: p.current_job_title || "Student",
        annual_salary_usd: Number(p.annual_salary_usd || 0),
        has_job_offer: Boolean(p.has_job_offer || false),
        job_offer_country: p.job_offer_country || "",
        english_proficiency: p.english_proficiency || "fluent",
        ielts_score: Number(p.ielts_score || 6),
        has_family: Boolean(p.has_family || false),
        goal: p.goal || "Work",
        additional_info: p.additional_info || "",
      };

      console.log("Sending to backend:", mappedProfile); // 🔍 DEBUG

      // ✅ STEP 2: Send mapped data
      const res = await analyzeEligibility(mappedProfile);

      setResult(res.data);
    } catch (e: any) {
      setError(e.message || "Analysis failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          paddingTop: "6rem",
          paddingBottom: "4rem",
          padding: "6rem 1rem 4rem",
        }}
      >
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "9999px",
                padding: "0.375rem 1rem",
                marginBottom: "1rem",
              }}
            >
              <Zap style={{ width: 14, height: 14, color: "#818cf8" }} />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#a5b4fc",
                  fontWeight: 500,
                }}
              >
                AI Eligibility Screening
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                color: "white",
                marginBottom: "0.5rem",
              }}
            >
              Visa Eligibility Analysis
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
              Fill in your profile. Our RAG pipeline retrieves relevant visa
              policies and uses Llama 3 to analyze your eligibility.
            </p>
          </div>

          <ProfileForm onSubmit={handleSubmit} loading={loading} />

          {error && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "0.75rem",
                color: "#f87171",
                fontSize: "0.875rem",
              }}
            >
              ⚠ {error}
            </div>
          )}

          {loading && (
            <div
              className="glass-card"
              style={{
                marginTop: "2rem",
                padding: "2.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(99,102,241,0.3)",
                  borderTopColor: "#6366f1",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p style={{ color: "#cbd5e1", fontWeight: 500 }}>
                Retrieving policies and analyzing...
              </p>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                Hybrid search + Llama 3 70B reasoning
              </p>
            </div>
          )}

          {result && !loading && (
            <div style={{ marginTop: "2rem" }}>
              <AnalysisResult result={result} profile={profile!} />
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
