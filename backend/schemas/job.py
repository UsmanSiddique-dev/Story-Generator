
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class StoryJobBase(BaseModel):
    theme:str


class StoryJobResposne(StoryJobBase):
    job_id :str
    status:str
    story_id:Optional[int]=None
    completed_at:Optional[datetime]=None
    error:Optional[str]=None
    created_at:datetime

    class Config:
        from_attributes=True


class StoryJobCreate(StoryJobBase):
    pass        