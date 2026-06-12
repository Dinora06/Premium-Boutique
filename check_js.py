import urllib.request
import re

try:
    req = urllib.request.urlopen("http://13.60.22.204/static/js/main.0614064c.chunk.js")
    js_content = req.read().decode()
    # Find any IP addresses or http urls
    urls = re.findall(r'http://[a-zA-Z0-9\.\:]+', js_content)
    print("URLs found in JS:", set(urls))
except Exception as e:
    print(e)
