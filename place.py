import requests
requests.packages.urllib3.util.connection.HAS_IPV6 = False



params = {
    "q": "25832",
    "format": "json",
    "countrycodes": "de",
    "limit": 10,
    "addressdetails": 1
}


response = requests.get("https://nominatim.openstreetmap.org/search", params=params, timeout=5, headers={"User-Agent": "meine-kalender-app"})
print(response.json())

data = response.json()
prioritaet = {
    "city": 1,
    "town": 2,
    "village": 3,
    "municipality": 4,
    "suburb": 5,
    "road": 6,
    "residential": 7,
    "house": 8,
}

data.sort(key=lambda x: prioritaet.get(x.get("type"), 99))

print("Das ist der Display name")
if data:
    for data in data:
        print(data["display_name"])

else:
    print("Kein Treffer gefunden")