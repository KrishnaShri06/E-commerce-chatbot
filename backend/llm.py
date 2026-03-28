from groq import Groq
import json
import re
from config import GROQ_API_KEY

# Initialize the Groq Client
client = Groq(api_key=GROQ_API_KEY)

def get_chatbot_response(user_message: str, order_info: dict = None, refund_info: dict = None):
    """
    GROQ LLM: Calls Llama 3 on Groq to generate a dynamic response and frustration score.
    Returns the RAW API error if anything fails.
    """
    
    # Construct context
    context = ""
    if order_info:
        context += f"Order ID: {order_info.get('id')}\n"
        context += f"Order Status: {order_info.get('status')}\n"
        context += f"Delivery Date: {order_info.get('delivery_date')}\n"
    
    if refund_info:
        context += f"Refund Status: {refund_info.get('status')}\n"
        context += f"Refund Amount: {refund_info.get('amount')}\n"

    system_prompt = f"""
    You are a friendly and intelligent e-commerce customer support chatbot for 'ShopKart'.
    Your goal is to help users with their orders and general questions.
    
    Relevant Data for this session:
    {context if context else "No specific order data provided yet."}
    
    Rules:
    1. Respond politely and human-like. 
    2. Vary your responses so they don't seem robotic.
    3. If order data is present, use it to provide specific information.
    4. If no order data is present but the user is asking about an order, politely ask for their Order ID.
    5. Always detect the user's frustration level (0-100).
    6. ALWAYS respond in valid JSON format.
    
    Output Format (JSON):
    {{
      "response": "Your customer support reply here",
      "frustration": score_number
    }}
    """
    
    try:
        # Call Groq (Llama 3.3 70B for high quality)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"} # Groq supports JSON mode
        )
        
        # Parse the JSON response
        response_content = completion.choices[0].message.content
        data = json.loads(response_content)
        return data
            
    except Exception as e:
        # Log to file for developer but return error to user
        import traceback
        with open("error.log", "a") as f:
            f.write(f"--- GROQ API ERROR ---\n{traceback.format_exc()}\n")
        
        return {
            "response": f"GROQ API ERROR: {str(e)}",
            "frustration": 0
        }
