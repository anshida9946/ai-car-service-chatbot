from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'address', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_admin = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'phone', 'address', 'is_admin']

    def create(self, validated_data):
        is_admin = validated_data.pop('is_admin', False)

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email'),
            phone=validated_data.get('phone'),
            address=validated_data.get('address')
        )

        # Make admin if needed
        if is_admin:
            user.is_staff = True
            user.is_superuser = True
            user.save()

        return user
