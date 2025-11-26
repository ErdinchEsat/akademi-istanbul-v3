from apps.core.models import ActivationCode, Client
from django.utils import timezone
from datetime import timedelta

# Get public tenant
tenant = Client.objects.get(schema_name='public')

# Create code
code = ActivationCode.objects.create(
    code='TEST2024',
    tenant=tenant,
    uses_left=10,
    expires_at=timezone.now() + timedelta(days=7)
)

print(f"Activation Code Created: {code.code}")
