const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  nationality: string;
  current_country: string;
  target_country: string;
  age: number;
  education_level: string;
  field_of_study: string;
  work_experience_years: number;
  current_job_title: string;
  annual_salary_usd?: number;
  has_job_offer: boolean;
  job_offer_country?: string;
  english_proficiency: string;
  ielts_score?: number;
  has_family: boolean;
  goal: string;
  additional_info?: string;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

export async function analyzeEligibility(profile: UserProfile) {
  return apiFetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ profile }),
  });
}

export async function compareCountries(profile: UserProfile, countries: string[]) {
  return apiFetch("/api/compare", {
    method: "POST",
    body: JSON.stringify({ profile, countries }),
  });
}

export async function getCountries() {
  return apiFetch("/api/compare/countries");
}

export async function planRoute(profile: UserProfile, target_country: string) {
  return apiFetch("/api/routes", {
    method: "POST",
    body: JSON.stringify({ profile, target_country }),
  });
}

export async function sendChat(
  message: string,
  history: { role: string; content: string }[],
  profile?: UserProfile
) {
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, history, profile }),
  });
}

export async function downloadReport(profile: UserProfile, analysis_result: object) {
  const res = await fetch(`${API_URL}/api/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, analysis_result }),
  });
  if (!res.ok) throw new Error("Report generation failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `swiftvisa_${profile.nationality}_${profile.target_country}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}