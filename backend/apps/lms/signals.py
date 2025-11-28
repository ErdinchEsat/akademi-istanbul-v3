from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import VideoLesson
from .tasks import transcode_video_task
import os

@receiver(post_save, sender=VideoLesson)
def trigger_transcoding(sender, instance, created, **kwargs):
    """Trigger video transcoding task when a new video is uploaded"""
    if instance.source_file and instance.processing_status == 'PENDING':
        # Trigger task
        # on_commit is better to ensure DB transaction is finished
        from django.db import transaction
        transaction.on_commit(lambda: transcode_video_task.delay(instance.id))

@receiver(pre_delete, sender=VideoLesson)
def delete_video_file(sender, instance, **kwargs):
    """
    Delete physical video file from disk when VideoLesson is deleted.
    Prevents orphan files and ensures GDPR/KVKK compliance.
    """
    if instance.source_file:
        try:
            if os.path.isfile(instance.source_file.path):
                os.remove(instance.source_file.path)
        except Exception as e:
            # Log but don't block deletion
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to delete video file {instance.source_file.path}: {e}")
