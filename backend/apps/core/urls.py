from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, ActivateTenantView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('activate/', ActivateTenantView.as_view(), name='auth_activate'),
    path('me/', MeView.as_view(), name='auth_me'),
]
