from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from app.database.mongodb import timers_col
from app.models.timer_model import (
    TimerCreate,
    TimerUpdate
)
from app.utils.security import get_current_user

router = APIRouter(
    prefix="/timers",
    tags=["Timers"]
)


@router.get("/")
def get_timers(
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    timers = list(
        timers_col.find(
            {"user_id": user_id}
        )
    )

    result = []

    for timer in timers:
        result.append(
            {
                "id": str(timer["_id"]),
                "name": timer["name"],
                "total_seconds": timer["total_seconds"],
                "remaining_seconds": timer["remaining_seconds"],
                "running": timer["running"]
            }
        )

    return result


@router.post("/")
def create_timer(
    body: TimerCreate,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    timer = {
        "user_id": user_id,
        "name": body.name,
        "total_seconds": body.total_seconds,
        "remaining_seconds": body.total_seconds,
        "running": False,
        "created_at": datetime.utcnow()
    }

    result = timers_col.insert_one(
        timer
    )

    return {
        "id": str(result.inserted_id),
        "name": body.name,
        "total_seconds": body.total_seconds,
        "remaining_seconds": body.total_seconds,
        "running": False
    }


@router.put("/{timer_id}")
def update_timer(
    timer_id: str,
    body: TimerUpdate,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    try:
        object_id = ObjectId(
            timer_id
        )
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid timer id"
        )

    result = timers_col.update_one(
        {
            "_id": object_id,
            "user_id": user_id
        },
        {
            "$set": {
                "remaining_seconds": body.remaining_seconds,
                "running": body.running
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Timer not found"
        )

    return {
        "message": "Timer updated"
    }


@router.delete("/{timer_id}")
def delete_timer(
    timer_id: str,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    try:
        object_id = ObjectId(
            timer_id
        )
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid timer id"
        )

    result = timers_col.delete_one(
        {
            "_id": object_id,
            "user_id": user_id
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Timer not found"
        )

    return {
        "message": "Timer deleted"
    }