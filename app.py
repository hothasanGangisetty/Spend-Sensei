from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import os
import PIL.Image
from io import BytesIO
import json
import random

# Initialize the Flask app
app = Flask(__name__)

# Disable caching for development
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# In-memory storage for the last receipt analysis context
last_analysis_context = None

# List of proven financial tips
financial_tips = [
    "Create a budget and stick to it. Knowing where your money goes is the first step to taking control.",
    "Pay yourself first. Automatically save a portion of your income every payday before you spend on anything else.",
    "Build an emergency fund. Aim to save at least 3-6 months of living expenses for unexpected events.",
    "Avoid lifestyle inflation. When you get a raise, increase your savings rate, don't just upgrade your lifestyle.",
    "Review your subscriptions. Cancel any services you don't use regularly to free up cash.",
    "Use the 30-day rule for large purchases. Wait 30 days before buying something non-essential to avoid impulse buys.",
    "Cook at home more often. Eating out is a major expense for many people, and cooking can save a lot.",
    "Set clear financial goals. Whether it's saving for a down payment or retirement, having a target keeps you motivated.",
    "Automate your savings and investments. It makes the process effortless and consistent.",
    "Negotiate your bills. Many service providers (like cable, internet, or phone) are willing to offer better deals if you ask."
]

# Configure the Gemini API key
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("Error: GOOGLE_API_KEY environment variable not set.")
    exit()


@app.route('/')
def index():
    """Renders the main upload page and clears previous context."""
    global last_analysis_context
    last_analysis_context = None # Reset context on page load
    random_tip = random.choice(financial_tips)
    return render_template('index.html', random_tip=random_tip)

@app.route('/analyze', methods=['POST'])
def analyze_receipt():
    """Analyzes the uploaded receipt image and returns structured JSON."""
    if 'receipt' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['receipt']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        try:
            img = PIL.Image.open(BytesIO(file.read()))

            model = genai.GenerativeModel('gemini-1.5-flash')

            prompt = """
            You are an expert AI expense analyst. Analyze the text from the provided receipt.
            Respond ONLY with a valid JSON object. Do not include any other text or markdown formatting.

            **Currency & Analysis Instructions:**
            1.  **Detect Dominant Currency:** Identify the main currency of the receipt (e.g., INR, USD, EUR). This will be the 'dominant currency'.
            2.  **Convert if Necessary:** If multiple currencies are present, convert all amounts to the dominant currency. Use your internal knowledge for conversion rates.
            3.  **Categorize Items:** Categorize each line item into one of the specified categories.
            4.  **Calculate Totals:** Calculate the total amount for each category and the overall total spend in the dominant currency.
            5.  **Provide Savings Tip:** Offer one actionable savings tip based on the items purchased.

            **JSON Output Structure:**
            The JSON object must have the following structure. The `currencySymbol` field is mandatory.
            {
              "summary": {
                "totalSpend": 0.00,
                "currencySymbol": "₹",
                "categorySpends": [
                  { "category": "Food", "amount": 0.00 },
                  { "category": "Personal Care", "amount": 0.00 },
                  { "category": "Household", "amount": 0.00 },
                  { "category": "Transportation", "amount": 0.00 },
                  { "category": "Apparel", "amount": 0.00 },
                  { "category": "Medical", "amount": 0.00 },
                  { "category": "Education", "amount": 0.00 },
                  { "category": "Banking", "amount": 0.00 },
                  { "category": "Entertainment", "amount": 0.00 },
                  { "category": "Cleanup and Maintanence", "amount": 0.00 },
                  { "category": "Other", "amount": 0.00 }
                ]
              },
              "lineItems": [
                { "item": "example", "category": "Other", "amount": 0.00 }
              ],
              "savingTip": "A simple, practical, and friendly savings tip based on the items purchased."
            }
            """

            response = model.generate_content([prompt, img])
            
            # Clean up the response to ensure it's valid JSON
            cleaned_text = response.text.strip().replace('```json', '').replace('```', '')
            json_response = json.loads(cleaned_text)
            
            # Store the context for follow-up questions
            global last_analysis_context
            last_analysis_context = json_response
            
            return jsonify(json_response)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    """Answers a follow-up question based on the last analyzed receipt."""
    global last_analysis_context
    if not last_analysis_context:
        return jsonify({'error': 'Please analyze a receipt first.'}), 400

    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({'error': 'No question provided.'}), 400

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')

        # Create a context-aware prompt
        currency_symbol = last_analysis_context.get('summary', {}).get('currencySymbol', '')
        prompt = f"""
        You are Spend Sensei, a friendly and insightful AI financial assistant created by Hothasan Gangisetty to help users track their expenses. Your personality is helpful, encouraging, and a little bit wise, like a sensei.
        When asked who you are or who made you, you should proudly state that you are Spend Sensei, created by Hothasan Gangisetty.

        Based on the following receipt data, answer the user's question. The user has already seen the summary and chart. Focus on providing a direct answer to their question using the line item details.
        When mentioning any monetary value, use the currency symbol: '{currency_symbol}'
        
        Receipt Data:
        {json.dumps(last_analysis_context, indent=2)}

        User's Question:
        {question}

        Answer:
        """

        response = model.generate_content(prompt)
        
        return jsonify({'answer': response.text.strip()})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
