from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import openai
from dotenv import load_dotenv
import os
import logging
from datetime import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AI services
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not GOOGLE_API_KEY or not OPENAI_API_KEY:
    raise Exception("API keys are missing in .env")

genai.configure(api_key=GOOGLE_API_KEY)
openai.api_key = OPENAI_API_KEY

LEGAL_CONTEXT = """You are an AI legal assistant specializing in Indian law..."""

def _build_cors_preflight_response():
    response = jsonify({'status': 'preflight'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
        
    try:
        data = request.json
        user_input = data.get('text', '').strip()
        
        if not user_input:
            return jsonify({'error': 'Empty input'}), 400

        # Try Gemini first
        try:
            model = genai.GenerativeModel("gemini-1.0-pro")  # Updated model name
            response = model.generate_content(user_input)
            return jsonify({
                'response': response.text,
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            logger.warning(f"Gemini failed: {str(e)}")
            # Fallback to OpenAI
            openai_response = generate_with_openai(user_input)
            return jsonify({
                'response': openai_response,
                'timestamp': datetime.now().isoformat(),
                'is_fallback': True
            })

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'error': 'Service unavailable',
            'response': 'I cannot provide a legal response at this time.',
            'is_fallback': True
        }), 500

def generate_with_openai(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": LEGAL_CONTEXT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        return response.choices[0].message['content']
    except Exception as e:
        logger.error(f"OpenAI error: {str(e)}")
        return "I cannot provide a legal response at this time. Please try again later."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)