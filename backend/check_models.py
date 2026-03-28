import google.generativeai as genai
from config import LLM_API_KEY

genai.configure(api_key=LLM_API_KEY)

print("Checking available models for your API Key...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
