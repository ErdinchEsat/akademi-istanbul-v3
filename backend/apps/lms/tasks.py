from celery import shared_task
from .models import VideoContent

@shared_task
def process_video_task(video_content_id):
    try:
        video = VideoContent.objects.get(id=video_content_id)
        video.status = 'PROCESSING'
        video.save()

        # Mock processing (e.g. ffmpeg would go here)
        # For now, just copy raw to processed or simulate success
        import time
        time.sleep(5) # Simulate work
        
        video.status = 'COMPLETED'
        video.save()
        
    except VideoContent.DoesNotExist:
        pass

@shared_task
def generate_certificate_task(user_id, course_id):
    from django.contrib.auth import get_user_model
    from .models import Course, Certificate
    from .utils import generate_certificate_pdf
    from django.core.files.base import ContentFile
    import uuid

    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        course = Course.objects.get(id=course_id)
        
        # Check if certificate already exists
        if Certificate.objects.filter(user=user, course=course).exists():
            return

        verification_code = uuid.uuid4()
        pdf_buffer = generate_certificate_pdf(
            user.get_full_name(),
            course.title,
            "2023-11-23", # TODO: Use current date
            str(verification_code)
        )

        certificate = Certificate(
            user=user,
            course=course,
            verification_code=verification_code
        )
        certificate.pdf_file.save(f"certificate_{user.id}_{course.id}.pdf", ContentFile(pdf_buffer.read()))
        certificate.save()

    except (User.DoesNotExist, Course.DoesNotExist):
        pass
