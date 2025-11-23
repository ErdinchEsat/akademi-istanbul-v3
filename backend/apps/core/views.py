from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import ActivationCode
from .serializers import RegisterSerializer, UserSerializer, ActivationSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class MeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ActivateTenantView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = ActivationSerializer(data=request.data)
        if serializer.is_valid():
            code_str = serializer.validated_data['code']
            try:
                activation_code = ActivationCode.objects.get(code=code_str)
                
                if not activation_code.is_valid():
                    return Response({"error": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)

                # Assign tenant to user
                user = request.user
                user.tenant = activation_code.tenant
                user.save()

                # Decrement uses
                activation_code.uses_left -= 1
                activation_code.save()

                return Response({
                    "message": "Activation successful.",
                    "tenant": activation_code.tenant.name
                }, status=status.HTTP_200_OK)

            except ActivationCode.DoesNotExist:
                return Response({"error": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
