"use client";
import { useState } from "react";
import { UserProfile } from "@/lib/api";

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  loading: boolean;
  submitLabel?: string;
}

const COUNTRIES = ["India","China","Philippines","Nigeria","Pakistan","Mexico","Brazil","Bangladesh","United Kingdom","United States","Canada","Australia","Germany","France","Singapore","UAE","Netherlands","Ireland","Sweden","New Zealand","South Korea","Japan","Other"];
const TARGET_COUNTRIES = ["USA","Canada","UK","Australia","Germany","Singapore","UAE","Netherlands","Ireland","Sweden","New Zealand"];
const EDUCATION_LEVELS = [
  { value: "highschool", label: "High School" },
  { value: "diploma", label: "Diploma / Associate" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD / Doctorate" },
  { value: "highest", label: "Professional Degree (MD, JD)" },
];
const GOALS = [
  { value: "work", label: "Work / Career" },
  { value: "study", label: "Study / Education" },
  { value: "immigration", label: "Permanent Residency" },
  { value: "startup", label: "Start a Business" },
  { value: "research", label: "Research / Academia" },
];
const ENGLISH_LEVELS = [
  { value: "native", label: "Native speaker" },
  { value: "fluent", label: "Fluent (C1/C2)" },
  { value: "intermediate", label: "Intermediate (B1/B2)" },
  { value: "basic", label: "Basic (A1/A2)" },
];

const cardStyle: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.6)",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  borderRadius: 16,
  padding: "1.5rem",
  marginBottom: "1rem",
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#cbd5e1",
  marginBottom: "1rem",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid rgba(51,65,85,0.5)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
};

export default function ProfileForm({ onSubmit, loading, submitLabel = "Analyze Eligibility" }: ProfileFormProps) {
  const [form, setForm] = useState<UserProfile>({
    nationality: "India",
    current_country: "India",
    target_country: "Canada",
    age: 25,
    education_level: "bachelor",
    field_of_study: "Computer Science",
    work_experience_years: 2,
    current_job_title: "Software Engineer",
    annual_salary_usd: undefined,
    has_job_offer: false,
    job_offer_country: undefined,
    english_proficiency: "fluent",
    ielts_score: undefined,
    has_family: false,
    goal: "work",
    additional_info: "",
  });

  const set = (key: keyof UserProfile, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Personal */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Personal Details</div>
        <div style={gridStyle}>
          <div>
            <label className="label">Nationality</label>
            <div style={{ position: "relative" }}>
              <select className="select-field" value={form.nationality} onChange={(e) => set("nationality", e.target.value)}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Current Country</label>
            <select className="select-field" value={form.current_country} onChange={(e) => set("current_country", e.target.value)}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Age</label>
            <input type="number" className="input-field" min={18} max={80} value={form.age} onChange={(e) => set("age", parseInt(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Goal */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Immigration Goal</div>
        <div style={gridStyle}>
          <div>
            <label className="label">Target Country</label>
            <select className="select-field" value={form.target_country} onChange={(e) => set("target_country", e.target.value)}>
              {TARGET_COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Primary Goal</label>
            <select className="select-field" value={form.goal} onChange={(e) => set("goal", e.target.value)}>
              {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Education */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Education and Language</div>
        <div style={gridStyle}>
          <div>
            <label className="label">Education Level</label>
            <select className="select-field" value={form.education_level} onChange={(e) => set("education_level", e.target.value)}>
              {EDUCATION_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Field of Study</label>
            <input className="input-field" placeholder="e.g. Computer Science, Medicine" value={form.field_of_study} onChange={(e) => set("field_of_study", e.target.value)} />
          </div>
          <div>
            <label className="label">English Proficiency</label>
            <select className="select-field" value={form.english_proficiency} onChange={(e) => set("english_proficiency", e.target.value)}>
              {ENGLISH_LEVELS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">IELTS Score (optional)</label>
            <input type="number" className="input-field" placeholder="e.g. 7.5" min={0} max={9} step={0.5}
              value={form.ielts_score ?? ""} onChange={(e) => set("ielts_score", e.target.value ? parseFloat(e.target.value) : undefined)} />
          </div>
        </div>
      </div>

      {/* Work */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>Work Experience</div>
        <div style={gridStyle}>
          <div>
            <label className="label">Current Job Title</label>
            <input className="input-field" placeholder="e.g. Software Engineer" value={form.current_job_title} onChange={(e) => set("current_job_title", e.target.value)} />
          </div>
          <div>
            <label className="label">Years of Experience</label>
            <input type="number" className="input-field" min={0} max={50} step={0.5} value={form.work_experience_years} onChange={(e) => set("work_experience_years", parseFloat(e.target.value))} />
          </div>
          <div>
            <label className="label">Annual Salary USD (optional)</label>
            <input type="number" className="input-field" placeholder="e.g. 80000"
              value={form.annual_salary_usd ?? ""} onChange={(e) => set("annual_salary_usd", e.target.value ? parseFloat(e.target.value) : undefined)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: "#6366f1" }}
                checked={form.has_job_offer} onChange={(e) => set("has_job_offer", e.target.checked)} />
              <span style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>I have a job offer</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: "#6366f1" }}
                checked={form.has_family} onChange={(e) => set("has_family", e.target.checked)} />
              <span style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>Bringing family / dependants</span>
            </label>
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label className="label">Additional Info (optional)</label>
          <textarea className="input-field" style={{ height: 80, resize: "none" }} placeholder="e.g. I have published research papers, previously rejected for X visa..."
            value={form.additional_info ?? ""} onChange={(e) => set("additional_info", e.target.value)} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", fontSize: "1rem", padding: "1rem", gap: "0.5rem" }}>
        {loading ? (
          <>
            <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            Analyzing with AI...
          </>
        ) : submitLabel}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
