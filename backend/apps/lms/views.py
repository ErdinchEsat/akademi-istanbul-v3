from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Course, LessonProgress, StudioBooking, Lesson, Quiz, Attempt, Certificate
from .serializers import CourseSerializer, LessonProgressSerializer, StudioBookingSerializer, QuizSerializer, AttemptSerializer, CertificateSerializer

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter by current tenant
        # Assuming request.tenant is set by middleware (django-tenants)
        # For now, we'll return all courses as we are in public schema or tenant schema context
        return Course.objects.all()

class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        lesson_id = request.data.get('lesson_id')
        progress = request.data.get('progress_percentage')
        position = request.data.get('last_watched_position')
        
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        
        obj, created = LessonProgress.objects.update_or_create(
            user=request.user,
            lesson=lesson,
            defaults={
                'progress_percentage': progress,
                'last_watched_position': position,
                'is_completed': progress >= 90 # Auto complete if > 90%
            }
        )
        return Response(LessonProgressSerializer(obj).data)

class StudioBookingViewSet(viewsets.ModelViewSet):
    serializer_class = StudioBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudioBooking.objects.filter(tenant=self.request.tenant)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user, tenant=self.request.tenant)

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Assuming quizzes are linked to courses which are linked to tenants
        # For simplicity, returning all quizzes for now
        return Quiz.objects.all()

class AttemptViewSet(viewsets.ModelViewSet):
    serializer_class = AttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attempt.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        quiz = serializer.validated_data['quiz']
        # Simple scoring logic: calculate score based on answers (mocked here)
        # In a real app, answers would be sent in request.data and compared with Question.correct_answer
        score = 80 # Mock score
        passed = score >= quiz.passing_score
        
        serializer.save(user=self.request.user, score=score, passed=passed)

        if passed:
            # Check if all quizzes in the course are passed, then generate certificate
            # For simplicity, let's assume this quiz completes the course
            # In reality, we'd check course completion logic
            # Trigger certificate generation
            # We need course_id here, assuming quiz is linked to a course (which it isn't directly in my model yet, but let's assume logic exists)
            pass 

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(user=self.request.user)
