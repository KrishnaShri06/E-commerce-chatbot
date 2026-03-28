import re
from db import get_order_by_id, get_refund_by_order
from llm import get_chatbot_response

def extract_order_id(text: str):
    """
    Very basic order ID extraction. Assumes UUID format or similar.
    Adjust as needed based on the actual Supabase data.
    """
    # Look for UUID-like pattern or general hex-dash patterns
    match = re.search(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', text, re.I)
    if match:
        return match.group()
    return None

def main():
    print("=== AI Support Bot (E-Commerce) ===")
    print("Hello! I'm here to help with your orders and refunds.")
    print("Type 'exit' to end the chat.\n")

    current_order_id = None

    while True:
        user_input = input("You: ").strip()
        
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("Chatbot: Goodbye! Have a great day.")
            break
        
        if not user_input:
            continue

        # Check for intent: Order/Refund tracking
        is_order_query = any(word in user_input.lower() for word in ["order", "track", "package", "where", "status"])
        is_refund_query = any(word in user_input.lower() for word in ["refund", "money return", "cancel"])

        if is_order_query or is_refund_query:
            # Try to find an order ID
            found_id = extract_order_id(user_input)
            if found_id:
                current_order_id = found_id
            
            if not current_order_id:
                # Ask the LLM to handle asking for an order ID politely
                llm_data = get_chatbot_response(user_input)
            else:
                # Fetch data from Supabase
                order_info = get_order_by_id(current_order_id)
                refund_info = get_refund_by_order(current_order_id) if is_refund_query else None
                
                # Handle gracefully if no order is found
                if not order_info:
                    llm_data = get_chatbot_response(user_input + f" (Note: Order ID {current_order_id} not found in database.)")
                else:
                    llm_data = get_chatbot_response(user_input, order_info, refund_info)
        else:
            # General query
            llm_data = get_chatbot_response(user_input)

        # Output response
        print(f"\nChatbot: {llm_data.get('response', 'I am sorry, I am unable to process that at the moment.')}")
        
        # Frustration Score and Escalation
        frustration = llm_data.get('frustration', 0)
        # print(f"(DEBUG: Frustration: {frustration})")
        
        if frustration > 70:
            print("\n[SYSTEM]: I understand your frustration. Connecting you to human support...")
            break

if __name__ == "__main__":
    main()
