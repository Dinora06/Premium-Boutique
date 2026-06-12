import os
import sys
import paramiko
import subprocess
from paramiko import SSHClient, AutoAddPolicy

def run_local(cmd, cwd=None, env=None):
    print(f"Local: {cmd}")
    _env = os.environ.copy()
    if env:
        _env.update(env)
    res = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, env=_env)
    if res.returncode != 0:
        print(f"Error executing: {cmd}")
        print(res.stderr)
        sys.exit(1)

def run_remote(ssh, cmd):
    print(f"Remote: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    
    if exit_status != 0:
        print(f"Error executing: {cmd}")
        print(err)
        sys.exit(1)
    return out

def main():
    base_dir = r"d:\FullStack_Ecommerce_App-main"
    frontend_dir = os.path.join(base_dir, "frontend")
    pem_file = os.path.join(base_dir, "ecommerce-key.pem")
    ip = "13.60.22.204"
    user = "ubuntu"
    
    # 1. Build frontend
    print("Building frontend...")
    # run_local("npm install", cwd=frontend_dir)
    # run_local("npm run build", cwd=frontend_dir, env={"NODE_OPTIONS": "--openssl-legacy-provider"})
    print("Frontend build complete.")

    # 2. Tar files
    print("Creating archive...")
    tar_cmd = 'tar --exclude="db.sqlite3" -czf deploy.tar.gz backend docker-compose.yml nginx.conf frontend/build'
    run_local(tar_cmd, cwd=base_dir)

    # 3. SSH Connect using Paramiko
    print("Connecting to EC2...")
    ssh = SSHClient()
    ssh.set_missing_host_key_policy(AutoAddPolicy())
    key = paramiko.RSAKey.from_private_key_file(pem_file)
    ssh.connect(hostname=ip, username=user, pkey=key)

    # 4. Create dir and SFTP transfer
    print("Transferring files...")
    run_remote(ssh, "mkdir -p ~/app")
    
    sftp = ssh.open_sftp()
    local_tar = os.path.join(base_dir, "deploy.tar.gz")
    remote_tar = "/home/ubuntu/app/deploy.tar.gz"
    sftp.put(local_tar, remote_tar)
    sftp.close()

    # 5. Extract and Deploy
    print("Extracting and running Docker on EC2...")
    commands = [
        "cd ~/app && tar -xzf deploy.tar.gz",
        # Install Docker if missing
        "if ! command -v docker &> /dev/null; then curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker ubuntu; fi",
        # Install compose
        "if ! docker compose version &> /dev/null; then sudo apt-get update && sudo apt-get install -y docker-compose-plugin; fi",
        "cd ~/app && sudo docker compose down",
        "cd ~/app && sudo docker compose up --build -d",
        "cd ~/app && sudo docker compose exec -T backend python manage.py makemigrations",
        "cd ~/app && sudo docker compose exec -T backend python manage.py migrate",
        "cd ~/app && sudo docker compose exec -T backend python manage.py collectstatic --noinput"
    ]
    
    for cmd in commands:
        run_remote(ssh, cmd)
        
    ssh.close()
    print(f"\nDeployment successful! Access the site at: https://premium-boutique-uz.duckdns.org/")

if __name__ == "__main__":
    main()
