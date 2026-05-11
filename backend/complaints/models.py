from django.db import models
from django.conf import settings


class Complaint(models.Model):
    STATUS_CHOICES = (
        ('Pending',   'Pending'),
        ('In Review', 'In Review'),
        ('Resolved',  'Resolved'),
    )

    CATEGORY_CHOICES = (
        ('Service Quality', 'Service Quality'),
        ('Service Delay',   'Service Delay'),
        ('Billing Issue',   'Billing Issue'),
        ('Staff Behavior',  'Staff Behavior'),
        ('Other',           'Other'),
    )

    user           = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject        = models.CharField(max_length=200)
    message        = models.TextField()
    category       = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    service_id     = models.CharField(max_length=50, blank=True, null=True)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    admin_response = models.TextField(blank=True, null=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject