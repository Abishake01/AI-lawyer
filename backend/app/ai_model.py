from transformers import pipeline

class LegalAI:
    def __init__(self):
        self.generator = pipeline("text-generation", model="gpt2")
    
    async def process_query(self, user_input: str) -> str:
        indian_context = (
            "You are a legal assistant specializing in Indian laws like IPC, CrPC, RTI Act, Indian Constitution, and other Indian legal acts.\n"
            f"Question: {user_input}\n"
            "Answer:"
        )
        result = self.generator(indian_context, max_length=250, temperature=0.7, do_sample=True)
        return result[0]["generated_text"].split("Answer:")[-1].strip()
