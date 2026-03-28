from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_order_by_id(order_id: str):
    """
    Fetch order details by ID from Supabase 'orders' table.
    """
    try:
        response = supabase.table("orders").select("*").eq("id", order_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching order: {e}")
        return None

def get_refund_by_order(order_id: str):
    """
    Fetch refund details for a specific order by order_id from 'refunds' table.
    """
    try:
        response = supabase.table("refunds").select("*").eq("order_id", order_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error fetching refund: {e}")
        return None
