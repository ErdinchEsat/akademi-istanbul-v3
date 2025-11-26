from django.db.models.signals import pre_save, post_save, post_delete
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.forms.models import model_to_dict
from .models import AuditLog, Client, ActivationCode
from .middleware import get_current_user, get_current_ip
import json
from django.core.serializers.json import DjangoJSONEncoder

User = get_user_model()

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    ip = get_current_ip()
    AuditLog.objects.create(
        user=user,
        action='LOGIN',
        details={'message': 'User logged in successfully'},
        ip_address=ip
    )

@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    ip = get_current_ip()
    AuditLog.objects.create(
        action='LOGIN_FAILED',
        details={'credentials': credentials, 'message': 'Login failed'},
        ip_address=ip
    )

@receiver(pre_save, sender=User)
@receiver(pre_save, sender=Client)
@receiver(pre_save, sender=ActivationCode)
def capture_old_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
            instance._old_state = model_to_dict(old_instance)
        except sender.DoesNotExist:
            instance._old_state = {}
    else:
        instance._old_state = {}

@receiver(post_save, sender=User)
@receiver(post_save, sender=Client)
@receiver(post_save, sender=ActivationCode)
def log_model_change(sender, instance, created, **kwargs):
    action = 'CREATE' if created else 'UPDATE'
    model_name = sender.__name__
    
    user = get_current_user()
    ip = get_current_ip()
    
    details = {}
    
    # Helper to sanitize dict for JSONField
    def sanitize_for_json(data):
        return json.loads(json.dumps(data, cls=DjangoJSONEncoder))

    # Identify the target
    target_info = str(instance)
    if model_name == 'User':
        target_info = instance.username
    elif model_name == 'Client':
        target_info = instance.name
    elif model_name == 'ActivationCode':
        target_info = instance.code

    if created:
        try:
            details = model_to_dict(instance)
            # Remove sensitive or large fields if necessary
            if 'password' in details:
                del details['password']
            if 'groups' in details:
                del details['groups']
            if 'user_permissions' in details:
                del details['user_permissions']
            details = sanitize_for_json(details)
        except Exception as e:
            details = {'error': str(e)}
    else:
        # Calculate diff
        old_state = getattr(instance, '_old_state', {})
        new_state = model_to_dict(instance)
        
        diff = {}
        for field, new_value in new_state.items():
            if field in ['password', 'last_login', 'groups', 'user_permissions']:
                continue
                
            old_value = old_state.get(field)
            if old_value != new_value:
                diff[field] = {
                    'old': old_value,
                    'new': new_value
                }
        
        if not diff:
            return # No changes detected (or only ignored fields changed)
            
        details = sanitize_for_json(diff)

    # Add target info to details
    if isinstance(details, dict):
        details['target'] = target_info

    # If user is not authenticated (e.g. system task), user will be None
    if user and not user.is_authenticated:
        user = None

    AuditLog.objects.create(
        user=user,
        action=f'{model_name.upper()}_{action}',
        details=details,
        ip_address=ip
    )

@receiver(post_delete, sender=User)
@receiver(post_delete, sender=Client)
@receiver(post_delete, sender=ActivationCode)
def log_model_delete(sender, instance, **kwargs):
    model_name = sender.__name__
    user = get_current_user()
    ip = get_current_ip()
    
    if user and not user.is_authenticated:
        user = None

    # Identify the target
    target_info = str(instance)
    if model_name == 'User':
        target_info = instance.username
    elif model_name == 'Client':
        target_info = instance.name
    elif model_name == 'ActivationCode':
        target_info = instance.code

    AuditLog.objects.create(
        user=user,
        action=f'{model_name.upper()}_DELETE',
        details={'id': str(instance.pk), 'str_repr': str(instance), 'target': target_info},
        ip_address=ip
    )
