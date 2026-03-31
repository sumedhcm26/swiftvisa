from pydantic import BaseModel, Field
from typing import Optional, List


class UserProfile(BaseModel):
    nationality: str = Field(..., description="User's nationality/passport country")
    current_country: str = Field(..., description="Country user currently lives in")
    target_country: str = Field(..., description="Country user wants to move to")
    age: int = Field(..., ge=18, le=80)
    education_level: str = Field(..., description="highest/bachelor/master/phd/diploma/highschool")
    field_of_study: str = Field(..., description="e.g. Computer Science, Medicine, Business")
    work_experience_years: float = Field(..., ge=0)
    current_job_title: str = Field(default="", description="e.g. Software Engineer")
    annual_salary_usd: Optional[float] = Field(default=None)
    has_job_offer: bool = Field(default=False)
    job_offer_country: Optional[str] = Field(default=None)
    english_proficiency: str = Field(default="fluent", description="native/fluent/intermediate/basic")
    ielts_score: Optional[float] = Field(default=None)
    has_family: bool = Field(default=False)
    goal: str = Field(..., description="work/study/immigration/startup/research")
    additional_info: Optional[str] = Field(default="")


class AnalyzeRequest(BaseModel):
    profile: UserProfile


class CompareRequest(BaseModel):
    profile: UserProfile
    countries: List[str] = Field(..., min_items=2, max_items=6)


class RouteRequest(BaseModel):
    profile: UserProfile
    target_country: str


class ReportRequest(BaseModel):
    profile: UserProfile
    analysis_result: dict


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    profile: Optional[UserProfile] = None
    message: str
    history: List[ChatMessage] = Field(default=[])