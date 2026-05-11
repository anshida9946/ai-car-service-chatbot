from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Booking(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('In Service', 'In Service'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    car_model = models.CharField(max_length=100)
    vehicle_number = models.CharField(max_length=50)
    service_type = models.CharField(max_length=100)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name