"""
LLM service using Groq API — completely free tier.
Groq provides llama3-70b with generous free limits.
Get your free key at: https://console.groq.com/keys
"""
import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")


def _get_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set. Get a free key at https://console.groq.com/keys")
    return Groq(api_key=GROQ_API_KEY)


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code blocks."""
    # Try direct parse
    try:
        return json.loads(text)
    except Exception:
        pass
    # Try extracting from code block
    match = re.search(r"```(?:json)?\s*([\s\S]+?)```", text)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except Exception:
            pass
    # Try finding first { ... }
    match = re.search(r"\{[\s\S]+\}", text)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:
            pass
    return {"raw_response": text, "parse_error": True}


def analyze_eligibility(user_profile: dict, policies_context: list) -> dict:
    client = _get_client()

    context_str = ""
    for i, (policy, score) in enumerate(policies_context):
        context_str += f"\n\n--- Policy {i+1} (relevance: {score:.2f}) ---\n"
        context_str += f"Country: {policy['country']}\n"
        context_str += f"Visa: {policy['visa_type']}\n"
        context_str += f"Category: {policy['category']}\n"
        context_str += f"Eligibility: {policy['eligibility_text']}\n"
        req = policy.get("requirements", {})
        context_str += f"Requirements: {json.dumps(req)}\n"
        context_str += f"Rejection risks: {', '.join(policy.get('rejection_risk_factors', []))}\n"
        context_str += f"Processing time: {policy.get('processing_time_months')} months\n"
        context_str += f"Cost: ~USD {policy.get('cost_usd', 'N/A')}\n"
        context_str += f"Next steps: {json.dumps(policy.get('next_steps', []))}\n"
        context_str += f"Alternatives: {', '.join(policy.get('alternative_visas', []))}\n"

    prompt = f"""You are SwiftVisa, an expert immigration AI consultant. Analyze this user's eligibility for visas based ONLY on the policy documents provided.

USER PROFILE:
{json.dumps(user_profile, indent=2)}

VISA POLICY DOCUMENTS:
{context_str}

Analyze the user's eligibility carefully and respond with ONLY a valid JSON object (no markdown, no explanation outside JSON):

{{
  "top_visa": {{
    "id": "policy id",
    "country": "country name",
    "visa_type": "visa type name",
    "eligible": true/false,
    "confidence": 0.0-1.0,
    "confidence_label": "High/Medium/Low",
    "eligibility_summary": "2-3 sentence plain English summary",
    "matched_requirements": ["list of requirements the user meets"],
    "gaps": ["list of requirements the user doesn't meet or is unclear on"],
    "risk_flags": ["specific risks for this user"],
    "rejection_probability": "Low/Medium/High",
    "rejection_reason": "main rejection concern if any",
    "processing_months": 6,
    "cost_usd": 4000,
    "citations": ["exact quote from policy text supporting your conclusion"],
    "next_steps": ["actionable step 1", "step 2", "step 3"],
    "alternatives": ["alternative visa 1", "alternative visa 2"]
  }},
  "other_options": [
    {{
      "visa_type": "visa name",
      "country": "country",
      "fit_score": 0.0-1.0,
      "one_line": "why this is an alternative"
    }}
  ],
  "overall_assessment": "1-2 sentence overall immigration outlook for this user",
  "skill_gaps": ["specific things user should improve to strengthen application"]
}}"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000,
    )
    raw = response.choices[0].message.content
    return _extract_json(raw)


def compare_countries(user_profile: dict, countries_policies: dict) -> dict:
    client = _get_client()

    context = ""
    for country, policies in countries_policies.items():
        context += f"\n\n=== {country} ===\n"
        for p in policies[:2]:  # top 2 per country
            context += f"Visa: {p['visa_type']}\n"
            context += f"Category: {p['category']}\n"
            context += f"Eligibility: {p['eligibility_text']}\n"
            req = p.get("requirements", {})
            context += f"Salary min: {req.get('salary_minimum_usd', 'N/A')} USD\n"
            context += f"Processing: {p.get('processing_time_months')} months\n"
            context += f"Cost: USD {p.get('cost_usd')}\n"

    prompt = f"""You are SwiftVisa AI. Compare immigration options across countries for this user.

USER PROFILE:
{json.dumps(user_profile, indent=2)}

COUNTRY POLICIES:
{context}

Respond ONLY with valid JSON:
{{
  "ranking": [
    {{
      "rank": 1,
      "country": "country name",
      "best_visa": "visa type",
      "overall_score": 0-100,
      "eligibility_score": 0-100,
      "ease_score": 0-100,
      "cost_score": 0-100,
      "speed_score": 0-100,
      "lifestyle_score": 0-100,
      "summary": "2-sentence recommendation",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "estimated_timeline": "X months",
      "estimated_cost_usd": 5000
    }}
  ],
  "recommendation": "1-2 sentence overall recommendation naming the best country for this user"
}}"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000,
    )
    return _extract_json(response.choices[0].message.content)


def plan_migration_route(user_profile: dict, target_country: str, policies: list) -> dict:
    client = _get_client()

    context = json.dumps([{
        "visa_type": p.get("visa_type"),
        "category": p.get("category"),
        "eligibility_text": p.get("eligibility_text"),
        "requirements": p.get("requirements"),
        "processing_time_months": p.get("processing_time_months"),
        "alternative_visas": p.get("alternative_visas", []),
        "next_steps": p.get("next_steps", []),
    } for p in policies], indent=2)

    prompt = f"""You are SwiftVisa AI. Create a realistic step-by-step migration route plan.

USER: {json.dumps(user_profile, indent=2)}
TARGET COUNTRY: {target_country}
AVAILABLE VISAS: {context}

Design a realistic multi-step migration route. Respond ONLY with valid JSON:
{{
  "route_name": "e.g. Student → Work → PR Route",
  "total_estimated_months": 36,
  "difficulty": "Easy/Moderate/Hard",
  "steps": [
    {{
      "step": 1,
      "title": "step title",
      "visa_type": "visa name",
      "duration_months": 12,
      "description": "what to do in this step",
      "requirements": ["req 1", "req 2"],
      "cost_usd": 1000,
      "tasks": ["specific task 1", "task 2", "task 3"]
    }}
  ],
  "alternative_routes": [
    {{
      "name": "alternative route name",
      "summary": "brief description",
      "best_for": "who this suits"
    }}
  ],
  "timeline_summary": "narrative description of the full journey",
  "key_risks": ["risk 1", "risk 2"],
  "tips": ["insider tip 1", "tip 2"]
}}"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=2500,
    )
    return _extract_json(response.choices[0].message.content)


def chat_followup(conversation_history: list, user_message: str, context_policies: list) -> str:
    client = _get_client()

    policy_context = ""
    for p, score in context_policies[:3]:
        policy_context += f"\n- {p['country']} {p['visa_type']}: {p['eligibility_text'][:200]}..."

    system = f"""You are SwiftVisa AI, an expert immigration consultant. 
You have deep knowledge of global visa policies. Be specific, honest, and cite policy details.
Current relevant policies:{policy_context}
Keep responses concise (3-5 sentences max) and actionable."""

    messages = [{"role": "system", "content": system}]
    messages.extend(conversation_history[-6:])  # last 3 turns
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=0.5,
        max_tokens=500,
    )
    return response.choices[0].message.content