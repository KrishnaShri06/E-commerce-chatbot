# AI-Powered Customer Support Chatbot Demo

This is a terminal-based AI chatbot for e-commerce, integrated with Supabase and Gemini LLM.

## Setup Instructions

1.  **Environment Variables**: Update `config.py` with your Supabase credentials and LLM API Key.
2.  **Dependencies**: Install the required libraries using pip:
    ```bash
    pip install -r requirements.txt
    ```
## Supabase SQL Schema (User Provided)

```sql
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Processing', -- Processing, Shipped, Delivered, Delayed
  delivery_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE refunds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'Pending', -- Pending, Approved, Processed, Rejected
  amount NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## Running the Bot

### Terminal Version
```bash
python main.py
```

### Web UI Version
1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Open your browser and go to: `http://127.0.0.1:5000`

## Interaction Examples
- "What is the status of my order 2bf128fa-0e44-4d63-9811-a2df63b19a24?"
- "Where is my package?" (Bot will ask for ID)
- "This is taking way too long!" (Triggers escalation UI)
