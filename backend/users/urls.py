from django.urls import path
from .views import register, login,profile
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('profile/', profile),
]
