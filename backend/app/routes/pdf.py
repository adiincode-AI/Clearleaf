from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from datetime import datetime
import os
import shutil

from app.config import UPLOAD_DIR
from app.utils.security import get_current_user
from app.database.mongodb import pdfs_col, pdf_chunks_col
from app.utils.pdf_utils import extract_pdf_text

router = APIRouter(tags=["PDF"])


@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    user_id = str(current_user["_id"])

    user_folder = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_folder, exist_ok=True)

    file_path = os.path.join(user_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    pdf_text = extract_pdf_text(file_path)

    if not pdf_text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in PDF")

    # Clear old chunks (kept for schema compatibility)
    pdf_chunks_col.delete_many({"user_id": user_id})

    # Store full text so ask endpoint can use it directly
    pdfs_col.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "filename": file.filename,
                "path": file_path,
                "full_text": pdf_text,
                "uploaded_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )

    return {
        "message": "PDF uploaded and processed successfully",
        "filename": file.filename,
    }
