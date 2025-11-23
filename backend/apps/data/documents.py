from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import AuditLog

@registry.register_document
class AuditLogDocument(Document):
    user = fields.ObjectField(properties={
        'id': fields.IntegerField(),
        'username': fields.TextField(),
    })
    
    class Index:
        name = 'audit_logs'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = AuditLog
        fields = [
            'action',
            'timestamp',
            'details',
            'ip_address',
        ]
