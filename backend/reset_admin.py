import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django.setup()

from django.contrib.auth.models import User

# Try to find user 'admin'
try:
    user = User.objects.get(username='admin')
    user.set_password('admin')
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print("Updated existing 'admin' password to 'admin'")
except User.DoesNotExist:
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Created new 'admin' user with password 'admin'")
