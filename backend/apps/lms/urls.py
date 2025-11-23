from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ProgressViewSet, StudioBookingViewSet, QuizViewSet, AttemptViewSet, CertificateViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'progress', ProgressViewSet, basename='progress')
router.register(r'bookings', StudioBookingViewSet, basename='booking')
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'attempts', AttemptViewSet, basename='attempt')
router.register(r'certificates', CertificateViewSet, basename='certificate')

urlpatterns = [
    path('', include(router.urls)),
]
