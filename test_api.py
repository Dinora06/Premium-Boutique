import urllib.request
try:
    req = urllib.request.urlopen("http://13.60.22.204/api/products/")
    print(req.getcode())
    print(req.read().decode()[:200])
except Exception as e:
    print(e)
