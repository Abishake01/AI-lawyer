import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
print("OpenAI API Key:", openai.api_key)
print("Google API Key:", os.getenv("GOOGLE_API_KEY"))

try:
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        prompt="What is 2 + 2?",
        max_tokens=10
    )
    print(response.choices[0].text.strip())
except Exception as e:
    print("❌ OpenAI Error:", e)
