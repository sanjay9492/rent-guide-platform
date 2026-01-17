import urllib.request
import json

cities = ["Bengaluru", "Hyderabad", "Chennai"]

for city in cities:
    url = f"http://localhost:8000/city-info/{city}"
    print(f"\nChecking {city}...")
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode('utf-8'))
            listings = data.get('listings', [])
            
            if not listings:
                print("No listings found!")
                continue
                
            first = listings[0]
            print(f"- First Listing: {first['name']} ({first['area']})")
            
            if city == "Hyderabad" and "Gachibowli" in first['area']:
                print("  -> PASS: Hyderabad returned Gachibowli listing.")
            elif city == "Bengaluru" and "Koramangala" in first['area']:
                print("  -> PASS: Bengaluru returned Koramangala listing.")
            elif city == "Chennai" and "OMR" in first['area']:
                print("  -> PASS: Chennai returned OMR listing.")
            
            if "random" in first['image']:
                print("  -> FAIL: Image is still random.")
            else:
                print("  -> PASS: Image uses Unsplash ID.")
                
    except Exception as e:
        print(f"Error: {e}")
