from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-pro")

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get('text', '').strip()
        history = data.get('history', [])
        
        if not user_input:
            return jsonify({'error': 'Empty input'}), 400

        # Build conversation context
        context = "You are an AI legal assistant specializing in Indian law. Provide accurate, clear legal information."
        conversation = [{'role': 'user', 'parts': [context]}]
        
        # Add history if available
        for msg in history[-6:]:  # Limit history to last 6 messages
            role = 'user' if msg['sender'] == 'user' else 'model'
            conversation.append({'role': role, 'parts': [msg['text']]})
        
        # Add current message
        conversation.append({'role': 'user', 'parts': [user_input]})
        
        # Generate response
        response = model.generate_content(conversation)
        
        return jsonify({
            'response': response.text,
            'timestamp': datetime.now().isoformat(),
            'sources': ['Indian Penal Code', 'Constitution of India']  # Example legal references
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'response': "I'm unable to provide a legal response at this time. Please try again later.",
            'is_fallback': True
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)