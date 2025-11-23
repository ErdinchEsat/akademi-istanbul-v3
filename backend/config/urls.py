from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.core.urls')),
    path('api/lms/', include('apps.lms.urls')),
    path('api/commerce/', include('apps.commerce.urls')),
    path('api/data/', include('apps.data.urls')),
]
