from google import genai
from config import LLM_API_KEY

client = genai.Client(api_key=LLM_API_KEY)

print("Checking available models with the NEW SDK...")
try:
    for m in client.models.list():
        print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")
