from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from .models import Category, Course, Module, Lesson, VideoLesson, PDFLesson, QuizLesson, HTMLLesson, LiveLesson, Assignment

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'children']
        read_only_fields = ['slug']

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []

class VideoLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoLesson
        fields = ['id', 'title', 'order', 'is_preview', 'video_url', 'duration', 'source_file', 'processing_status']
        read_only_fields = ['processing_status', 'duration']
        extra_kwargs = {
            'source_file': {'write_only': True}
        }

class PDFLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFLesson
        fields = ['id', 'title', 'order', 'is_preview', 'file']

class QuizLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizLesson
        fields = ['id', 'title', 'order', 'module', 'passing_score', 'duration_minutes', 'questions']

class HTMLLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = HTMLLesson
        fields = ['id', 'title', 'order', 'is_preview', 'content']

class LiveLessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveLesson
        fields = ['id', 'title', 'order', 'module', 'start_time', 'end_time', 'meeting_link', 'recording_url']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'order', 'module', 'due_date', 'points', 'file_submission_required']

# Base Lesson Serializer for the polymorphic mapping
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order', 'module', 'is_preview']

class LessonPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Lesson: LessonSerializer,
        VideoLesson: VideoLessonSerializer,
        PDFLesson: PDFLessonSerializer,
        QuizLesson: QuizLessonSerializer,
        HTMLLesson: HTMLLessonSerializer,
        LiveLesson: LiveLessonSerializer,
        Assignment: AssignmentSerializer
    }

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonPolymorphicSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'order', 'description', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'category_name', 'instructor', 'instructor_name', 
                  'description', 'image', 'price', 'is_published', 'created_at', 'modules']
        read_only_fields = ['slug']
