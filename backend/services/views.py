from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Service
from .serializers import ServiceSerializer


# ✅ GET ACTIVE
@api_view(['GET'])
def get_services(request):
    services = Service.objects.filter(status='Active').order_by('-id')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


# ✅ ADMIN GET ALL
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_services_admin(request):
    services = Service.objects.all().order_by('-id')
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


# ✅ ADD
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_service(request):
    serializer = ServiceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Service added successfully",
            "data": serializer.data
        }, status=201)

    return Response(serializer.errors, status=400)


# ✅ UPDATE
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_service(request, pk):
    try:
        service = Service.objects.get(id=pk)
    except Service.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    serializer = ServiceSerializer(service, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Updated", "data": serializer.data})

    return Response(serializer.errors, status=400)


# ✅ DELETE
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_service(request, pk):
    try:
        service = Service.objects.get(id=pk)
        service.delete()
        return Response({"message": "Deleted"})
    except Service.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


# ✅ TOGGLE POPULAR
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_popular(request, pk):
    try:
        service = Service.objects.get(id=pk)
    except Service.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    service.is_popular = not service.is_popular
    service.save()

    return Response({
        "message": "Toggled",
        "is_popular": service.is_popular
    })