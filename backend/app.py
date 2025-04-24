from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
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
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

LEGAL_CONTEXT = """You are an AI legal assistant specializing in Indian law..."""

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
        if GOOGLE_API_KEY:
            try:
                # Try different model names
                for model_name in ["gemini-pro", "gemini-1.0-pro", "models/gemini-pro"]:
                    try:
                        model = genai.GenerativeModel(model_name)
                        response = model.generate_content(
                            f"{LEGAL_CONTEXT}\n\nQuestion: {user_input}\nAnswer:"
                        )
                        return jsonify({
                            'response': response.text,
                            'timestamp': datetime.now().isoformat()
                        })
                    except Exception as e:
                        logger.warning(f"Gemini model {model_name} failed: {str(e)}")
                        continue
            except Exception as e:
                logger.error(f"All Gemini attempts failed: {str(e)}")

        # Final fallback
        return jsonify({
            'response': get_fallback_response(user_input),
            'timestamp': datetime.now().isoformat(),
            'is_fallback': True
        })

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'response': get_fallback_response(),
            'is_fallback': True
        }), 500

def get_fallback_response(question=None):
    base = "I cannot access legal resources right now. For official Indian legal advice:\n\n"
    resources = [
        "• National Legal Services Authority: https://nalsa.gov.in",
        "• State Legal Services Authority",
        "• Consult a licensed attorney"
    ]
    if question:
        return f"{base}Regarding '{question}', please contact:\n{'\n'.join(resources)}"
    return f"{base}Please contact:\n{'\n'.join(resources)}"

def _build_cors_preflight_response():
    response = jsonify({'status': 'preflight'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)