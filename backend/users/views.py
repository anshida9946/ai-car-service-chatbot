from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, ProfileSerializer, RegisterSerializer

User = get_user_model()


# ===============================
# CUSTOM PERMISSIONS
# ===============================
class IsAdmin(BasePermission):
    """Permission to check if user is admin"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


# ===============================
# REGISTER
# ===============================
@api_view(['POST'])
def register(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# LOGIN
# ===============================
@api_view(['POST'])
def login(request):
    """Login user and return tokens"""
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "is_admin": user.is_staff
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


# ===============================
# PROFILE (GET, PUT, PATCH)
# ===============================
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update user profile"""
    user = request.user
    
    if request.method == 'GET':
        serializer = ProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = ProfileSerializer(user, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# ADMIN ENDPOINTS
# ===============================

@api_view(['GET', 'POST'])
@permission_classes([IsAdmin])
def admin_users(request):
    """Get all users (GET) or create user as admin (POST)"""
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({
            "message": "Users retrieved successfully",
            "count": users.count(),
            "users": serializer.data
        }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully by admin",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_user_detail(request, user_id):
    """Get, update, or delete a specific user (admin only)"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = ProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = ProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User updated successfully",
                "user": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([IsAdmin])
def admin_make_admin(request, user_id):
    """Make a user an admin"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user.is_staff = True
    user.is_superuser = True
    user.save()
    
    return Response({
        "message": f"User {user.username} is now an admin",
        "user": UserSerializer(user).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAdmin])
def admin_remove_admin(request, user_id):
    """Remove admin status from a user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user.is_staff = False
    user.is_superuser = False
    user.save()
    
    return Response({
        "message": f"Admin status removed from {user.username}",
        "user": UserSerializer(user).data
    }, status=status.HTTP_200_OK)
