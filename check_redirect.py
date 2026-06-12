import urllib.request
import requests

try:
    res = requests.get("http://13.60.22.204/api/products/", allow_redirects=False)
    print("Status:", res.status_code)
    print("Headers:", res.headers)
except Exception as e:
    print(e)
