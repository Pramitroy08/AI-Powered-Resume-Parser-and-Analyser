from pydantic import BaseModel, Field
from typing import List, Optional

class ContactInfo(BaseModel):
    name: str = Field(description="Full name")
    email: str = Field(description="Email address")
    phone: Optional[str] = "Not found"

class SkillSet(BaseModel):
    programming: List[str] = []
    web: List[str] = []
    cloud: List[str] = []
    database: List[str] = []
    tools: List[str] = []
    concepts: List[str] = []

class ResumeSchema(BaseModel):
    contact_info: ContactInfo
    skills: SkillSet
    summary: str = Field(description="2-sentence professional summary")
    