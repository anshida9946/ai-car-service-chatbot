
from django.urls import path
from .views import create_booking, my_bookings, all_bookings, cancel_booking, booking_status, update_status

urlpatterns = [
    path('create/', create_booking),          # POST  — user creates booking
    path('my/', my_bookings),                 # GET   — user sees their bookings
    path('all/', all_bookings),               # GET   — admin sees ALL bookings
    path('cancel/<int:pk>/', cancel_booking), # DELETE — user cancels booking
    path('status/<int:pk>/', booking_status), # GET   — check one booking's status
    path('status/update/<int:pk>/', update_status),  # PUT — admin updates status
]