import os
import subprocess
from celery import shared_task
from django.conf import settings
from .models import VideoLesson

@shared_task
def transcode_video_task(lesson_id):
    try:
        lesson = VideoLesson.objects.get(id=lesson_id)
        if not lesson.source_file:
            return "No source file"

        lesson.processing_status = 'PROCESSING'
        lesson.save()

        # Paths
        input_path = lesson.source_file.path
        
        # Create output directory for HLS segments
        file_name = os.path.splitext(os.path.basename(input_path))[0]
        output_dir = os.path.join(settings.MEDIA_ROOT, 'course_videos', 'hls', file_name)
        os.makedirs(output_dir, exist_ok=True)
        
        output_playlist = os.path.join(output_dir, 'index.m3u8')

        # FFmpeg command for HLS transcoding
        # -hls_time 10: Segment duration 10 seconds
        # -hls_list_size 0: Include all segments in playlist
        # -f hls: Output format
        command = [
            'ffmpeg',
            '-i', input_path,
            '-profile:v', 'baseline', # Baseline profile for compatibility
            '-level', '3.0',
            '-start_number', '0',
            '-hls_time', '10',
            '-hls_list_size', '0',
            '-f', 'hls',
            output_playlist
        ]

        # Run FFmpeg
        process = subprocess.run(command, capture_output=True, text=True)
        
        if process.returncode != 0:
            print(f"FFmpeg Error: {process.stderr}")
            lesson.processing_status = 'FAILED'
            lesson.save()
            return f"Transcoding failed: {process.stderr}"

        # Update Lesson
        # Construct URL relative to MEDIA_URL
        relative_path = os.path.join('course_videos', 'hls', file_name, 'index.m3u8')
        # Assuming MEDIA_URL is handled by web server or S3
        # For local dev with django.conf.urls.static, this works.
        # For S3, we would need to upload the directory to S3. 
        # Since we are using local filesystem for now (MinIO is in docker but we are using local media root in settings?),
        # Let's check settings.py later. For now assume local file storage for simplicity or volume mount.
        
        lesson.video_url = settings.MEDIA_URL + relative_path
        lesson.processing_status = 'COMPLETED'
        lesson.save()

        return "Transcoding completed successfully"

    except VideoLesson.DoesNotExist:
        return "Lesson not found"
    except Exception as e:
        if 'lesson' in locals():
            lesson.processing_status = 'FAILED'
            lesson.save()
        return f"Error: {str(e)}"
