import urllib.request
import json

url = "http://localhost:8000/city-info/Bengaluru"
print(f"Checking {url}...")

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode('utf-8'))
        
        # Check Listings
        listings = data.get('listings', [])
        print(f"Listings Found: {len(listings)}")
        
        pgs = [l for l in listings if l['type'] == 'PG']
        flats = [l for l in listings if l['type'] == 'Flat']
        
        print(f"PGs: {len(pgs)}")
        print(f"Flats: {len(flats)}")
        
        if listings:
            first = listings[0]
            print("\nSample Listing:")
            print(f"Name: {first['name']}")
            print(f"Area: {first.get('area', 'N/A')}")
            print(f"Image: {first.get('image')[:50]}...")
            
except Exception as e:
    print(f"Error: {e}")
