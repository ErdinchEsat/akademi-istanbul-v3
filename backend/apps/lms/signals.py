from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import VideoLesson
from .tasks import transcode_video_task
import os

@receiver(post_save, sender=VideoLesson)
def trigger_transcoding(sender, instance, created, **kwargs):
    if instance.source_file and instance.processing_status == 'PENDING':
        # Trigger task
        # on_commit is better to ensure DB transaction is finished
        from django.db import transaction
        transaction.on_commit(lambda: transcode_video_task.delay(instance.id))
