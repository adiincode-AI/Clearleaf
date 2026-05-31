from pymongo import MongoClient
from app.config import MONGO_URL

if not MONGO_URL:
    raise Exception("MONGO_URL not found in environment variables")

client = MongoClient(MONGO_URL)

# Test connection
client.admin.command("ping")

db = client["clearleaf"]

users_col = db["users"]
pdfs_col = db["pdfs"]
pdf_chunks_col = db["pdf_chunks"]
timers_col = db["timers"]