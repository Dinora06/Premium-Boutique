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

    print("Rebuilding and restarting backend container...")
    stdin, stdout, stderr = ssh.exec_command("cd ~/app && sudo docker compose build backend && sudo docker compose up -d backend")
    for line in stdout:
        print(line, end="")
    for line in stderr:
        print("ERR:", line, end="")
    
    ssh.close()
    print("Done!")

if __name__ == "__main__":
    main()
