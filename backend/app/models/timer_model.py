from pydantic import BaseModel


class TimerCreate(BaseModel):
    name: str
    total_seconds: int


class TimerUpdate(BaseModel):
    remaining_seconds: int
    running: bool