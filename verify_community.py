import urllib.request
import json
import time

# 1. Check City Info for INR
city = "Bengaluru"
url = f"http://localhost:8000/city-info/{city}"
print(f"Checking {city}...")
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Currency: {data['rent_estimate']['currency']}")
        print(f"Rent: {data['rent_estimate']['average_rent']}")
except Exception as e:
    print(f"Error fetching city: {e}")

# 2. Post a Review
print("\nPosting Review...")
review_url = "http://localhost:8000/reviews"
review_data = {
    "city": "Bengaluru",
    "rent_amount": 22000,
    "property_type": "2BHK",
    "comment": "Great area in Indiranagar, but traffic is bad.",
    "likes": 0
}
req = urllib.request.Request(review_url, data=json.dumps(review_data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print("Review Posted:", response.status)
except Exception as e:
    print(f"Error posting review: {e}")

# 3. Get Reviews
print("\nFetching Reviews...")
get_reviews_url = f"http://localhost:8000/reviews/Bengaluru"
try:
    with urllib.request.urlopen(get_reviews_url) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Reviews Found: {len(data)}")
        if len(data) > 0:
            print(f"First Review: {data[0]['comment']} (Likes: {data[0]['likes']})")
            
            # 4. Like Review
            review_id = data[0]['id']
            print(f"Liking review {review_id}...")
            like_url = f"http://localhost:8000/reviews/{review_id}/like"
            like_req = urllib.request.Request(like_url, method='POST')
            with urllib.request.urlopen(like_req) as like_res:
                print("Like status:", like_res.status)

except Exception as e:
    print(f"Error fetching reviews: {e}")
