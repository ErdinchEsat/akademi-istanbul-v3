import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-me-in-prod')
# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': os.environ.get('POSTGRES_DB', 'akademi_db'),
        'USER': os.environ.get('POSTGRES_USER', 'akademi_user'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'akademi_password'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
    }
}

DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'tr-tr'

TIME_ZONE = 'Europe/Istanbul'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'core.User'

# Zoom
ZOOM_ACCOUNT_ID = os.environ.get('ZOOM_ACCOUNT_ID', '')
ZOOM_CLIENT_ID = os.environ.get('ZOOM_CLIENT_ID', '')
ZOOM_CLIENT_SECRET = os.environ.get('ZOOM_CLIENT_SECRET', '')

# Iyzico
IYZICO_API_KEY = os.environ.get('IYZICO_API_KEY', 'sandbox-api-key')
IYZICO_SECRET_KEY = os.environ.get('IYZICO_SECRET_KEY', 'sandbox-secret-key')
IYZICO_BASE_URL = os.environ.get('IYZICO_BASE_URL', 'https://sandbox-api.iyzipay.com')

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True # For development only
