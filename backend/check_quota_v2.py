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

# Try the ones that were actually in the LIST
test_model("gemini-flash-latest")
test_model("gemini-pro-latest")
test_model("gemini-2.0-flash-lite")
