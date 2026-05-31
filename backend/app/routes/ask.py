from fastapi import APIRouter, Depends, HTTPException

from app.models.ask_model import AskRequest
from app.services.embedding_service import retrieve_chunks
from app.services.gemini_service import generate
from app.utils.security import get_current_user

router = APIRouter(tags=["Ask"])

# Gemini 2.5 Flash has a large context window, but keep prompts reasonable
MAX_CONTEXT_CHARS = 200_000


@router.post("/ask")
async def ask(
    body: AskRequest,
    current_user=Depends(get_current_user)
):
    user_id = str(current_user["_id"])

    chunks = retrieve_chunks(user_id=user_id, question=body.question)

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No PDF content found. Please upload a PDF first."
        )

    context = "\n\n".join(chunks)

    # Trim if the PDF is very large
    if len(context) > MAX_CONTEXT_CHARS:
        context = context[:MAX_CONTEXT_CHARS]

    prompt = f"""You are an expert AI exam preparation assistant. Your goal is to provide concise, accurate, and highly structured answers tailored for competitive exams.

Use the provided PDF content as your primary source to answer the question.

[PDF Content]
{context}

[Question]
{body.question}

Guidelines & Formatting Rules:
1. Source Hierarchy: Attempt to answer the question using the PDF content first. If the required information is not found in the PDF, use your own advanced knowledge base to provide the correct answer. Do not say "not found in the PDF"; simply provide the answer and note that it is from external verified sources if necessary.
2. Tone & Structure: Deliver the response in a clear, pointwise format. Do not use emojis, conversational filler, or irrelevant background information.
3. Subject-Specific Instructions:
   - Mathematics: Provide the solution using two distinct methods. First, show the "Shortcut/Trick Method" for quick exam solving. Second, show the "Detailed/Proper Method" with full step-by-step working.
   - English: Provide the correct answer along with relevant grammatical rules and synonyms. Crucially, highlight any linguistic exceptions or trap rules linked to the question concept.
   - Reasoning: Break down the logical derivation step by step using crisp bullet points.
   - Current Affairs: If the question pertains to a recent event, provide up-to-date, exam-oriented data (confined to developments within the past 1 year). Include precise facts, figures, statutory bodies, or schemes involved."""

    answer = generate(prompt)

    return {"answer": answer}
