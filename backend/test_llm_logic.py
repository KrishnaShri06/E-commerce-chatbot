from llm import get_chatbot_response

print("Testing get_chatbot_response with dummy data...")
result = get_chatbot_response("Where is my order 123?")
print(f"Result: {result}")

if "response" in result and "frustration" in result:
    print("\nSUCCESS: LLM response contains required fields.")
else:
    print("\nFAILURE: LLM response is missing fields.")
