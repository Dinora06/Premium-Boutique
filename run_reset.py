import os
import paramiko

base_dir = r"d:\FullStack_Ecommerce_App-main"
pem_file = os.path.join(base_dir, "ecommerce-key.pem")
ip = "13.60.22.204"
user = "ubuntu"

print("Connecting to EC2...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
key = paramiko.RSAKey.from_private_key_file(pem_file)
ssh.connect(hostname=ip, username=user, pkey=key)

print("Transferring reset_admin.py...")
sftp = ssh.open_sftp()
sftp.put(os.path.join(base_dir, "backend", "reset_admin.py"), "/home/ubuntu/app/backend/reset_admin.py")
sftp.close()

print("Running reset_admin.py...")
stdin, stdout, stderr = ssh.exec_command("cd ~/app && sudo docker compose exec -T backend python backend/reset_admin.py")
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()
