from rest_framework import serializers
from .models import Complaint


class ComplaintSerializer(serializers.ModelSerializer):
    # Read-only username shown in admin list
    username = serializers.SerializerMethodField()

    class Meta:
        model  = Complaint
        fields = '__all__'
        read_only_fields = ['user', 'status', 'admin_response', 'created_at']

    def get_username(self, obj):
        return obj.user.get_full_name() or obj.user.username