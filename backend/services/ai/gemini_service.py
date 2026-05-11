from google import genai
import os
import time
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)


def generate_gemini_response(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        if response and hasattr(response, "text") and response.text:
            return response.text.strip()

        return "⚠️ No response generated."

    except Exception as e:
        print("❌ Gemini Error:", str(e))

        # 🔁 RETRY ONCE (VERY IMPORTANT)
        try:
            print("🔁 Retrying Gemini...")
            time.sleep(2)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            if response and hasattr(response, "text") and response.text:
                return response.text.strip()

        except Exception as retry_error:
            print("❌ Retry Failed:", str(retry_error))

        # ⚠️ HANDLE 503 / 429
        if "503" in str(e) or "UNAVAILABLE" in str(e):
            return "⚠️ AI is busy right now. Please try again in a few seconds."

        if "429" in str(e):
            return "⚠️ Too many requests. Please wait and try again."

        return "⚠️ AI service error. Please try again."