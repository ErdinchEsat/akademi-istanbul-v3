from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model
from apps.commerce.models import Order
from apps.lms.models import Course

User = get_user_model()

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Mock stats
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_revenue = sum(order.total_amount for order in Order.objects.filter(status='PAID'))
        active_courses = Course.objects.count()

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "active_courses": active_courses
        })

class CareerMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Mock career matching algorithm
        # In reality, this would use user's skills, course progress, and job market data
        user = request.user
        
        matches = [
            {"title": "Python Developer", "match_score": 95, "company": "Tech Corp"},
            {"title": "Backend Engineer", "match_score": 88, "company": "Startup Inc"},
            {"title": "Data Analyst", "match_score": 75, "company": "Data Co"},
        ]
        
        return Response(matches)
