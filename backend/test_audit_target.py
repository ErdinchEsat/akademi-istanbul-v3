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
    admin_user = User.objects.create_superuser('temp_admin', 'admin@example.com', 'admin')

_thread_locals.user = admin_user
_thread_locals.ip = '127.0.0.1'

# 2. Create Target User
target_username = 'target_test_user'
if User.objects.filter(username=target_username).exists():
    User.objects.get(username=target_username).delete()

print(f"Creating target user: {target_username}")
target_user = User.objects.create_user(username=target_username, password='testpassword')

# 3. Verify Create Log
print("Checking Create Log...")
time.sleep(1)
create_log = AuditLog.objects.filter(action='USER_CREATE', details__username=target_username).first()

if create_log:
    target_info = create_log.details.get('target')
    print(f"[SUCCESS] Create Log Target: {target_info}")
    if target_info == target_username:
        print("  [PASS] Target matches username.")
    else:
        print(f"  [FAIL] Target mismatch. Expected {target_username}, got {target_info}")
else:
    print("[FAILURE] Create Log NOT Found")

# 4. Update Target User
print("Updating target user...")
target_user.first_name = "Updated Name"
target_user.save()

# 5. Verify Update Log
print("Checking Update Log...")
time.sleep(1)
update_log = AuditLog.objects.filter(action='USER_UPDATE', details__first_name__new='Updated Name').first()

if update_log:
    target_info = update_log.details.get('target')
    print(f"[SUCCESS] Update Log Target: {target_info}")
    if target_info == target_username:
        print("  [PASS] Target matches username.")
    else:
        print(f"  [FAIL] Target mismatch. Expected {target_username}, got {target_info}")
else:
    print("[FAILURE] Update Log NOT Found")

# Clean up
if target_user.pk:
    target_user.delete()
if admin_user.username == 'temp_admin':
    admin_user.delete()
