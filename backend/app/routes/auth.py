from fastapi import APIRouter, HTTPException, Depends

from datetime import timedelta

from app.models.auth_model import (
    SignupRequest,
    LoginRequest
)

from app.database.mongodb import users_col

from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

from app.config import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(body: SignupRequest):

    existing_user = users_col.find_one(
        {"email": body.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(
            body.password
        )
    }

    result = users_col.insert_one(user)

    token = create_access_token(
        {"sub": str(result.inserted_id)},
        timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": body.name,
            "email": body.email
        }
    }


@router.post("/login")
def login(body: LoginRequest):

    user = users_col.find_one(
        {"email": body.email}
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        body.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {"sub": str(user["_id"])},
        timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    """Verify token and return current user info.
    Used by the frontend on startup to validate a saved session."""
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"]
    }
