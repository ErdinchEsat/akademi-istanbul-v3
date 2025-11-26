from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, UserViewSet, ActivationCodeView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('activation/validate/', ActivationCodeView.as_view(), name='validate_activation'),
    path('', include(router.urls)),
]
