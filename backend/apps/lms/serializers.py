from rest_framework import serializers
from .models import Course, Module, Lesson, VideoContent, FileContent, LessonProgress, StudioBooking, Quiz, Question, Attempt, Certificate

class VideoContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoContent
        fields = '__all__'

class FileContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileContent
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'title', 'order', 'duration', 'content')

    def get_content(self, obj):
        if obj.content_type.model == 'videocontent':
            return VideoContentSerializer(obj.content_object).data
        elif obj.content_type.model == 'filecontent':
            return FileContentSerializer(obj.content_object).data
        return None

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ('id', 'title', 'order', 'lessons')

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'instructor_name', 'image', 'modules', 'created_at')

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ('lesson', 'is_completed', 'progress_percentage', 'last_watched_position')

class StudioBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioBooking
        fields = '__all__'
        read_only_fields = ('instructor', 'tenant')

    def validate(self, data):
        # Check for overlapping bookings
        start = data['start_time']
        end = data['end_time']
        
        # Simple overlap check
        qs = StudioBooking.objects.filter(
            start_time__lt=end,
            end_time__gt=start
        )
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
            
        if qs.exists():
            raise serializers.ValidationError("This time slot is already booked.")
            
        return data

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', 'choices', 'order')

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ('id', 'title', 'passing_score', 'time_limit', 'questions')

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = ('id', 'quiz', 'score', 'passed', 'completed_at')
        read_only_fields = ('score', 'passed', 'completed_at')

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    
    class Meta:
        model = Certificate
        fields = ('id', 'course', 'course_title', 'issue_date', 'verification_code', 'pdf_file')
