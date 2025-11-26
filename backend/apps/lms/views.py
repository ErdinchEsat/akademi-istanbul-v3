from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models
from .models import Category, Course, Module, Lesson
from .serializers import CategorySerializer, CourseSerializer, ModuleSerializer, LessonSerializer, LessonPolymorphicSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent=None)
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        from django.utils.text import slugify
        name = serializer.validated_data.get('name')
        slug = slugify(name)
        # Ensure uniqueness
        original_slug = slug
        counter = 1
        while Category.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        serializer.save(slug=slug)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Allow instructors to see their own unpublished courses
        user = self.request.user
        if user.is_authenticated and user.role == 'INSTRUCTOR':
            return Course.objects.filter(models.Q(is_published=True) | models.Q(instructor=user))
        return super().get_queryset()

    def perform_create(self, serializer):
        from django.utils.text import slugify
        title = serializer.validated_data.get('title')
        slug = slugify(title)
        # Ensure uniqueness
        original_slug = slug
        counter = 1
        while Course.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        serializer.save(instructor=self.request.user, slug=slug)

    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)
        
        # Filter courses where the user is the instructor
        courses = Course.objects.filter(instructor=user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]
