import urllib.request
import json
import time

cities = ["London", "Paris", "Tokyo"]

for city in cities:
    url = f"http://localhost:8000/city-info/{city}"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"\n--- {data['city_name']} ---")
            print(f"Description: {data['description'][:100]}...")
            print(f"Rent: {data['rent_estimate']['currency']}{data['rent_estimate']['average_rent']}")
            print(f"Images: {len(data['images'])} mock images found.")
            print(f"QoL Score: {data['quality_of_life']['score']}")
    except Exception as e:
        print(f"Error fetching {city}: {e}")
