from google import genai
from config import LLM_API_KEY

client = genai.Client(api_key=LLM_API_KEY)

def test_model(model_name):
    print(f"Testing {model_name}...")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="test"
        )
        print(f"SUCCESS: {model_name} is working.")
        return True
    except Exception as e:
        print(f"FAILED: {model_name} error: {e}")
        return False

# Try common free tier models
test_model("gemini-1.5-flash")
test_model("gemini-1.5-flash-8b")
test_model("gemini-1.5-pro")
