import os
import paramiko

def main():
    base_dir = r"d:\FullStack_Ecommerce_App-main"
    pem_file = os.path.join(base_dir, "ecommerce-key.pem")
    ip = "13.60.22.204"
    user = "ubuntu"
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    key = paramiko.RSAKey.from_private_key_file(pem_file)
    ssh.connect(hostname=ip, username=user, pkey=key)

    stdin, stdout, stderr = ssh.exec_command("sudo docker compose exec -T nginx cat /etc/nginx/conf.d/default.conf")
    print(stdout.read().decode())
    
    ssh.close()

if __name__ == "__main__":
    main()
