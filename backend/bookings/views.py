from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Booking
from .serializers import BookingSerializer


# CREATE BOOKING
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# MY BOOKINGS (user sees only their own)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ALL BOOKINGS (admin sees every user's bookings)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_bookings(request):
    bookings = Booking.objects.all().order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# CANCEL BOOKING
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_booking(request, pk):
    try:
        booking = Booking.objects.get(id=pk, user=request.user)
        booking.delete()
        return Response({"message": "Booking cancelled"})
    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# CHECK STATUS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_status(request, pk):
    try:
        booking = Booking.objects.get(id=pk, user=request.user)
        return Response({
            "booking_id": booking.id,
            "status": booking.status
        })
    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )


# ADMIN UPDATE STATUS
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_status(request, pk):
    try:
        booking = Booking.objects.get(id=pk)
    except Booking.DoesNotExist:
        return Response(
            {"error": "Booking not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get("status")

    valid_statuses = [choice[0] for choice in Booking.STATUS_CHOICES]

    if new_status not in valid_statuses:
        return Response(
            {"error": f"Invalid status. Must be one of: {valid_statuses}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = new_status
    booking.save()

    return Response({
        "message": "Status updated",
        "status": booking.status
    })