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

# Legal context for more accurate responses
LEGAL_CONTEXT = """
You are an AI legal assistant specializing in Indian law. You provide accurate, 
clear legal information based on current Indian statutes and precedents.

Rules:
1. Only answer questions related to Indian law
2. If a question is outside Indian law, explain this limitation
3. Clarify when information is state-specific
4. Never provide personal legal advice - always recommend consulting a lawyer
5. Cite relevant laws when possible (IPC, CrPC, Constitution, etc.)
6. Maintain neutral, professional tone
7. For complex matters, suggest consulting a human lawyer
8. Disclose when you're uncertain about an answer

Example:
Question: Can I record police officers in India?
Answer: In India, you can record police officers in public spaces as there is no law prohibiting this. However:
- Article 19(1)(a) of the Constitution protects freedom of speech
- Section 66A of IT Act was struck down by Supreme Court (Shreya Singhal case)
- Do not interfere with police duties while recording
- Private spaces may have different rules
For specific situations, consult a lawyer.
"""

@app.route("/api/chat", methods=["POST"])
def chat():
    start_time = datetime.now()
    try:
        data = request.json
        user_input = data.get("text", "").strip()
        conversation_history = data.get("history", [])
        
        if not user_input:
            return jsonify({"error": "Please enter your legal question"}), 400

        # Format conversation history
        history_text = "\n".join(
            [f"{msg['sender']}: {msg['text']}" for msg in conversation_history[-4:]]
        ) if conversation_history else "No previous conversation"

        # Try Gemini first, fallback to OpenAI
        try:
            response = generate_with_gemini(user_input, history_text)
        except Exception as e:
            logger.warning(f"Gemini failed, trying OpenAI: {str(e)}")
            response = generate_with_openai(user_input, history_text)

        # Log the interaction
        duration = (datetime.now() - start_time).total_seconds()
        logger.info(
            f"Processed query in {duration:.2f}s | "
            f"Input: {user_input[:50]}... | "
            f"Response: {response[:50]}..."
        )

        return jsonify({
            "response": response,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": "Our legal assistant is currently unavailable. Please try again later.",
            "details": str(e)
        }), 500

def generate_with_gemini(user_input, history):
    model = genai.GenerativeModel("gemini-pro")
    prompt = f"{LEGAL_CONTEXT}\n\nConversation History:\n{history}\n\nNew Question: {user_input}\nAnswer:"
    
    # Add safety settings for legal context
    safety_settings = {
        'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
        'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
        'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
        'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE'
    }
    
    response = model.generate_content(
        prompt,
        safety_settings=safety_settings,
        generation_config={
            "max_output_tokens": 1000,
            "temperature": 0.3  # Lower for more factual responses
        }
    )
    return response.text

def generate_with_openai(user_input, history):
    prompt = f"{LEGAL_CONTEXT}\n\nPrevious conversation:\n{history}\n\nQuestion: {user_input}\nAnswer:"
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": LEGAL_CONTEXT},
            *[
                {"role": "user" if msg.startswith("user:") else "assistant", 
                 "content": msg.split(":", 1)[1].strip()}
                for msg in history.split("\n") if msg
            ],
            {"role": "user", "content": user_input}
        ],
        temperature=0.3,
        max_tokens=1000
    )
    return response.choices[0].message['content']

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)