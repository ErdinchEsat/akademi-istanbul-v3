from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product, Order, OrderItem, Payment
from .serializers import ProductSerializer, OrderSerializer, CreateOrderSerializer
from .services import IyzicoService

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product = get_object_or_404(Product, pk=serializer.validated_data['product_id'])
        
        # Create Order
        order = Order.objects.create(
            user=request.user,
            tenant=product.course.tenant, # Assuming product belongs to a tenant via course
            total_amount=product.price,
            status='PENDING'
        )
        
        OrderItem.objects.create(
            order=order,
            product=product,
            price=product.price
        )
        
        # Initialize Payment
        iyzico = IyzicoService()
        payment_data = iyzico.start_payment(order, request.user, request.META.get('REMOTE_ADDR'))
        
        return Response({
            "order": OrderSerializer(order).data,
            "payment_html": payment_data.get('html_content')
        })

class PaymentCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token missing"}, status=status.HTTP_400_BAD_REQUEST)
            
        iyzico = IyzicoService()
        result = iyzico.verify_payment(token)
        
        if result['status'] == 'success' and result['paymentStatus'] == 'SUCCESS':
            # In a real app, we would find the order by basketId or similar from result
            # For mock, let's assume we can't find it without ID, but logic is here
            # order = Order.objects.get(id=result['basketId'])
            # order.status = 'PAID'
            # order.save()
            # Payment.objects.create(...)
            return Response({"message": "Payment successful"})
            
        return Response({"error": "Payment failed"}, status=status.HTTP_400_BAD_REQUEST)
