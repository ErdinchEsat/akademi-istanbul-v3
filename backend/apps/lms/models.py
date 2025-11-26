from django.db import models
from django.contrib.auth import get_user_model
from polymorphic.models import PolymorphicModel
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    instructor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='courses_taught')
    description = models.TextField()
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(PolymorphicModel):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    is_preview = models.BooleanField(default=False, help_text="Is this lesson available for free preview?")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class VideoLesson(Lesson):
    PROCESSING_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )

    source_file = models.FileField(upload_to='course_videos/raw/', null=True, blank=True, help_text="Upload raw video file here")
    video_url = models.URLField(help_text="URL to the processed HLS stream", blank=True, null=True) # Repurposed as HLS URL
    duration = models.DurationField(null=True, blank=True)
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS_CHOICES, default='PENDING')

    class Meta:
        verbose_name = "Video Lesson"

class PDFLesson(Lesson):
    file = models.FileField(upload_to='course_pdfs/')
    
    class Meta:
        verbose_name = "PDF Lesson"

class LiveLesson(Lesson):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    meeting_link = models.URLField(help_text="Zoom/Google Meet link")
    recording_url = models.URLField(blank=True, null=True, help_text="Link to the recorded session")

    class Meta:
        verbose_name = "Live Lesson"

class Assignment(Lesson):
    due_date = models.DateTimeField()
    points = models.PositiveIntegerField(default=100)
    file_submission_required = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "Assignment"

class QuizLesson(Lesson):
    passing_score = models.PositiveIntegerField(default=70)
    duration_minutes = models.PositiveIntegerField(default=15, help_text="Duration in minutes")
    questions = models.JSONField(default=list, help_text="List of questions with options and correct answer")
    
    class Meta:
        verbose_name = "Quiz Lesson"

class HTMLLesson(Lesson):
    content = models.TextField(help_text="Rich text content")
    
    class Meta:
        verbose_name = "HTML Lesson"
