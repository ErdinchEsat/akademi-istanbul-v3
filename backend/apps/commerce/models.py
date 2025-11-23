from django.db import models
from django.conf import settings
from apps.core.models import Client
from apps.lms.models import Course

class Product(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='product')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='TRY')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.price} {self.currency}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    tenant = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_id = models.CharField(max_length=100, blank=True, null=True) # Payment provider ID
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at the time of purchase

    def __str__(self):
        return f"{self.order.id} - {self.product.course.title}"

class Payment(models.Model):
    STATUS_CHOICES = (
        ('SUCCESS', 'Success'),
        ('FAILURE', 'Failure'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    transaction_id = models.CharField(max_length=100, unique=True)
    provider = models.CharField(max_length=50, default='Iyzico')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    raw_response = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"
