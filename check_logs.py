import urllib.request
import requests
import paramiko
import os

def main():
    base_dir = r"d:\FullStack_Ecommerce_App-main"
    pem_file = os.path.join(base_dir, "ecommerce-key.pem")
    ip = "13.60.22.204"
    user = "ubuntu"
    
    # 1. Make the request
    try:
        requests.get("http://13.60.22.204/api/products/", allow_redirects=False)
    except Exception as e:
        print(e)
        
    # 2. Check Nginx logs
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    key = paramiko.RSAKey.from_private_key_file(pem_file)
    ssh.connect(hostname=ip, username=user, pkey=key)

    stdin, stdout, stderr = ssh.exec_command("cd ~/app && sudo docker compose logs --tail=10 nginx")
    print("--- nginx logs ---")
    print(stdout.read().decode())
    
    stdin, stdout, stderr = ssh.exec_command("cd ~/app && sudo docker compose logs --tail=10 backend")
    print("--- backend logs ---")
    print(stdout.read().decode())
    
    ssh.close()

if __name__ == "__main__":
    main()
