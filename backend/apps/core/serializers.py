from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ActivationCode

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'tenant', 'is_active', 'last_login')
        read_only_fields = ('role', 'tenant', 'last_login')

class ActivationCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivationCode
        fields = ('code', 'tenant', 'expires_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    activation_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 'activation_code')

    def validate_activation_code(self, value):
        if not value:
            return None
        try:
            code = ActivationCode.objects.get(code=value)
            if not code.is_valid():
                raise serializers.ValidationError("Activation code is expired or used up.")
            return code
        except ActivationCode.DoesNotExist:
            raise serializers.ValidationError("Invalid activation code.")

    def create(self, validated_data):
        activation_code = validated_data.pop('activation_code', None)
        password = validated_data.pop('password')
        
        # Assign tenant
        if activation_code:
            validated_data['tenant'] = activation_code.tenant
            # Decrement uses
            activation_code.uses_left -= 1
            activation_code.save()
        else:
            # Assign to public tenant by default
            from .models import Client
            public_tenant = Client.objects.get(schema_name='public')
            validated_data['tenant'] = public_tenant
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        return user
