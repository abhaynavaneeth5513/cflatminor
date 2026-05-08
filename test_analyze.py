import requests
import json

try:
    with open('backend/test_audio.wav', 'rb') as f:
        res = requests.post('http://localhost:8000/analyze', files={'file': f})
    
    print("Status Code:", res.status_code)
    try:
        print(json.dumps(res.json(), indent=2))
    except:
        print("Response Text:", res.text)
except Exception as e:
    print(f"Error: {e}")
