from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Client, ActivationCode, AuditLog

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'tenant', 'is_staff')
    list_filter = ('role', 'tenant', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'tenant')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'tenant')}),
    )

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'schema_name', 'created_on')
    search_fields = ('name', 'schema_name')

@admin.register(ActivationCode)
class ActivationCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'tenant', 'uses_left', 'expires_at', 'created_at')
    list_filter = ('tenant', 'expires_at')
    search_fields = ('code',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'get_target', 'timestamp', 'ip_address')
    list_filter = ('action', 'timestamp')
    search_fields = ('user__username', 'action', 'details')
    readonly_fields = ('timestamp',)

    def get_target(self, obj):
        return obj.details.get('target', '-')
    get_target.short_description = 'Target'
