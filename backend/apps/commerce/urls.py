from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet, PaymentCallbackView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment_callback'),
]
