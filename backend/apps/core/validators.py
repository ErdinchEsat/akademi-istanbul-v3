"""
Reusable file validators for the Akademi Istanbul platform.
Following SOLID principles - Single Responsibility.
"""
from django.core.exceptions import ValidationError


class FileValidator:
    """
    File upload validator with security checks.
    Validates file size and type to prevent malicious uploads.
    """
    
    MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
    ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm']
    
    @staticmethod
    def validate_video_file(file):
        """
        Validate uploaded video file for size and extension.
        
        Args:
            file: UploadedFile object from Django
            
        Raises:
            ValidationError: If file is too large or has invalid extension
        """
        # Size validation
        if file.size > FileValidator.MAX_VIDEO_SIZE:
            size_mb = file.size / 1024 / 1024
            max_mb = FileValidator.MAX_VIDEO_SIZE / 1024 / 1024
            raise ValidationError(
                f'Video boyutu {max_mb:.0f}MB\'dan küçük olmalıdır. '
                f'Yüklenen dosya: {size_mb:.2f}MB'
            )
        
        # Extension validation (path traversal prevention)
        if not file.name:
            raise ValidationError('Dosya adı bulunamadı.')
        
        # Extract extension safely
        file_parts = file.name.split('.')
        if len(file_parts) < 2:
            raise ValidationError('Dosya uzantısı bulunamadı.')
        
        extension = file_parts[-1].lower()
        
        if extension not in FileValidator.ALLOWED_VIDEO_EXTENSIONS:
            raise ValidationError(
                f'Desteklenmeyen video formatı: .{extension}. '
                f'İzin verilen formatlar: {", ".join(FileValidator.ALLOWED_VIDEO_EXTENSIONS)}'
            )
        
        return file
