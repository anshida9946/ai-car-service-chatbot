from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Complaint
from .serializers import ComplaintSerializer


# USER: submit a new complaint
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_complaint(request):
    serializer = ComplaintSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# USER: view their own complaints (includes admin_response)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_complaints(request):
    complaints = Complaint.objects.filter(user=request.user).order_by('-created_at')
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)


# USER: delete their own complaint
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_complaint(request, id):
    try:
        complaint = Complaint.objects.get(id=id, user=request.user)
        complaint.delete()
        return Response({"message": "Complaint deleted"})
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)


# ADMIN: view ALL complaints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_complaints(request):
    complaints = Complaint.objects.all().order_by('-created_at')
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)


# ADMIN: update status of a complaint (Mark In Review)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_complaint_status(request, id):
    try:
        complaint = Complaint.objects.get(id=id)
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    valid = [c[0] for c in Complaint.STATUS_CHOICES]
    if new_status not in valid:
        return Response({"error": f"Invalid status. Must be one of: {valid}"}, status=status.HTTP_400_BAD_REQUEST)

    complaint.status = new_status
    complaint.save()
    return Response(ComplaintSerializer(complaint).data)


# ADMIN: send response and resolve complaint
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def respond_complaint(request, id):
    try:
        complaint = Complaint.objects.get(id=id)
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)

    response_text = request.data.get('admin_response', '').strip()
    if not response_text:
        return Response({"error": "Response text is required"}, status=status.HTTP_400_BAD_REQUEST)

    complaint.admin_response = response_text
    complaint.status = 'Resolved'
    complaint.save()
    return Response(ComplaintSerializer(complaint).data)