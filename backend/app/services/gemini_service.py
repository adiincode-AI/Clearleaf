from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

GENERATION_MODEL = "gemini-2.5-flash"


def generate(prompt: str) -> str:
    """Generate text from a prompt using Gemini."""
    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=prompt,
    )
    return response.text
