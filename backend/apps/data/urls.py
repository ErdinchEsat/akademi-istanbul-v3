from django.urls import path
from .views import DashboardStatsView, CareerMatchView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('career-match/', CareerMatchView.as_view(), name='career_match'),
]
