from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer, ActivationCodeSerializer
from .models import ActivationCode

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'me':
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'TENANT_ADMIN', 'INSTRUCTOR']:
            return User.objects.all()
        return User.objects.filter(id=user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ActivationCodeView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        code_str = request.data.get('code')
        try:
            code = ActivationCode.objects.get(code=code_str)
            if code.is_valid():
                return Response({
                    "valid": True, 
                    "tenant": code.tenant.name,
                    "expires_at": code.expires_at
                })
            return Response({"valid": False, "error": "Expired or used"}, status=status.HTTP_400_BAD_REQUEST)
        except ActivationCode.DoesNotExist:
            return Response({"valid": False, "error": "Invalid code"}, status=status.HTTP_404_NOT_FOUND)
