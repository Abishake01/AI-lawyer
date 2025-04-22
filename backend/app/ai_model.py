from transformers import pipeline

class LegalAI:
    def __init__(self):
        self.generator = pipeline("text-generation", model="gpt2")
    
    async def process_query(self, user_input: str) -> str:
        indian_context = (
    "You are a legal expert on Indian laws. Respond clearly, based on Indian law only.\n"
    "Question: I am under 18. Can I drive a bike?\n"
    "Answer: No, according to Indian law, a person must be at least 18 years old to legally drive a motorcycle with gear. For gearless scooters under 50cc, the legal age is 16 with a valid license.\n\n"
    f"Question: {user_input}\n"
    "Answer:"

        )
        result = self.generator(indian_context, max_length=250, temperature=0.7, do_sample=True)
        return result[0]["generated_text"].split("Answer:")[-1].strip()
