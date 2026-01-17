import httpx
import random

class CityService:
    @staticmethod
    async def get_city_description(city_name: str):
        """Fetches a short description from Wikipedia API."""
        try:
            url = "https://en.wikipedia.org/w/api.php"
            params = {
                "action": "query",
                "format": "json",
                "prop": "extracts",
                "exintro": True,
                "explaintext": True,
                "titles": city_name,
                "redirects": 1
            }
            headers = {
                "User-Agent": "RentGuideBot/1.0 (contact@rentguide.com)"
            }
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=headers)
                data = response.json()
                
                pages = data.get("query", {}).get("pages", {})
                for page_id, page_data in pages.items():
                    if page_id != "-1":
                         # Return the first paragraph or first 300 chars
                        extract = page_data.get("extract", "No description available.")
                        return extract[:400] + "..." if len(extract) > 400 else extract
                        
                return "Description not found."
        except Exception as e:
            print(f"Error fetching description: {e}")
            return "Could not fetch description."

    @staticmethod
    def get_mock_images(city_name: str):
        """Returns reliable Unsplash image URLs."""
        city_lower = city_name.lower().strip()
        
        # Consistent, high-quality images per city
        if "bengaluru" in city_lower or "bangalore" in city_lower:
            return [
                "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200", # Vidhana Soudha
                "https://images.unsplash.com/photo-1449824913929-4bd6d5a88adc?w=1200", # City
                "https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=1200"  # ISKCON
            ]
        elif "hyderabad" in city_lower:
             return [
                "https://images.unsplash.com/photo-1572455027382-706593b4fe7e?w=1200", # Charminar
                "https://images.unsplash.com/photo-1605537964076-3cb0ea2e356d?w=1200", # Traffic/City
                "https://images.unsplash.com/photo-1549467688-6c84c7e6c518?w=1200"  # Hussain Sagar
            ]
        elif "chennai" in city_lower:
             return [
                "https://images.unsplash.com/photo-1582510003544-bea4db981a33?w=1200", # Temple/Beach
                "https://images.unsplash.com/photo-1625292415516-56f874983226?w=1200", # Kapaleeshwarar
                "https://images.unsplash.com/photo-1517549641777-62624a047d7a?w=1200"  # Guindy
            ]
        
        # Fallback
        base_keyword = city_name.replace(" ", ",")
        return [
            f"https://source.unsplash.com/800x600/?{base_keyword},city",
            f"https://source.unsplash.com/800x600/?{base_keyword},street"
        ]

    @staticmethod
    def get_mock_rent_estimate(city_name: str):
        """Mock rent estimation logic (Indian Context)."""
        city_lower = city_name.lower().strip()
        
        # Base price in INR for a standard 1BHK
        base_price = 12000 
        multiplier = 1.0
        
        # Indian Tier 1 Cities
        if "bengaluru" in city_lower or "bangalore" in city_lower: multiplier = 1.8  # ~21.6k
        elif "mumbai" in city_lower: multiplier = 2.5     # ~30k
        elif "hyderabad" in city_lower: multiplier = 1.5  # ~18k
        elif "chennai" in city_lower: multiplier = 1.4    # ~16.8k
        elif "delhi" in city_lower: multiplier = 1.6      # ~19.2k
        elif "pune" in city_lower: multiplier = 1.4       # ~16.8k
        
        # International Fallback (roughly converted or high tier)
        elif "new york" in city_lower: multiplier = 8.0
        elif "london" in city_lower: multiplier = 7.0
        
        # Randomize slightly for "live" feel
        variation = random.uniform(0.9, 1.1)
        
        estimated_avg = int(base_price * multiplier * variation)
        
        # Round to nearest 100 for cleaner look
        estimated_avg = round(estimated_avg / 100) * 100
        
        return {
            "average_rent": estimated_avg,
            "range_low": int(estimated_avg * 0.9),
            "range_high": int(estimated_avg * 1.1),
            "currency": "₹"
        }

    @staticmethod
    def get_areas(city_name: str):
        """Mock list of popular areas with avg rent."""
        city_lower = city_name.lower().strip()
        
        if "bengaluru" in city_lower or "bangalore" in city_lower:
            return [
                {"name": "Koramangala", "rent": "₹28,000", "vibe": "Startups & Pubs", "image": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=300&q=80"},
                {"name": "Indiranagar", "rent": "₹32,000", "vibe": "Posh & Green", "image": "https://images.unsplash.com/photo-1626245229239-b9d9c288f6b8?auto=format&fit=crop&w=300&q=80"},
                {"name": "HSR Layout", "rent": "₹24,000", "vibe": "Residential & IT", "image": "https://images.unsplash.com/photo-1542361345-89e58247f2d5?auto=format&fit=crop&w=300&q=80"},
                {"name": "Whitefield", "rent": "₹20,000", "vibe": "Tech Parks", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80"}
            ]
        elif "hyderabad" in city_lower:
            return [
                {"name": "Gachibowli", "rent": "₹25,000", "vibe": "IT Hub", "image": "https://images.unsplash.com/photo-1605537964076-3cb0ea2e356d?auto=format&fit=crop&w=300&q=80"},
                {"name": "Hitex City", "rent": "₹26,000", "vibe": "Corporate", "image": "https://images.unsplash.com/photo-1549467688-6c84c7e6c518?auto=format&fit=crop&w=300&q=80"},
                {"name": "Jubilee Hills", "rent": "₹45,000", "vibe": "Elite", "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80"}
            ]
        elif "chennai" in city_lower:
            return [
                {"name": "OMR", "rent": "₹18,000", "vibe": "IT Corridor", "image": "https://images.unsplash.com/photo-1582510003544-bea4db981a33?auto=format&fit=crop&w=300&q=80"},
                {"name": "Adyar", "rent": "₹22,000", "vibe": "Classic Chennai", "image": "https://images.unsplash.com/photo-1625292415516-56f874983226?auto=format&fit=crop&w=300&q=80"},
                {"name": "Velachery", "rent": "₹16,000", "vibe": "Shopping Hub", "image": "https://images.unsplash.com/photo-1517549641777-62624a047d7a?auto=format&fit=crop&w=300&q=80"}
            ]
        
        return [
            {"name": "City Center", "rent": "₹25,000", "vibe": "Downtown", "image": "https://images.unsplash.com/photo-1449824913929-4bd6d5a88adc?auto=format&fit=crop&w=300&q=80"},
            {"name": "Suburbia", "rent": "₹15,000", "vibe": "Peaceful", "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80"}
        ]

    @staticmethod
    def get_listings(city_name: str):
        """Unique listings per city."""
        city_lower = city_name.lower().strip()
        listings = []
        
        # Reliable Images
        pg_imgs = [
            "https://images.unsplash.com/photo-1522771753062-5887739e663e?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1628932630248-0d4ddee66412?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80"
        ]
        flat_imgs = [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
        ]

        if "bengaluru" in city_lower or "bangalore" in city_lower:
            listings = [
                {"id": 101, "type": "PG", "name": "Zolo Stays - Tech Park", "area": "Koramangala", "price": "₹14,000/mo", "image": pg_imgs[0], "specs": "Twin Sharing • Meals", "amenities": ["WiFi", "AC", "Power Backup"]},
                {"id": 102, "type": "PG", "name": "Stanza Living - Elite", "area": "Indiranagar", "price": "₹18,500/mo", "image": pg_imgs[1], "specs": "Single Room • Luxury", "amenities": ["Gym", "Gaming", "Housekeeping"]},
                {"id": 103, "type": "Flat", "name": "Cozy 1BHK Apartment", "area": "HSR Layout", "price": "₹22,000/mo", "image": flat_imgs[0], "specs": "1 Bedroom • 600 sqft", "amenities": ["Balcony", "Gated Profile", "Parking"]},
                {"id": 104, "type": "Flat", "name": "Prestige Shantiniketan 2BHK", "area": "Whitefield", "price": "₹35,000/mo", "image": flat_imgs[1], "specs": "2 Bedroom • 1200 sqft", "amenities": ["Pool", "Clubhouse", "Security"]},
                {"id": 105, "type": "PG", "name": "HelloWorld Coliving", "area": "Marathahalli", "price": "₹9,000/mo", "image": pg_imgs[2], "specs": "Triple Sharing • Budget", "amenities": ["WiFi", "Laundry", "Mess"]}
            ]
        elif "hyderabad" in city_lower:
            listings = [
                {"id": 201, "type": "PG", "name": "Isthara Parks", "area": "Gachibowli", "price": "₹13,000/mo", "image": pg_imgs[3], "specs": "Twin Sharing • Near IT", "amenities": ["WiFi", "AC", "Transport"]},
                {"id": 202, "type": "PG", "name": "Boston Living", "area": "Hitex City", "price": "₹16,000/mo", "image": pg_imgs[1], "specs": "Single • Studio", "amenities": ["Cafe", "Library", "Gym"]},
                {"id": 203, "type": "Flat", "name": "Luxury 3BHK Villa", "area": "Jubilee Hills", "price": "₹65,000/mo", "image": flat_imgs[2], "specs": "3 Bedroom • 2500 sqft", "amenities": ["Private Garden", "Servant Room", "Security"]},
                {"id": 204, "type": "Flat", "name": "My Home Avatar 2BHK", "area": "Kukatpally", "price": "₹28,000/mo", "image": flat_imgs[3], "specs": "2 Bedroom • High Rise", "amenities": ["Tennis Court", "Pool", "Grocery"]}
            ]
        elif "chennai" in city_lower:
             listings = [
                {"id": 301, "type": "PG", "name": "Zolo OMR Stays", "area": "OMR", "price": "₹10,000/mo", "image": pg_imgs[2], "specs": "Twin Sharing • IT Hub", "amenities": ["AC", "WiFi", "Meals"]},
                {"id": 302, "type": "Flat", "name": "Sea View 2BHK", "area": "Adyar", "price": "₹30,000/mo", "image": flat_imgs[0], "specs": "2 Bedroom • Beach View", "amenities": ["Balcony", "Security", "Parking"]},
                {"id": 303, "type": "Flat", "name": "Phoenix Marketcity Flat", "area": "Velachery", "price": "₹22,000/mo", "image": flat_imgs[1], "specs": "2 Bedroom • Shop Hub", "amenities": ["Mall Access", "Gym", "Power Backup"]},
                {"id": 304, "type": "PG", "name": "Ladies Special PG", "area": "Anna Nagar", "price": "₹12,000/mo", "image": pg_imgs[0], "specs": "Twin • Safe", "amenities": ["CCTV", "Warden", "Food"]}
            ]
        else:
             # Generic
             listings = [
                {"id": 901, "type": "PG", "name": "City Central PG", "area": "Downtown", "price": "₹10,000/mo", "image": pg_imgs[3], "specs": "Twin Sharing", "amenities": ["WiFi"]},
                {"id": 902, "type": "Flat", "name": "Modern Studio", "area": "Suburbia", "price": "₹15,000/mo", "image": flat_imgs[2], "specs": "1 Bedroom", "amenities": ["Parking"]}
             ]

        return listings


    @staticmethod
    def get_quality_of_life(city_name: str):
        """Mock quality of life stats."""
        # In real app, fetch from Teleport API
        return {
            "score": round(random.uniform(7.0, 9.8), 1),
            "safety": "High",
            "transport": "Excellent" if len(city_name) > 6 else "Good",
            "nightlife": "Vibrant"
        }
