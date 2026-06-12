import os
import urllib.request
import urllib.parse
import time

products_data = [
    {"keywords": "yellow,dress,woman"},
    {"keywords": "autumn,dress,woman"},
    {"keywords": "trousers,office,woman"},
    {"keywords": "floral,dress,spring"},
    {"keywords": "wool,coat,winter"},
    {"keywords": "white,tshirt,man"},
    {"keywords": "sneakers,running,man"},
    {"keywords": "hoodie,grey,man"},
    {"keywords": "jeans,blue,man"},
    {"keywords": "suit,elegant,man"},
    {"keywords": "dress,summer,girl"},
    {"keywords": "jacket,winter,girl"},
    {"keywords": "uniform,school,girl"},
    {"keywords": "dress,party,girl"},
    {"keywords": "sneakers,pink,girl"},
    {"keywords": "tracksuit,sports,boy"},
    {"keywords": "jeans,blue,boy"},
    {"keywords": "uniform,school,boy"},
    {"keywords": "windbreaker,jacket,boy"},
    {"keywords": "sneakers,blue,boy"},
    {"keywords": "bodysuit,cotton,baby"},
    {"keywords": "romper,winter,baby"},
    {"keywords": "beanie,hat,baby"},
    {"keywords": "sleepingbag,baby"},
    {"keywords": "socks,warm,baby"}
]

img_dir = os.path.join(os.path.dirname(__file__), 'static', 'images')
os.makedirs(img_dir, exist_ok=True)

for i, data in enumerate(products_data):
    filename = f"prod_image_{i+1}.jpg"
    filepath = os.path.join(img_dir, filename)
    
    url = f"https://loremflickr.com/500/600/{data['keywords']}/all"
    
    print(f"Downloading {url} to {filepath}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        time.sleep(1) # sleep to prevent rate limiting
    except Exception as e:
        print(f"Failed to download image {i+1}: {e}")
