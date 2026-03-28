from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from db import get_order_by_id, get_refund_by_order
from llm import get_chatbot_response
import config

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

# Simple in-memory session to track order context
user_sessions = {}

def extract_order_id(text: str):
    # Match UUID format
    match = re.search(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', text, re.I)
    if match:
        return match.group()
    return None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    session_id = data.get('session_id', 'default')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Retrieve context
    current_order_id = user_sessions.get(session_id)

    # Detect intent
    message_lower = user_message.lower()
    is_order_query = any(word in message_lower for word in ["order", "track", "package", "where", "status", "delivery"])
    is_refund_query = any(word in message_lower for word in ["refund", "money return", "cancel", "money back"])

    if is_order_query or is_refund_query:
        found_id = extract_order_id(user_message)
        if found_id:
            current_order_id = found_id
            user_sessions[session_id] = found_id
        
        if not current_order_id:
            # If no ID, let the LLM prompt for it
            llm_data = get_chatbot_response(user_message)
        else:
            # Fetch data from Supabase
            order_info = get_order_by_id(current_order_id)
            refund_info = get_refund_by_order(current_order_id) if is_refund_query else None
            
            if not order_info:
                # Tell the LLM that the order wasn't found so it can respond appropriately
                llm_data = get_chatbot_response(user_message + f" (Note: Order ID {current_order_id} not found.)")
            else:
                llm_data = get_chatbot_response(user_message, order_info, refund_info)
    else:
        # General query
        llm_data = get_chatbot_response(user_message)

    # Escalation Logic: If frustration is high, signal frontend to connect to human
    frustration = llm_data.get('frustration', 0)
    llm_data['escalated'] = frustration > 70

    if llm_data['escalated']:
        llm_data['response'] = llm_data['response'] + "\n\n[SYSTEM]: I perceive you are quite concerned. I am initiating a transfer to a human support agent who can assist you further."

    return jsonify(llm_data)

if __name__ == '__main__':
    print(f"Starting server on port {config.PORT}...")
    app.run(debug=config.DEBUG, port=config.PORT)
