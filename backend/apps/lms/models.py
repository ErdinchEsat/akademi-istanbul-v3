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
    
    from apps.core.validators import FileValidator

    source_file = models.FileField(
        upload_to='course_videos/raw/', 
        null=True, 
        blank=True,
        validators=[FileValidator.validate_video_file],
        help_text="Upload raw video file (Max: 100MB, Formats: MP4, MOV, AVI, MKV, WEBM)"
    )
    video_url = models.URLField(help_text="URL to the processed HLS stream", blank=True, null=True) # Repurposed as HLS URL
    duration = models.DurationField(null=True, blank=True)
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS_CHOICES, default='PENDING')

    class Meta:
        verbose_name = "Video Lesson"

class DocumentLesson(Lesson):
    """Ders Materyali - PDF, DOCX, XLSX formatlarını destekler"""
    from django.core.validators import FileExtensionValidator
    from django.core.exceptions import ValidationError
    
    ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx']
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
    
    def validate_file_size(file):
        """5MB file size limit validator"""
        if file.size > DocumentLesson.MAX_FILE_SIZE:
            raise ValidationError(f'Dosya boyutu 5MB\'dan küçük olmalıdır. Mevcut boyut: {file.size / 1024 / 1024:.2f}MB')
    
    file = models.FileField(
        upload_to='course_documents/',
        validators=[
            FileExtensionValidator(allowed_extensions=ALLOWED_EXTENSIONS),
            validate_file_size
        ],
        help_text="PDF, Word (.doc, .docx) veya Excel (.xls, .xlsx) yükleyebilirsiniz (Max: 5MB)"
    )
    file_type = models.CharField(max_length=10, editable=False, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True, editable=False, help_text="Dosya boyutu (bytes)")
    
    class Meta:
        verbose_name = "Document Lesson"
        verbose_name_plural = "Document Lessons"
    
    def save(self, *args, **kwargs):
        if self.file:
            # Otomatik dosya tipi algılama
            self.file_type = self.file.name.split('.')[-1].lower()
            self.file_size = self.file.size
        super().save(*args, **kwargs)


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
