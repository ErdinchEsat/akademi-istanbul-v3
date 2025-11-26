from apps.core.models import Client, Domain

# Check if public tenant exists
if not Client.objects.filter(schema_name='public').exists():
    tenant = Client(schema_name='public', name='Public Tenant')
    tenant.save()
    
    domain = Domain()
    domain.domain = 'localhost' 
    domain.tenant = tenant
    domain.is_primary = True
    domain.save()
    print("Public tenant created")
else:
    print("Public tenant already exists")
