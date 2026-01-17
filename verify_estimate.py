import urllib.request
import json

url = "http://localhost:8000/estimate"
data = {
    "city": "New York",
    "bedrooms": 2,
    "bathrooms": 1
}
headers = {"Content-Type": "application/json"}

# Encode data
json_data = json.dumps(data).encode("utf-8")

try:
    # POST Request
    req = urllib.request.Request(url, data=json_data, headers=headers, method="POST")
    with urllib.request.urlopen(req) as response:
        print(f"POST Status: {response.status}")
        print(f"POST Response: {response.read().decode('utf-8')}")

except Exception as e:
    print(f"Error: {e}")
