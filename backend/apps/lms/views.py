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
    serializer_class = LessonPolymorphicSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Use polymorphic serializer for list/retrieve, specific serializers for create/update"""
        return LessonPolymorphicSerializer
    
    def create(self, request, *args, **kwargs):
        """Create the correct polymorphic lesson type based on resourcetype"""
        from .models import VideoLesson, DocumentLesson, QuizLesson, HTMLLesson, LiveLesson, Assignment
        from .serializers import (VideoLessonSerializer, DocumentLessonSerializer, 
                                 QuizLessonSerializer, HTMLLessonSerializer,
                                 LiveLessonSerializer, AssignmentSerializer)
        
        resource_type = request.data.get('resourcetype')
        
        # Map resourcetype to model and serializer
        type_mapping = {
            'VideoLesson': (VideoLesson, VideoLessonSerializer),
            'DocumentLesson': (DocumentLesson, DocumentLessonSerializer),
            'QuizLesson': (QuizLesson, QuizLessonSerializer),
            'HTMLLesson': (HTMLLesson, HTMLLessonSerializer),
            'LiveLesson': (LiveLesson, LiveLessonSerializer),
            'Assignment': (Assignment, AssignmentSerializer),
        }
        
        if resource_type not in type_mapping:
            return Response(
                {'error': f'Invalid resourcetype: {resource_type}'}, 
status=400
            )
        
        model_class, serializer_class = type_mapping[resource_type]
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return with polymorphic serializer
        instance = model_class.objects.get(pk=serializer.instance.pk)
        output_serializer = LessonPolymorphicSerializer(instance)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=201, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """Update the lesson, handling polymorphic type conversion if needed"""
        from .models import VideoLesson, DocumentLesson, QuizLesson, HTMLLesson, LiveLesson, Assignment
        from .serializers import (VideoLessonSerializer, DocumentLessonSerializer,
                                 QuizLessonSerializer, HTMLLessonSerializer,
                                 LiveLessonSerializer, AssignmentSerializer)
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        resource_type = request.data.get('resourcetype', instance.resourcetype if hasattr(instance, 'resourcetype') else None)
        
        # Map resourcetype to serializer
        type_mapping = {
            'VideoLesson': (VideoLesson, VideoLessonSerializer),
            'DocumentLesson': (DocumentLesson, DocumentLessonSerializer),
            'QuizLesson': (QuizLesson, QuizLessonSerializer),
            'HTMLLesson': (HTMLLesson, HTMLLessonSerializer),
            'LiveLesson': (LiveLesson, LiveLessonSerializer),
            'Assignment': (Assignment, AssignmentSerializer),
        }
        
        # If type is changing or instance is base Lesson, convert to correct type
        current_type = type(instance).__name__
        new_type = resource_type
        
        if current_type != new_type and new_type in type_mapping:
            # Type conversion needed - delete old and create new
            model_class, serializer_class = type_mapping[new_type]
            
            # Save old data
            old_id = instance.id
            old_module = instance.module_id
            old_order = instance.order
            
            # Delete old instance
            instance.delete()
            
            # Create new instance with old ID preserved where possible
            data = request.data.copy()
            data['module'] = old_module
            if 'order' not in data:
                data['order'] = old_order
            
            serializer = serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            # Return new instance
            new_instance = model_class.objects.get(pk=serializer.instance.pk)
            output_serializer = LessonPolymorphicSerializer(new_instance)
            return Response(output_serializer.data)
        
        # Normal update - get correct serializer for current type
        if current_type in type_mapping:
            _, serializer_class = type_mapping[current_type]
        else:
            serializer_class = LessonSerializer
        
        serializer = serializer_class(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return with polymorphic serializer
        updated_instance = self.get_object()
        output_serializer = LessonPolymorphicSerializer(updated_instance)
        return Response(output_serializer.data)

