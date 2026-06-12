import os
import paramiko

base_dir = r'd:\FullStack_Ecommerce_App-main'
pem_file = os.path.join(base_dir, 'ecommerce-key.pem')
ip = '13.60.22.204'
user = 'ubuntu'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
key = paramiko.RSAKey.from_private_key_file(pem_file)
ssh.connect(hostname=ip, username=user, pkey=key)

cmd = '''cd ~/app && sudo docker compose exec -T backend python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')
django.setup()
from django.contrib.auth.models import User
users = User.objects.all()
for u in users:
    print(u.username, u.is_active, u.is_staff, u.is_superuser)
"
'''
stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
