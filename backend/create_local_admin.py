import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django.setup()

from django.contrib.auth.models import User

try:
    user = User.objects.get(username='admin')
    user.set_password('admin')
    user.is_active = True
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print("Updated existing 'admin' user with password 'admin' and set to active")
except User.DoesNotExist:
    user = User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    user.is_active = True
    user.save()
    print("Created new 'admin' user with password 'admin'")
