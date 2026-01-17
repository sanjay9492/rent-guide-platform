import urllib.request
import json

url = "http://localhost:8000/rents/"
data = {
    "address": "123 Verification Lane",
    "monthly_rent": 2000,
    "landlord_name": "Jane Verifier"
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

    # GET Request
    req_get = urllib.request.Request(url)
    with urllib.request.urlopen(req_get) as response:
        print(f"GET Status: {response.status}")
        print(f"GET Response: {response.read().decode('utf-8')}")

except Exception as e:
    print(f"Error: {e}")
