from django.db import models
from django.contrib.auth.models import AbstractUser
from django_tenants.models import TenantMixin, DomainMixin
from django.utils.translation import gettext_lazy as _
import uuid

class Client(TenantMixin):
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)

    # Add other tenant specific fields here
    auto_create_schema = True

    def __str__(self):
        return self.name

class Domain(DomainMixin):
    pass

class UserRole(models.TextChoices):
    STUDENT = 'STUDENT', _('Student')
    INSTRUCTOR = 'INSTRUCTOR', _('Instructor')
    ADMIN = 'ADMIN', _('Admin')
    TENANT_ADMIN = 'TENANT_ADMIN', _('Tenant Admin')

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.STUDENT
    )
    tenant = models.ForeignKey(
        Client,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        help_text=_("The tenant this user belongs to.")
    )

    def __str__(self):
        return self.username

class ActivationCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    tenant = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='activation_codes')
    uses_left = models.PositiveIntegerField(default=1)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        from django.utils import timezone
        return self.uses_left > 0 and self.expires_at > timezone.now()

    def __str__(self):
        return f"{self.code} - {self.tenant.name}"
