from celery import shared_task
from .models import AuditLog

@shared_task
def log_audit_task(user_id, action, details, ip_address):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id) if user_id else None
        AuditLog.objects.create(
            user=user,
            action=action,
            details=details,
            ip_address=ip_address
        )
    except Exception as e:
        print(f"Error logging audit: {e}")

@shared_task
def run_etl_job():
    # Mock ETL job
    # In reality, this would aggregate data from various tables and update a reporting table
    print("Running nightly ETL job...")
    # Example: Calculate daily active users, total revenue, etc.
    return "ETL Job Completed"
