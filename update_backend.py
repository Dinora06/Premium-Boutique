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

    print("Uploading settings.py...")
    sftp = ssh.open_sftp()
    local_conf = os.path.join(base_dir, r"backend\my_project\settings.py")
    remote_conf = "/home/ubuntu/app/backend/my_project/settings.py"
    sftp.put(local_conf, remote_conf)
    sftp.close()

    print("Restarting backend container...")
    ssh.exec_command("cd ~/app && sudo docker compose restart backend")
    
    ssh.close()
    print("Done!")

if __name__ == "__main__":
    main()
