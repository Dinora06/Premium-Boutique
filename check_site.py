import urllib.request

try:
    print("Fetching index.html...")
    req = urllib.request.urlopen('http://13.60.22.204/')
    html = req.read().decode()
    print("HTML length:", len(html))
    
    # Simple parse to find js files
    import re
    js_files = re.findall(r'src="(/static/js/[^"]+)"', html)
    print("JS files found:", js_files)
    
    for js in js_files:
        url = 'http://13.60.22.204' + js
        print(f"Fetching {url} ...")
        try:
            r = urllib.request.urlopen(url)
            print(f"Status: {r.getcode()}, Length: {len(r.read())}")
        except urllib.error.HTTPError as e:
            print(f"Error: {e.code} for {url}")
            
except Exception as e:
    print(f"Exception: {e}")
