from rest_framework import serializers
from .models import Product, Order, OrderItem, Payment

class ProductSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_image = serializers.ImageField(source='course.image', read_only=True)
    instructor_name = serializers.CharField(source='course.instructor.get_full_name', read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'course', 'course_title', 'course_image', 'instructor_name', 'price', 'currency')

class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.course.title', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_title', 'price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'total_amount', 'status', 'created_at', 'items')
        read_only_fields = ('total_amount', 'status', 'created_at')

class CreateOrderSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
