import urllib.request
import json

cities = ["Bengaluru", "Hyderabad", "Chennai"]

for city in cities:
    url = f"http://localhost:8000/city-info/{city}"
    print(f"\nChecking {city}...")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            # Check Areas
            print(f"Areas Found: {len(data.get('areas', []))}")
            if data['areas']:
                print(f" - Top Area: {data['areas'][0]['name']} ({data['areas'][0]['rent']})")
                
            # Check PGs
            print(f"PGs Found: {len(data.get('pgs', []))}")
            if data['pgs']:
                print(f" - Top PG: {data['pgs'][0]['name']} - {data['pgs'][0]['price']}")
                
    except Exception as e:
        print(f"Error fetching {city}: {e}")
