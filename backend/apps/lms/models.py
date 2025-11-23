from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.core.models import Client

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='courses')
    tenant = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='courses')
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    duration = models.DurationField(null=True, blank=True)
    
    # Polymorphic content relation
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, limit_choices_to={'model__in': ('videocontent', 'filecontent', 'quizcontent')})
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

# Content Types
class VideoContent(models.Model):
    video_file = models.FileField(upload_to='videos/raw/')
    processed_file = models.FileField(upload_to='videos/processed/', null=True, blank=True)
    STATUS_CHOICES = (
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROCESSING')

    def __str__(self):
        return f"Video: {self.video_file.name}"

class FileContent(models.Model):
    file = models.FileField(upload_to='files/')
    
    def __str__(self):
        return f"File: {self.file.name}"

# Placeholder for Quiz (Phase 3)
class QuizContent(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return f"Quiz: {self.title}"

class LessonProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    progress_percentage = models.PositiveIntegerField(default=0)
    last_watched_position = models.PositiveIntegerField(default=0, help_text="Seconds")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'lesson')

class StudioBooking(models.Model):
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Client, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.start_time})"

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    passing_score = models.PositiveIntegerField(default=70)
    time_limit = models.PositiveIntegerField(help_text="Time limit in minutes", default=30)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    choices = models.JSONField(help_text="JSON list of choices")
    correct_answer = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.quiz.title} - {self.text[:50]}"

class Attempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.PositiveIntegerField()
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}"

class Certificate(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    issue_date = models.DateField(auto_now_add=True)
    verification_code = models.UUIDField(unique=True)
    pdf_file = models.FileField(upload_to='certificates/', null=True, blank=True)

    def __str__(self):
        return f"Certificate: {self.user.username} - {self.course.title}"
