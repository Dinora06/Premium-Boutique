import subprocess
subprocess.run('tar --exclude="db.sqlite3" -czf test.tar.gz backend', shell=True)
out = subprocess.run('tar -tf test.tar.gz', shell=True, capture_output=True, text=True).stdout
if 'db.sqlite3' in out:
    print('Failed: db.sqlite3 is in tar')
else:
    print('Success: db.sqlite3 is excluded')
