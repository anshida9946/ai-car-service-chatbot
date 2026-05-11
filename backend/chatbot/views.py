from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.ai.gemini_service import generate_gemini_response


@api_view(['POST'])
def chatbot_response(request):
    message = request.data.get("message", "")

    if not message:
        return Response({"reply": "Please enter a message."})

    reply = generate_gemini_response(message)

    return Response({"reply": reply})