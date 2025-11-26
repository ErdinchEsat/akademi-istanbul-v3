import os
import django
import time
import threading

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.core.models import AuditLog
from apps.core.middleware import _thread_locals

User = get_user_model()

# 1. Setup Actor (Admin)
admin_user = User.objects.filter(username='admin').first()
if not admin_user:
    print("Admin user not found, creating temporary admin...")
    admin_user = User.objects.create_superuser('temp_admin', 'admin@example.com', 'admin')

# Simulate Middleware setting thread locals
_thread_locals.user = admin_user
_thread_locals.ip = '127.0.0.1'

print(f"Simulating request by: {admin_user.username}")

# 2. Create Target User
target_username = 'audit_diff_test'
if User.objects.filter(username=target_username).exists():
    User.objects.get(username=target_username).delete()

print(f"Creating target user: {target_username}")
target_user = User.objects.create_user(username=target_username, password='testpassword', role='STUDENT')

# 3. Update Target User (Trigger Diff)
print(f"Updating target user role to INSTRUCTOR...")
target_user.role = 'INSTRUCTOR'
target_user.save()

# 4. Verify Logs
print("Checking Audit Logs...")
time.sleep(1)

# Check Creation Log
create_log = AuditLog.objects.filter(action='USER_CREATE', details__username=target_username).first()
if create_log:
    print(f"[SUCCESS] Create Log Found!")
    print(f"  Actor: {create_log.user.username if create_log.user else 'None'}")
    print(f"  IP: {create_log.ip_address}")
else:
    print("[FAILURE] Create Log NOT Found")

# Check Update Log (Diff)
update_log = AuditLog.objects.filter(action='USER_UPDATE', details__role__new='INSTRUCTOR').first()
if update_log:
    print(f"[SUCCESS] Update Log Found!")
    print(f"  Actor: {update_log.user.username if update_log.user else 'None'}")
    print(f"  Details (Diff): {update_log.details}")
    
    if update_log.user == admin_user:
        print("  [PASS] Actor matches expected admin user.")
    else:
        print(f"  [FAIL] Actor mismatch. Expected {admin_user.username}, got {update_log.user}")
        
    if 'role' in update_log.details and update_log.details['role']['old'] == 'STUDENT':
        print("  [PASS] Diff logic works correctly.")
    else:
        print("  [FAIL] Diff logic incorrect.")

else:
    print("[FAILURE] Update Log NOT Found")

# Clean up
if target_user.pk:
    target_user.delete()
if admin_user.username == 'temp_admin':
    admin_user.delete()
