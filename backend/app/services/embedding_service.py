from app.database.mongodb import pdfs_col


def split_text(text: str, chunk_size: int = 1000, overlap: int = 200):
    """Kept for compatibility — not used when embeddings are disabled."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def get_embedding(text: str):
    """Embeddings disabled — returns empty list."""
    return []


def retrieve_chunks(user_id: str, question: str, top_k: int = 5):
    """No vector search — returns the full PDF text stored at upload time."""
    doc = pdfs_col.find_one({"user_id": user_id})
    if not doc or not doc.get("full_text"):
        return []
    # Return as a single chunk; ask.py joins with \n\n
    return [doc["full_text"]]
